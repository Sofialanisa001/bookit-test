const winston = require("winston");

// configuracion del formato de los logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
);

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // archivo de errores
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        // archivo que guarda todo
        new winston.transports.File({
            filename: "logs/combinado.log",
        }),
    ],
    exceptionHandlers: [
        // para errores no atrapados
        new winston.transports.File({ filename: "logs/exceptions.log" }),

        //mostrar error en consola tambien
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
    rejectionHandlers: [
        // para promesas rechazadas no manejadas
        new winston.transports.File({ filename: "logs/rejections.log" }),

        //mostrar error en consola tambien
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});

// si no es produccion, se manda a consola tmb
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
