const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema(
    {
        usuarioId: {
            // NO ES REQUERIDO PORQUE SE PUEDE AGENDAR UNA CITA PARA UN TERCERO, PERO SI SE INGRESA, DEBE EXISTIR EN LA COLECCIÓN DE USUARIOS
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        }, // viene del front, el ID del cliente que tiene la sesión iniciada

        empleadoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Empleado",
        }, // ID del empleado que el cliente seleccionó

        fecha: {
            type: Date,
            required: true,
        },

        horaInicio: {
            type: String,
            required: true,
        },

        // SE CALCULA EN EL BACK ** nota para aylin
        // ** QUIZA NO HACE FALTA GUARDARLO, PERO PUEDE QUE SEA MAS FACIL EN EL FRONT YA TENERLO **
        // la duración total de todos los servicios seleccionados.
        horaFin: {
            type: String,
            required: true,
        },

        // SE ARMA EN EL BACK ** nota para aylin
        // El Front manda el ID del servicio, y haces un findById(), sacas estos datos y los pegas aquí para congelar el precio y duración
        servicioAgendado: {
            servicioId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Servicio",
                required: true,
            },
            nombreSnapshot: {
                type: String,
                required: true,
            },
            precioSnapshot: {
                type: Number,
                required: true,
            },
            duracionSnapshot: {
                type: Number,
                required: true,
            }, // en minutos
        },

        estado: {
            type: String,
            enum: ["pendiente", "confirmada", "realizada", "cancelada"],
            default: "pendiente",
        },

        datosCliente: {
            // es por si es para un tercero
            nombre: { type: String, required: true },
            edad: { type: Number, required: true },
            sexo: { type: String, required: true },
            telefono: { type: String, required: true },
            correo: { type: String, required: true },
        },
    },
    { timestamps: true }, // Crea 'createdAt' y 'updatedAt' solitos
);

module.exports = mongoose.model("Cita", citaSchema);
