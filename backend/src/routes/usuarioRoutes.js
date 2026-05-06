const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");

//Validador
const {editarPerfilValidator} = require("../validators/usuarioValidator.js");
//Controlador
const { getPerfil, updatePerfil } = require("../controllers/usuarioController");

//Rutas
router.get("/perfil", [validarJWT], getPerfil);
router.patch("/perfil", [validarJWT, editarPerfilValidator, validarCampos], updatePerfil);

module.exports = router;