/*
    nombre: string
    descripcion: string
    precio: number
    timpo_estimado: number
    foto: string        // SE GUARDARÍA EN CLOUDINARY, SE GUARDARÍA LA URL EN MONGO
*/

const mongoose = require("mongoose");
const imagenSchema = require("./imagenModel");

const servicioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
        },
        duracion: {
            type: Number,
            default: 30,
        },
        foto: {
            type: imagenSchema,
            required: true,
        },
        activo: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }, // Crea 'createdAt' y 'updatedAt' solitos
);

module.exports = mongoose.model("Servicio", servicioSchema);
