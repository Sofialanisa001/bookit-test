const logger = require("../config/logger");
const Servicio = require("../models/servicioModel");
const Cita = require("../models/citaModel");
const Empleado = require("../models/empleadoModel");

const mongoose = require("mongoose");

const {
    calcularHorariosDisponibles,
} = require("../helpers/disponibilidadHelper");

const { matchedData } = require("express-validator");

// @route GET /api/citas?fecha=YYYY-MM-DD
// @description GET citas
// @access Admin Only
const getCitas = async (req, res) => {
    try {
        let { fecha } = req.query;

        if (!fecha) {
            fecha = new Date().toISOString().split("T")[0];
        }

        const [anio, mes, dia] = fecha.split("-").map(Number);
        const fechaObj = new Date(anio, mes - 1, dia);

        if (
            fechaObj.getFullYear() !== anio ||
            fechaObj.getMonth() !== mes - 1 ||
            fechaObj.getDate() !== dia
        ) {
            return res.status(400).json({
                ok: false,
                msg: `La fecha ${fecha} no es válida para el calendario.`,
            });
        }

        if (req.rol !== "ADMIN") {
            return res.status(403).json({
                ok: false,
                msg: "Acceso denegado",
            });
        }

        const inicioDia = new Date(fecha);
        inicioDia.setUTCHours(0, 0, 0, 0);

        const finDia = new Date(fecha);
        finDia.setUTCHours(23, 59, 59, 999);

        const citas = await Cita.find({
          fecha: { $gte: inicioDia, $lte: finDia },
          estado: { $ne: 'cancelada' },
        })
          .populate('usuarioId', 'nombre apellido telefono')
          .populate('empleadoId', 'nombre');

        res.status(200).json({
            ok: true,
            citas,
        });
    } catch (error) {
        logger.error("Error al obtener citas: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};
// @route GET /api/citas/mis-citas
// @description GET citas del cliente logueado
// @access Private
const getMisCitas = async (req, res) => {
    try {
        if (req.rol !== "CLIENTE") {
            return res.status(403).json({
                ok: false,
                msg: "Acceso denegado",
            });
        }

        const citas = await Cita.find({ usuarioId: req.uid });
        res.status(200).json({
            ok: true,
            citas,
        });
    } catch (error) {
        logger.error("Error al obtener citas: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

// @route GET /api/citas/disponibilidad
// @description GET disponibilidad of employee
// @access private
const getDisponibilidad = async (req, res) => {
    try {
        const { fecha, empleadoId, servicioId } = req.query;

        if (!fecha || !empleadoId || !servicioId) {
            return res.status(400).json({
                ok: false,
                msg: "Faltan parámetros: fecha, empleadoId o servicioId",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(empleadoId)) {
            return res.status(400).json({
                ok: false,
                msg: "El ID del empleado no tiene un formato válido.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            return res.status(400).json({
                ok: false,
                msg: "El ID del servicio no tiene un formato válido.",
            });
        }

        // obtener el servicio para saver la duracion
        const servicio = await Servicio.findById(servicioId);
        if (!servicio) {
            return res
                .status(404)
                .json({ ok: false, msg: "Servicio no encontrado" });
        }

        const empleado = await Empleado.findById(empleadoId);
        if (!empleado) {
            return res
                .status(404)
                .json({ ok: false, msg: "Empleado no encontrado" });
        }

        // si no tiene duracion por x razon se asumen 30
        const duracionMinutos = servicio.duracion || 30;

        // calcular la disponibilidad
        const horarios = await calcularHorariosDisponibles(
            fecha,
            empleadoId,
            duracionMinutos,
        );

        res.status(200).json({
            ok: true,
            horarios,
        });
    } catch (error) {
        logger.error("Error al obtener disponibilidad: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

// @route POST /api/citas
// @description POST citas
// @access private
const createCita = async (req, res) => {
    try {
        // sacar los datos
        const data = matchedData(req, { locations: ["body"] });

        // buscar el servicio para sacar la duracion y los snapshots
        const servicio = await Servicio.findById(data.servicioId);
        if (!servicio) {
            return res.status(404).json({
                ok: false,
                msg: "Servicio no encontrado",
            });
        }

        const duracionMinutos = servicio.duracion || 30;

        // calcular la hora fin
        const [horasInicio, minutosInicio] = data.horaInicio
            .split(":")
            .map(Number);
        const totalMinutosInicio = horasInicio * 60 + minutosInicio;
        const totalMinutosFin = totalMinutosInicio + duracionMinutos;

        // convierte los minutos a formato "HH:MM"
        const hFin = Math.floor(totalMinutosFin / 60)
            .toString()
            .padStart(2, "0");
        const mFin = (totalMinutosFin % 60).toString().padStart(2, "0");

        // inyecatar al data para guardar la cita con hora fin
        data.horaFin = `${hFin}:${mFin}`;

        data.servicioAgendado = {
            servicioId: servicio._id,
            nombreSnapshot: servicio.nombre,
            precioSnapshot: servicio.precio,
            duracionSnapshot: servicio.duracion || 30,
        };

        data.datosCliente = {
            nombre: data.nombre,
            edad: data.edad,
            sexo: data.sexo,
            telefono: data.telefono,
            correo: data.correo,
        };

        delete data.nombre;
        delete data.edad;
        delete data.sexo;
        delete data.telefono;
        delete data.correo;

        if (req.rol === "CLIENTE") {
            data.usuarioId = req.uid;
        } else {
            data.usuarioId = null;
        }

        // crear la cita
        const nuevaCita = new Cita(data);
        await nuevaCita.save();

        res.status(201).json({
            ok: true,
            msg: "Cita agendada exitosamente",
            cita: nuevaCita,
        });
    } catch (error) {
        logger.error("Error al crear cita: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

// @route PATCH /api/citas/:id/status
// @desc Cambiar el estado de una cita
// @access Private
const updateCitaStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // sacar el nuevo estado del body
        const { status } = matchedData(req, { locations: ["body"] });

        // buscar la cita
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({
                ok: false,
                msg: "Cita no encontrada",
            });
        }

        // si es cliente solo se permite cambiar a cancelada
        if (req.rol === "CLIENTE" && cita.usuarioId.toString() !== req.uid) {
            return res.status(403).json({
                ok: false,
                msg: "No tienes permisos para modificar una cita que no es tuya",
            });
        }

        //  actyualizar el status
        cita.estado = status;
        await cita.save();

        res.status(200).json({
            ok: true,
            msg: `La cita ha sido marcada como ${status}`,
            cita,
        });
    } catch (error) {
        logger.error("Error al actualizar status de cita: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

module.exports = {
    getCitas,
    getMisCitas,
    createCita,
    getDisponibilidad,
    updateCitaStatus,
};
