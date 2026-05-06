const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { updateEmpresaValidator } = require("../validators/empresaValidator");
const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");
const subirArchivos = require("../middleware/subirArchivos");

const {
    getEmpresa,
    updateEmpresa,
} = require("../controllers/empresaController");

router.get("/", getEmpresa);
router.patch(
    "/",
    [
        validarJWT,
        validarAdmin,
        subirArchivos,
        updateEmpresaValidator,
        validarCampos,
    ],
    updateEmpresa,
);

module.exports = router;
