const { matchedData } = require("express-validator");
const logger = require("../config/logger");
const Suspension = require("../models/suspensionModel");
const Cita = require("../models/citaModel");

// @route GET api/suspensiones
// @desc GET suspensiones by month
// @access Private
const getSuspensiones = async (req, res) => {
    try {
        const mes = parseInt(req.query.mes) || new Date().getMonth() + 1;
        const anio = parseInt(req.query.anio) || new Date().getFullYear();

        if (mes < 1 || mes > 12) {
            return res.status(400).json({
                ok: false,
                msg: "Mes inválido. Debe ser un número entre 1 y 12.",
            });
        } else if (anio < 2000 || anio > 2100) {
            return res.status(400).json({
                ok: false,
                msg: "Año inválido. Debe ser un número entre 2000 y 2100.",
            });
        }

        const inicioMes = new Date(anio, mes - 1, 1);
        const finMes = new Date(anio, mes, 1);

        const suspensiones = await Suspension.find({
            fecha: { $gte: inicioMes, $lt: finMes },
            activo: true,
        });

        res.status(200).json({
            ok: true,
            suspensiones,
        });
    } catch (error) {
        logger.error("Error al traer las suspensiones: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno",
        });
    }
};

// @route POST api/suspensiones
// @desc POST suspensiones
// @access Admin Only

const createSuspension = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ["body"] });

        if (data.todoElDia) {
            data.horaInicio = "00:00";
            data.horaFin = "23:59";
        }

        const newSuspension = new Suspension(data);

        await newSuspension.save();

        // cancelar las citas solapadas --- --- --- ///TEST///

        // calcular el inicio y fin del día de la suspensión para filtrar las citas de ese día
        const inicioDia = new Date(data.fecha);
        inicioDia.setUTCHours(0, 0, 0, 0);
        const finDia = new Date(data.fecha);
        finDia.setUTCHours(23, 59, 59, 999);

        // filtro de las citas
        const filtroCitas = {
            fecha: { $gte: inicioDia, $lte: finDia },
            estado: { $in: ["pendiente", "confirmada"] },
        };

        // Si la suspensión es para un empleado específico solo cancelamos las suyas
        // Si empleadoId es null es una suspensión global y cancelamos todo el día
        if (data.empleadoId) {
            filtroCitas.empleadoId = data.empleadoId;
        }

        // busca las citas del día que podrían chocar con la suspensión
        const citasDelDia = await Cita.find(filtroCitas);

        // identificar cuáles citas se solapan con la suspensión
        const idsACancelar = citasDelDia
            .filter((cita) => {
                return (
                    cita.horaInicio < data.horaFin &&
                    cita.horaFin > data.horaInicio
                );
            })
            .map((cita) => cita._id);

        // canelcar todo
        if (idsACancelar.length > 0) {
            await Cita.updateMany(
                { _id: { $in: idsACancelar } },
                { $set: { estado: "cancelada" } },
            );
            logger.info(
                `Se cancelaron ${idsACancelar.length} citas por nueva suspensión.`,
            );
        }

        res.status(201).json({
            ok: true,
            msg: "Suspension creada correctamente",
        });
    } catch (error) {
        logger.error("Error al crear la suspension: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error Interno",
        });
    }
};

// @route DELETE api/suspensiones
// @desc DELETE suspensiones
// @access Admin Only

const deleteSuspension = async (req, res) => {
    try {
        let { id } = req.params;

        const deletedSuspension = await Suspension.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true },
        );

        if (!deletedSuspension) {
            return res.status(404).json({
                ok: false,
                msg: "Suspension no encontrada",
            });
        }

        res.status(200).json({
            ok: true,
            msg: "Suspension eliminada correctamente",
        });
    } catch (error) {
        logger.error("Error al eliminar la suspension: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error Interno",
        });
    }
};

module.exports = {
    getSuspensiones,
    createSuspension,
    deleteSuspension,
};
