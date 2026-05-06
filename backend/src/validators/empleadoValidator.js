const { body } = require("express-validator");
const Empleado = require("../models/empleadoModel");
const mongoose = require("mongoose");
const Servicio = require("../models/servicioModel");
const Empresa = require("../models/empresaModel");

const {
    validarImagen,
    sanitizarArregloIDs,
    sanitizarArreglo,
    validarEstructuraHorario,
    validarFechaNacimiento,
} = require("../helpers/validatorHelpers");

const createEmpleadoValidator = [
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
        .normalizeEmail() //convierte mayusculas a minusculas y elimina puntos innecesarios
        .custom(async (value) => {
            // checa si el correo ya existe en la db
            const empleadoExistente = await Empleado.findOne({ correo: value });
            if (empleadoExistente) {
                // si existe lanza un error
                throw new Error("El correo electrónico ya está registrado");
            }
            return true;
        }),

    body("telefono")
        .trim()
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .isMobilePhone("any")
        .withMessage("El teléfono debe ser válido"),

    body("fechaNacimiento")
        .trim()
        .notEmpty()
        .withMessage("La fecha de nacimiento es requerida")
        .isISO8601() // AAAAA-MM-DD
        .toDate()
        .custom(validarFechaNacimiento),

    body("informacion")
        .trim()
        .notEmpty()
        .withMessage("La información es requerida")
        .isLength({ max: 500 })
        .withMessage("La información no puede tener más de 500 caracteres"),

    body("foto").custom(validarImagen(false)),

    body("servicios")
        .customSanitizer(sanitizarArregloIDs)
        .isArray()
        .withMessage("Los servicios deben enviarse como un arreglo")
        .custom(async (serviciosArray) => {
            if (serviciosArray.length === 0) return true;

            //validar que los strings tengan formato de ObjectId
            const idsValidos = serviciosArray.every((id) =>
                mongoose.Types.ObjectId.isValid(id),
            );

            if (!idsValidos) {
                throw new Error(
                    "Uno o más IDs de servicios no tienen un formato válido",
                );
            }

            // verificar que esos servicios existan
            const serviciosEncontrados = await Servicio.countDocuments({
                _id: { $in: serviciosArray },
                activo: true,
            });

            if (serviciosEncontrados !== serviciosArray.length) {
                throw new Error(
                    "Uno o más servicios seleccionados no existen en la base de datos",
                );
            }

            return true;
        }),

    body("horario")
        .customSanitizer(sanitizarArreglo)
        .isArray()
        .withMessage("El horario debe de enviarse como un arreglo")
        .custom(async (horarioArray) => {
            if (horarioArray.length === 0) return true;
            validarEstructuraHorario(horarioArray);

            const empresa = await Empresa.findOne();

            if (!empresa || !empresa.horarioGlobal) {
                throw new Error(
                    "No se puede validar el horario porque la empresa no tiene un horario configurado.",
                );
            }

            for (const turno of horarioArray) {
                const horarioEmpresaDia = empresa.horarioGlobal.find(
                    (h) => h.dia === turno.dia,
                );

                if (!horarioEmpresaDia) {
                    throw new Error(
                        `La empresa no abre los días ${turno.dia}, no le puedes asignar turno ese día.`,
                    );
                }

                if (turno.horaInicio < horarioEmpresaDia.horaInicio) {
                    throw new Error(
                        `En ${turno.dia}, el empleado no puede entrar antes (${turno.horaInicio}) de que abra la empresa (${horarioEmpresaDia.horaInicio}).`,
                    );
                }

                if (turno.horaFin > horarioEmpresaDia.horaFin) {
                    throw new Error(
                        `En ${turno.dia}, el empleado no puede salir después (${turno.horaFin}) del cierre de la empresa (${horarioEmpresaDia.horaFin}).`,
                    );
                }
            }

            return true;
        }),
];

const updateEmpleadoValidator = [
    body("nombre")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 3, max: 80 })
        .withMessage("El nombre debe tener entre 3 y 80 caracteres")
        .escape(), // para evitar inyecciones de codigo, convierte caracteres especiales a entidades HTML

    body("correo")
        .optional()
        .isEmail()
        .withMessage("El correo debe ser válido")
        .normalizeEmail() //convierte mayusculas a minusculas y elimina puntos innecesarios
        .custom(async (value, { req }) => {
            // checa si el correo ya existe en la db
            const empleadoExistente = await Empleado.findOne({
                correo: value,
                _id: { $ne: req.params.id }, // excluye al empleado actual de la búsqueda
            });
            if (empleadoExistente) {
                // si existe lanza un error
                throw new Error("El correo electrónico ya está registrado");
            }
            return true;
        }),

    body("telefono")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .isMobilePhone("any")
        .withMessage("El teléfono debe ser válido"),

    body("fechaNacimiento")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La fecha de nacimiento es requerida")
        .isISO8601() // AAAAA-MM-DD
        .toDate()
        .custom(validarFechaNacimiento),

    body("informacion")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La información es requerida")
        .isLength({ max: 500 })
        .withMessage("La información no puede tener más de 500 caracteres"),

    body("foto").custom(validarImagen(true)),

    body("servicios")
        .optional()
        .customSanitizer(sanitizarArregloIDs)
        .isArray()
        .withMessage("Los servicios deben enviarse como un arreglo")
        .custom(async (serviciosArray, { req }) => {
            if (serviciosArray.length === 0) return true;

            //validar que los strings tengan formato de ObjectId
            const idsValidos = serviciosArray.every((id) =>
                mongoose.Types.ObjectId.isValid(id),
            );

            if (!idsValidos) {
                throw new Error(
                    "Uno o más IDs de servicios no tienen un formato válido",
                );
            }

            // verificar que esos servicios existan
            const serviciosEncontrados = await Servicio.countDocuments({
                _id: { $in: serviciosArray },
                activo: true,
            });

            if (serviciosEncontrados !== serviciosArray.length) {
                throw new Error(
                    "Uno o más servicios seleccionados no existen en la base de datos",
                );
            }

            return true;
        }),

    body("horario")
        .optional()
        .customSanitizer(sanitizarArreglo)
        .isArray()
        .withMessage("El horario debe de enviarse como un arreglo")
        .custom(async (horarioArray, { req }) => {
            if (horarioArray.length === 0) return true;
            validarEstructuraHorario(horarioArray);

            const empresa = await Empresa.findOne();

            if (!empresa || !empresa.horarioGlobal) {
                throw new Error(
                    "No se puede validar el horario porque la empresa no tiene un horario configurado.",
                );
            }

            for (const turno of horarioArray) {
                const horarioEmpresaDia = empresa.horarioGlobal.find(
                    (h) => h.dia === turno.dia,
                );

                if (!horarioEmpresaDia) {
                    throw new Error(
                        `La empresa no abre los días ${turno.dia}, no le puedes asignar turno ese día.`,
                    );
                }

                if (turno.horaInicio < horarioEmpresaDia.horaInicio) {
                    throw new Error(
                        `En ${turno.dia}, el empleado no puede entrar antes (${turno.horaInicio}) de que abra la empresa (${horarioEmpresaDia.horaInicio}).`,
                    );
                }

                if (turno.horaFin > horarioEmpresaDia.horaFin) {
                    throw new Error(
                        `En ${turno.dia}, el empleado no puede salir después (${turno.horaFin}) del cierre de la empresa (${horarioEmpresaDia.horaFin}).`,
                    );
                }
            }

            return true;
        }),
];

module.exports = { createEmpleadoValidator, updateEmpleadoValidator };
