const winston = require("winston");

// Configuración del formato de los logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
);

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // SOLO usamos archivos si NO estamos en Vercel/Producción
        ...(process.env.NODE_ENV !== "production"
            ? [
                  new winston.transports.File({
                      filename: "logs/error.log",
                      level: "error",
                  }),
                  new winston.transports.File({
                      filename: "logs/combinado.log",
                  }),
              ]
            : [
                  // En producción solo mandamos a consola para que Vercel lo vea
                  new winston.transports.Console({
                      format: winston.format.simple(),
                  }),
              ]),
    ],
    exceptionHandlers: [
        // Mismo truco: solo archivos en desarrollo
        ...(process.env.NODE_ENV !== "production"
            ? [new winston.transports.File({ filename: "logs/exceptions.log" })]
            : [new winston.transports.Console()]),
    ],
    rejectionHandlers: [
        // Evitamos crear archivos de rechazo en producción
        ...(process.env.NODE_ENV !== "production"
            ? [new winston.transports.File({ filename: "logs/rejections.log" })]
            : [new winston.transports.Console()]),
    ],
});

// Si estamos en desarrollo, agregamos el formato bonito con colores
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    );
}

module.exports = logger;
