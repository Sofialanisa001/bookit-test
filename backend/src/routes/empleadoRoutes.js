const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");

const validarMongoId = require("../middleware/validarMongoId");
const subirArchivos = require("../middleware/subirArchivos");

// validadores
const {
    createEmpleadoValidator,
    updateEmpleadoValidator,
} = require("../validators/empleadoValidator");

// controladores
const {
    getEmpleadosByServicio,
    getAllEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    getStatusEmpleadoById,
    deactivateEmpleadoById,
    activateEmpleadoById
} = require("../controllers/empleadoController");

// recuperar datos de empleados
router.get("/", [validarJWT], getEmpleadosByServicio);
router.get("/admin", [validarJWT, validarAdmin], getAllEmpleados);
router.get(
    "/admin/:id",
    [validarJWT, validarAdmin, validarMongoId()],
    getEmpleadoById,
);
router.get("/admin/:id/status", [validarJWT, validarAdmin, validarMongoId()], getStatusEmpleadoById);

//desactivar empleado
router.post("/admin/:id/deactivate", [validarJWT, validarAdmin, validarMongoId()], deactivateEmpleadoById);
router.post("/admin/:id/activate", [validarJWT, validarAdmin, validarMongoId()], activateEmpleadoById);

// crear empleado
router.post(
    "/",
    [
        validarJWT,
        validarAdmin,
        subirArchivos,
        createEmpleadoValidator,
        validarCampos,
    ],
    createEmpleado,
);

// actualizar empleado
router.patch(
    "/admin/:id",
    [
        validarJWT,
        validarAdmin,
        subirArchivos,
        validarMongoId(),
        updateEmpleadoValidator,
        validarCampos,
    ],
    updateEmpleado,
);

module.exports = router;
