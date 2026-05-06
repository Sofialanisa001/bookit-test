const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const logTransacciones = require("./middleware/logMiddleware");
const cors = require("cors");
const path = require("path");
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger global
const logger = require("./config/logger");
global.logger = logger;

// Middlewares globales
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    }),
);

// middleware de logs
app.use(logTransacciones);

// Rutas
const authRoutes = require("./routes/authRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const empleadoRoutes = require("./routes/empleadoRoutes");
const suspensionRoutes = require("./routes/suspensionRoutes");
const citasRoutes = require("./routes/citaRoutes");
const reporteRoutes = require("./routes/reporteRoutes");

// importar rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/suspensiones", suspensionRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/reportes", reporteRoutes);

// PARA SERVIR REACT Y BACK EN PRODUCCIÓN JUNTOS
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "public");

    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

const PORT = process.env.PORT || 5001;

// Conectar la base de datos
connectDB()
    .then(() => {
        // solo si se conectó la base de datos arrancamos el servidor
        app.listen(PORT, () => {
            logger.info(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error("El servidor falló. Checar conexión con la BD:", err);
    });

module.exports = app; // exportar para testing
