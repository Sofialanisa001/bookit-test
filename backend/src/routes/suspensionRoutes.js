const express = require("express");
const router = express.Router();

const { validarCampos } = require("../middleware/validarCampos");
const { validarJWT } = require("../middleware/validarJWT");
const { validarAdmin } = require("../middleware/validarAdmin");
const validarMongoId = require("../middleware/validarMongoId");

const {
    createSuspensionValidator,
} = require("../validators/suspensionValidator");

const {
    getSuspensiones,
    createSuspension,
    deleteSuspension,
} = require("../controllers/suspensionController");

// get
router.get("/", [validarJWT], getSuspensiones);

// crear suspension
router.post(
    "/",
    [validarJWT, validarAdmin, createSuspensionValidator, validarCampos],
    createSuspension,
);

// soft delete
router.delete(
    "/:id",
    [validarJWT, validarAdmin, validarMongoId()],
    deleteSuspension,
);

module.exports = router;
