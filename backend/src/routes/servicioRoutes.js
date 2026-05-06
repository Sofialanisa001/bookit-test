const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");
const validarMongoId = require("../middleware/validarMongoId");
const subirArchivos = require("../middleware/subirArchivos");

// Importar validador de campos
const {
    createServicioValidator,
    updateServicioValidator,
} = require("../validators/servicioValidator");

// Importar controladores
const {
    getAllServicios,
    getOneServicio,
    createServicio,
    updateServicio,
    deleteServicio,
} = require("../controllers/servicioController");

//////////////////RUTAS PÚBLICAS////////////////
router.get("/", getAllServicios);
router.get("/:id", [validarMongoId()], getOneServicio);

//////////////////RUTAS SOLO ADMIN////////////////

router.post(
    "/",
    [
        validarJWT,
        validarAdmin,
        subirArchivos,
        createServicioValidator,
        validarCampos,
    ],
    createServicio,
);

router.patch(
    "/:id",
    [
        validarJWT,
        validarAdmin,
        subirArchivos,
        validarMongoId(),
        updateServicioValidator,
        validarCampos,
    ],
    updateServicio,
);

router.delete(
    "/:id",
    [validarJWT, validarAdmin, validarMongoId()],
    deleteServicio,
);

module.exports = router;
