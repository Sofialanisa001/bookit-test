const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");

// Validador de campos
const {
    registroValidator,
    loginValidator,
} = require("../validators/authValidator");

// Autenticación de usuarios
const {
    registrarUsuario,
    loginUsuario,
    refrescarToken,
    logoutUsuario,
} = require("../controllers/authController");

// Rutas de autenticación
router.post("/registro", [registroValidator, validarCampos], registrarUsuario);
router.post("/login", [loginValidator, validarCampos], loginUsuario);
router.post("/logout", [validarJWT], logoutUsuario);
router.post("/refresh", refrescarToken);

// Ruta de prueba protegida
router.get("/rutaProtegidaTest", [validarJWT], (req, res) => {
    res.json({
        ok: true,
        msg: `${req.nombre} ruta protegida`,
        uid: req.uid,
        rol: req.rol,
    });
});

module.exports = router;
