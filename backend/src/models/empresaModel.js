const mongoose = require("mongoose");
const imagenSchema = require("./imagenModel");

const empresaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        correo: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        slogan: {
            type: String,
            required: true,
        },
        direccion: {
            type: String,
            required: true,
        },
        logo: {
            type: imagenSchema,
            required: true,
        },
        imagenPrincipal: {
            type: imagenSchema,
            required: true,
        },
        galeria: [
            {
                type: imagenSchema,
                required: true,
            },
        ],
        horarioGlobal: [
            {
                dia: {
                    type: String,
                    enum: [
                        "lunes",
                        "martes",
                        "miercoles",
                        "jueves",
                        "viernes",
                        "sabado",
                        "domingo",
                    ],
                    required: true,
                },
                horaInicio: {
                    type: String,
                    required: true,
                },
                horaFin: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }, // Crea 'createdAt' y 'updatedAt' solitos
);

module.exports = mongoose.model("Empresa", empresaSchema);
