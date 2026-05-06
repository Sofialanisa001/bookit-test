const mongoose = require("mongoose");

const validarMongoId = (paramName = "id") => {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!id) {
            return res.status(400).json({
                ok: false,
                msg: `El parámetro '${paramName}' es requerido.`,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: `El formato del parámetro '${paramName}' no es un ID válido de base de datos.`,
            });
        }

        next();
    };
};

module.exports = validarMongoId;
