const winston = require("winston"); //

// configuracion del formato de los logs
const logFormat = winston.format.combine(
    //
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), //
    winston.format.json(), //
);

// Comprobamos si estamos en producción (Vercel)
const isProduction = process.env.NODE_ENV === "production";

// Arrays de configuración dinámicos
const transportesLocales = [
    // archivo de errores
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), //
    // archivo que guarda todo
    new winston.transports.File({ filename: "logs/combinado.log" }), //
];

const manejoExcepcionesLocales = [
    // para errores no atrapados
    new winston.transports.File({ filename: "logs/exceptions.log" }), //
    //mostrar error en consola tambien
    new winston.transports.Console({
        //
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ), //
    }),
];

const manejoRechazosLocales = [
    // para promesas rechazadas no manejadas
    new winston.transports.File({ filename: "logs/rejections.log" }), //
    //mostrar error en consola tambien
    new winston.transports.Console({
        //
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ), //
    }),
];

const logger = winston.createLogger({
    //
    format: logFormat, //
    // Si es prod mandamos a consola (Vercel lo atrapa), si no, usamos los archivos
    transports: isProduction
        ? [new winston.transports.Console()]
        : transportesLocales,
    exceptionHandlers: isProduction
        ? [new winston.transports.Console()]
        : manejoExcepcionesLocales,
    rejectionHandlers: isProduction
        ? [new winston.transports.Console()]
        : manejoRechazosLocales,
});

// si no es produccion, se manda a consola tmb
if (!isProduction) {
    logger.add(
        //
        new winston.transports.Console({
            //
            level: "debug", //
            format: winston.format.combine(
                //
                winston.format.colorize(), //
                winston.format.simple(), //
            ),
        }),
    );
}

module.exports = logger; //
