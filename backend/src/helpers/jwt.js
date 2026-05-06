const jwt = require("jsonwebtoken");

const generarJWT = (uid, nombre, rol) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, nombre, rol };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION,
            },
            (err, token) => {
                if (err) {
                    logger.error("No se pudo generar el token", err);
                    reject("No se pudo generar el token");
                } else {
                    resolve(token);
                }
            },
        );
    });
};

const generarRefreshToken = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION,
            },
            (err, token) => {
                if (err) {
                    logger.error("Error al generar Refresh Token:", err);
                    reject("No se pudo generar el token de refresco");
                } else {
                    resolve(token);
                }
            },
        );
    });
};

module.exports = {
    generarJWT,
    generarRefreshToken,
};
