const { body } = require("express-validator");
const mongoose = require("mongoose");
const Empleado = require("../models/empleadoModel");
const Empresa = require("../models/empresaModel");
const Suspension = require("../models/suspensionModel");

const createSuspensionValidator = [
    body("empleadoId").custom(async (value) => {
        // si no se manda el id es pq es para todos los empleados
        if (!value || value === "") {
            return true;
        }

        // verificar el id
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error("El ID del empleado no tiene un formato válido.");
        }

        // checar que exista el empleado
        const empleadoExiste = await Empleado.findById(value);
        if (!empleadoExiste) {
            throw new Error(
                "El empleado asignado a esta suspensión no existe en la base de datos.",
            );
        }

        return true;
    }),
    body("fecha")
        .notEmpty()
        .withMessage("La fecha de la suspensión es requerida")
        .isISO8601()
        .toDate()
        .custom(async (value, { req }) => {
            // que no sea una fecha en el pasado
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (value < hoy)
                throw new Error(
                    "No puedes programar una suspensión en el pasado.",
                );

            const diaSemana = value
                .toLocaleDateString("es-ES", {
                    weekday: "long",
                    timeZone: "UTC",
                })
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            // ver el horario del empelado o de la empresa para ese día
            let horarioLaboral;
            if (!req.body.empleadoId) {
                const empresa = await Empresa.findOne();
                horarioLaboral = empresa?.horarioGlobal.find(
                    (h) => h.dia === diaSemana,
                );
                if (!horarioLaboral)
                    throw new Error(
                        `La empresa no abre los días ${diaSemana}.`,
                    );
            } else {
                const empleado = await Empleado.findById(req.body.empleadoId);
                if (!empleado) throw new Error("Empleado no encontrado.");
                horarioLaboral = empleado.horario.find(
                    (h) => h.dia === diaSemana,
                );
                if (!horarioLaboral)
                    throw new Error(
                        `El empleado no trabaja los días ${diaSemana}.`,
                    );
            }

            // validar que la suspension esté dentro del horario laboral, si es q no es todo el dia
            if (!req.body.todoElDia) {
                const { horaInicio, horaFin } = req.body;
                if (
                    horaInicio < horarioLaboral.horaInicio ||
                    horaFin > horarioLaboral.horaFin
                ) {
                    throw new Error(
                        `La suspensión debe estar dentro del horario laboral (${horarioLaboral.horaInicio} - ${horarioLaboral.horaFin}).`,
                    );
                }
            }

            // solapamiento de suspensiones
            const suspensionPrevia = await Suspension.findOne({
                empleadoId: req.body.empleadoId || null,
                fecha: value,
                activo: true,
                $or: [
                    { todoElDia: true }, // Si ya hay una en todo el dia
                    {
                        // O si hay una parcial que choque con las nuevas horas
                        $and: [
                            {
                                horaInicio: {
                                    $lt: req.body.todoElDia
                                        ? "23:59"
                                        : req.body.horaFin,
                                },
                            },
                            {
                                horaFin: {
                                    $gt: req.body.todoElDia
                                        ? "00:00"
                                        : req.body.horaInicio,
                                },
                            },
                        ],
                    },
                ],
            });

            if (suspensionPrevia) {
                throw new Error(
                    "Ya existe una suspensión activa que se solapa con este horario.",
                );
            }

            return true;
        }),

    body("todoElDia")
        .isBoolean()
        .withMessage("El campo todoElDia debe ser verdadero o falso"),

    body("horaInicio").custom((value, { req }) => {
        if (req.body.todoElDia === true) return true;

        if (!value) {
            throw new Error(
                "La hora de inicio es requerida cuando no es todo el día.",
            );
        }

        if (!/^([0-1]?[0-9]|2[0-3]):(00|30)$/.test(value)) {
            throw new Error(
                "La hora de inicio debe tener formato HH:MM (en bloques de 00 o 30).",
            );
        }
        return true;
    }),

    body("horaFin").custom((value, { req }) => {
        if (req.body.todoElDia === true) return true;

        if (!value) {
            throw new Error(
                "La hora de fin es requerida cuando no es todo el día.",
            );
        }

        if (!/^([0-1]?[0-9]|2[0-3]):(00|30)$/.test(value)) {
            throw new Error(
                "La hora de fin debe tener formato HH:MM (en bloques de 00 o 30).",
            );
        }

        // Validar que inicio sea antes que fin
        if (req.body.horaInicio && value <= req.body.horaInicio) {
            throw new Error(
                "La hora de fin debe ser mayor a la hora de inicio.",
            );
        }

        return true;
    }),
];

module.exports = { createSuspensionValidator };
