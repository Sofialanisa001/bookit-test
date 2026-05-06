const { body } = require("express-validator");
const { validarImagen } = require("../helpers/validatorHelpers");

const createServicioValidator = [
    // nombre - exista y no este vacio
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre del servicio es requerido")
        .isLength({ max: 100 })
        .withMessage("El nombre excedió longitud"),

    body("descripcion")
        // descripcion - exista y no este vacia
        .trim()
        .notEmpty()
        .withMessage("La descripción es requerida")
        .isLength({ max: 500 })
        .withMessage("La descripción excedió longitud"),

    body("precio")
        // precio - exista, sea numerico y no negativo
        .notEmpty()
        .withMessage("Debe asignar un precio")
        .isNumeric()
        .withMessage("El precio debe ser un número")
        .custom((value) => {
            if (value < 0) throw new Error("El precio no puede ser negativo");
            return true;
        }),

    body("duracion")
        // duracion - opcional porq el default es 30min, que sea numerico, no mayor a 3h y no negativo
        .optional()
        .isInt({ min: 30, max: 180 })
        .withMessage(
            "La duración debe ser un número entero entre 30 y 180 minutos (3hrs)",
        )
        .custom((value) => {
            if (value % 30 !== 0) {
                throw new Error(
                    "La duración debe ser en bloques exactos de media hora (ej. 30, 60, 90, 120, 150, 180).",
                );
            }
            return true;
        }),

    body("foto").custom(validarImagen(false)),
];

const updateServicioValidator = [
    // nombre - exista y no este vacio
    body("nombre")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre del servicio es requerido")
        .isLength({ max: 100 })
        .withMessage("El nombre excedió longitud"),

    body("descripcion")
        // descripcion - exista y no este vacia
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La descripción es requerida")
        .isLength({ max: 500 })
        .withMessage("La descripción excedió longitud"),

    body("precio")
        // precio - exista, sea numerico y no negativo
        .optional()
        .notEmpty()
        .withMessage("Debe asignar un precio")
        .isNumeric()
        .withMessage("El precio debe ser un número")
        .custom((value) => {
            if (value < 0) throw new Error("El precio no puede ser negativo");
            return true;
        }),

    body("duracion")
        .optional() // opcional pq el default es 30min
        .isInt({ min: 30, max: 180 })
        .withMessage(
            "La duración debe ser un número entero entre 30 y 180 minutos (3hrs)",
        )
        .custom((value) => {
            if (value % 30 !== 0) {
                throw new Error(
                    "La duración debe ser en bloques exactos de media hora (ej. 30, 60, 90, 120, 150, 180).",
                );
            }
            return true;
        }),

    body("foto").custom(validarImagen(true)),
];

module.exports = { createServicioValidator, updateServicioValidator };
