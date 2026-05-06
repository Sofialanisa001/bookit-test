const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
    // extraer la cookie
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la petición",
        });
    }

    try {
        // verificar el token
        const { uid, nombre, rol } = jwt.verify(token, process.env.JWT_SECRET);

        // inyectar los datos en el req para que la ruta los use
        req.uid = uid;
        req.nombre = nombre;
        req.rol = rol;

        next();
    } catch (error) {
        logger.error("Token no válido:", error);
        return res.status(401).json({
            ok: false,
            msg: "Token no válido",
        });
    }
};

module.exports = { validarJWT };
