const winston = require("winston");

// Configuración del formato de los logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
);

const logger = winston.createLogger({
    format: logFormat,

    // ESTA ES LA CLAVE: Si detecta que es producción, el logger deja de imprimir
    // pero el objeto sigue existiendo para que el resto de tu código no falle.
    silent: process.env.NODE_ENV === "production",

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
                  // En producción, si 'silent' fuera false, esto mandaría a la consola de Vercel
                  new winston.transports.Console({
                      format: winston.format.simple(),
                  }),
              ]),
    ],
    exceptionHandlers: [
        // Evitamos crear archivos de excepciones en el sistema de solo lectura de Vercel
        ...(process.env.NODE_ENV !== "production"
            ? [new winston.transports.File({ filename: "logs/exceptions.log" })]
            : [new winston.transports.Console()]),
    ],
    rejectionHandlers: [
        // Evitamos crear archivos de promesas rechazadas en producción
        ...(process.env.NODE_ENV !== "production"
            ? [new winston.transports.File({ filename: "logs/rejections.log" })]
            : [new winston.transports.Console()]),
    ],
});

// Si estás en tu computadora (desarrollo), se ve bonito y con colores en la terminal
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
