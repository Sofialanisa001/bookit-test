const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");

// validadores
const {
    createCitaValidator,
    updateCitaStatusValidator,
} = require("../validators/citaValidator");

// controladores
const {
    getDisponibilidad,
    getMisCitas,
    getCitas,
    createCita,
    updateCitaStatus,
} = require("../controllers/citaController");

//get disponibilidad
router.get("/disponibilidad", [validarJWT], getDisponibilidad);

//get citas
router.get("/mis-citas", [validarJWT], getMisCitas);
router.get("/", [validarJWT, validarAdmin], getCitas);

//post
router.post("/", [validarJWT, createCitaValidator, validarCampos], createCita);

// cambiar estado de la cita
router.patch(
    "/:id/status",
    [validarJWT, updateCitaStatusValidator, validarCampos],
    updateCitaStatus,
);

module.exports = router;
