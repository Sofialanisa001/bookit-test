const { body } = require("express-validator");

const {
    validarImagen,
    sanitizarArreglo,
    validarEstructuraHorario,
    validarGaleria,
} = require("../helpers/validatorHelpers");

const updateEmpresaValidator = [
    body("nombre")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre de la empresa no puede estar vacío")
        .isLength({ max: 100 })
        .withMessage("El nombre de la empresa excedió longitud"),

    body("correo")
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail() //convierte mayusculas a minusculas y elimina puntos innecesarios
        .withMessage("El correo de la empresa no es válido"),

    body("telefono")
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage(
            "El teléfono de la empresa debe tener entre 10 y 15 caracteres",
        )
        .matches(/^\+?[0-9\s\-]+$/)
        .withMessage(
            "El teléfono de la empresa debe contener solo números, espacios, guiones o un signo + al inicio",
        ),

    body("descripcion")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La descripción de la empresa no puede estar vacía")
        .isLength({ max: 1000 })
        .withMessage("La descripción de la empresa excedió la longitud máxima"),

    body("direccion")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("La dirección de la empresa no puede estar vacía"),

    body("slogan")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El slogan de la empresa no puede estar vacío")
        .isLength({ max: 500 })
        .withMessage("El slogan de la empresa excedió la longitud máxima"),

    body("logo").custom(validarImagen(true)),

    body("imagenPrincipal").custom(validarImagen(true)),

    // galeria conservada
    body("galeriaConservada")
        .optional()
        .customSanitizer(sanitizarArreglo)
        .isArray()
        .withMessage("La galería conservada debe de enviarse como un arreglo")
        .custom(validarGaleria),

    body("horarioGlobal")
        .optional()
        .customSanitizer(sanitizarArreglo)
        .isArray()
        .withMessage("El horario debe de enviarse como un arreglo")
        .custom(async (value, { req }) => {
            if (value.length === 0) return true;
            validarEstructuraHorario(value);

            return true;
        }),
];

module.exports = {
    updateEmpresaValidator,
};
