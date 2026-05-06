const mongoose = require("mongoose");

// hace que podamos usar este schema como subdocumento en otros schemas, sin necesidad de crear un modelo aparte para Imagen. Es como una estructura sin que sea una tabla extra en la bd.
const imagenSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }, // Crea 'createdAt' y 'updatedAt' solitos
);

module.exports = imagenSchema;
