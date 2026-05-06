const logTransacciones = (req, res, next) => {
    // filtra datos sensibles
    const { password, ...bodySeguro } = req.body || {};
    logger.info({
        mensaje: `Transacción: ${req.method} ${req.url}`,
        detalles: {
            metodo: req.method,
            url: req.originalUrl,
            headers: {
                host: req.get("host"),
                contentType: req.get("content-type"),
            },
            ip: req.ip,
            usuarioAgent: req.get("User-Agent"),
            body: bodySeguro,
            params: req.params,
            query: req.query,
        },
    });
    next();
};

module.exports = logTransacciones;
