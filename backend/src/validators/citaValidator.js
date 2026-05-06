const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const Empleado = require("../models/empleadoModel");
const Servicio = require("../models/servicioModel");
const Usuario = require("../models/usuarioModel");
const Cita = require("../models/citaModel");
const {
    calcularHorariosDisponibles,
} = require("../helpers/disponibilidadHelper");

const createCitaValidator = [
    body("empleadoId").custom(async (value) => {
        if (!value || value === "") {
            throw new Error("El id del empleado no puede venir vacío");
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("El id del empleado no tiene un formato válido");
        }
        const empleadoExiste = await Empleado.findById(value);
        if (!empleadoExiste) {
            throw new Error("No se encontró el empleado en la base de datos");
        }
        return true;
    }),

    body("servicioId").custom(async (value, { req }) => {
        if (!value || value === "") {
            throw new Error("El id del servicio no puede venir vacío");
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("El id del servicio no tiene un formato válido");
        }
        const servicioExiste = await Servicio.findById(value);
        if (!servicioExiste) {
            throw new Error("No se encontró el servicio en la base de datos");
        }

        const empleado = await Empleado.findById(req.body.empleadoId);

        if (empleado) {
            const ofreceServicio = empleado.servicios.some(
                (idServicio) => idServicio.toString() === value,
            );

            if (!ofreceServicio) {
                throw new Error(
                    "El empleado seleccionado no ofrece este servicio.",
                );
            }
        }

        return true;
    }),

    body("usuarioId").custom(async (value, { req }) => {
        if (!req.uid || req.uid === "") {
            throw new Error("El id del usuario no puede venir vacío");
        }
        if (!mongoose.Types.ObjectId.isValid(req.uid)) {
            throw new Error("El id del usuario no tiene un formato válido");
        }
        const usuarioExiste = await Usuario.findById(req.uid);
        if (!usuarioExiste) {
            throw new Error("No se encontró el usuario en la base de datos");
        }
        return true;
    }),

    body("fecha")
        .notEmpty()
        .withMessage("La fecha de la cita es requerida")
        .isISO8601()
        .toDate()
        .custom(async (value) => {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (value < hoy) {
                throw new Error("No puedes programar una cita en el pasado.");
            }
            return true;
        }),

    body("horaInicio").custom(async (value, { req }) => {
        if (!value) {
            throw new Error("La hora de inicio es requerida");
        }
        if (!/^([0-1]?[0-9]|2[0-3]):(00|30)$/.test(value)) {
            throw new Error(
                "La hora de inicio debe tener formato HH:MM (en bloques de 00 o 30).",
            );
        }

        const { fecha, empleadoId, servicioId } = req.body;

        // buscar el servicio para saber de cuánto tiempo es
        const servicio = await Servicio.findById(servicioId);
        const duracionMinutos = servicio ? servicio.duracion || 30 : 30;

        // traer los horarios libres
        const horariosDisponibles = await calcularHorariosDisponibles(
            fecha,
            empleadoId,
            duracionMinutos,
        );

        // verificar que el horario seleccionado esté entre los disponibles
        if (!horariosDisponibles.includes(value)) {
            throw new Error(
                "El horario seleccionado ya no está disponible, el empleado no trabaja en ese horario, o el servicio excede el tiempo libre restante.",
            );
        }

        return true;
    }),

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 3, max: 80 }) // se pueden separar pero por simplicidad asi lo deje
        .withMessage("El nombre debe tener entre 3 y 80 caracteres")
        .escape(), // para evitar inyecciones de codigo, convierte caracteres especiales a entidades HTML

    body("correo")
        .isEmail()
        .withMessage("El correo debe ser válido")
        .normalizeEmail(),

    body("sexo")
        .toLowerCase()
        .notEmpty()
        .withMessage("El sexo es requerido")
        .isIn(["masculino", "femenino"])
        .withMessage("El sexo debe ser 'masculino' o 'femenino'"),

    body("telefono")
        .trim()
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .isMobilePhone("any")
        .withMessage("El teléfono debe ser válido"),

    body("edad")
        .trim()
        .notEmpty()
        .withMessage("La edad es requerida")
        .isInt({ min: 10 })
        .withMessage("La edad debe ser un número positivo y mayor a 10"),
];

const updateCitaStatusValidator = [
    // id de mongo
    param("id").custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("El ID de la cita no tiene un formato válido");
        }
        return true;
    }),

    body("status")
        .notEmpty()
        .withMessage("El estado es requerido")
        .isIn(["pendiente", "confirmada", "realizada", "cancelada"])
        .withMessage("El estado no es válido")
        .custom(async (value, { req }) => {
            // validar que solo puedan cancelar las citas si son clinetes
            if (req.rol === "CLIENTE" && value !== "cancelada") {
                throw new Error("Los clientes solo pueden cancelar sus citas.");
            }

            // no se puede realizar una cita del futuro
            if (value === "realizada") {
                // buscar la cita para saber su fecha
                const cita = await Cita.findById(req.params.id);
                if (!cita) {
                    return false;
                }

                // normalizar las fechas para comparar solo el dia
                const hoy = new Date();
                hoy.setUTCHours(0, 0, 0, 0);

                const fechaCita = new Date(cita.fecha);
                fechaCita.setUTCHours(0, 0, 0, 0);

                if (hoy < fechaCita) {
                    throw new Error(
                        "No puedes marcar una cita como realizada antes de su fecha programada.",
                    );
                }
            }

            return true;
        }),
];

module.exports = { createCitaValidator, updateCitaStatusValidator };
