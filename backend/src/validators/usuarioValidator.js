const { body } = require("express-validator");
const Usuario = require("../models/usuarioModel");
const { validarFechaNacimiento } = require("../helpers/validatorHelpers");

const editarPerfilValidator = [
    body("nombre")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 3, max: 80 }) // se pueden separar pero por simplicidad asi lo deje
        .withMessage("El nombre debe tener entre 3 y 80 caracteres")
        .escape(), // para evitar inyecciones de codigo, convierte caracteres especiales a entidades HTML

    body("correo")
        .optional()
        .isEmail()
        .withMessage("El correo debe ser válido")
        .normalizeEmail() //convierte mayusculas a minusculas y elimina puntos innecesarios
        .custom(async (value, {req}) => {
            // checa si el correo ya existe en la db y es de otra persona
            const usuarioExistente = await Usuario.findOne({ correo: value });
            if (usuarioExistente && usuarioExistente._id.toString() !== req.uid) {
                // si existe lanza un error
                throw new Error("El correo electrónico ya está registrado por otro usuario");
            }
            return true;
        }),

    body("password")
        .optional({checkFalsy: true}) //si el campo llega vacio ignora la validacion
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .isLength({ max: 20 })
        .withMessage("La contraseña no puede tener más de 20 caracteres")
        .matches(/[A-Z]/)
        .withMessage("Debe contener al menos una letra mayúscula")
        .matches(/[a-z]/)
        .withMessage("Debe contener al menos una letra minúscula")
        .matches(/[0-9]/)
        .withMessage("Debe contener al menos un número")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Debe contener al menos un carácter especial"),

    body("passwordConfirmacion")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true;
    }),

    body("sexo")
        .optional()
        .toLowerCase()
        .notEmpty()
        .withMessage("El sexo es requerido")
        .isIn(["masculino", "femenino"])
        .withMessage("El sexo debe ser 'masculino' o 'femenino'"),

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
];
module.exports = {editarPerfilValidator};