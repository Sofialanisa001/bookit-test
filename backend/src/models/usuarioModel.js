/*
    nombres: string
    correo: string
    sexo: string
    telefono: string
    fecha_nacimiento: date
*/

const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        correo: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        sexo: {
            type: String,
            enum: ["masculino", "femenino"],
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        fechaNacimiento: {
            type: Date,
            required: true,
        },
        rol: {
            type: String,
            enum: ["CLIENTE", "ADMIN"],
            default: "CLIENTE",
        },
    },
    { timestamps: true }, // Crea 'createdAt' y 'updatedAt' solitos
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
