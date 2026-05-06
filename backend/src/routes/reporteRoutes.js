const express = require("express");
const router = express.Router();

const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");

const {
    getReporteCitas,
    getReporteIngresos,
    getReporteServicios,
    getReporteProductividad,
} = require("../controllers/reporteController");

router.get("/citas", [validarJWT, validarAdmin], getReporteCitas);
router.get("/ingresos", [validarJWT, validarAdmin], getReporteIngresos);
router.get("/servicios", [validarJWT, validarAdmin], getReporteServicios);
router.get(
    "/productividad",
    [validarJWT, validarAdmin],
    getReporteProductividad,
);

module.exports = router;
