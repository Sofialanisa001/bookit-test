const Cita = require("../models/citaModel");
const logger = require("../config/logger");

// rango de fechas
const obtenerRangoMes = (mes, año) => {
    const mesIndex = parseInt(mes) - 1;
    const anioInt = parseInt(año);
    const fechaInicio = new Date(anioInt, mesIndex, 1);
    const fechaFin = new Date(anioInt, mesIndex + 1, 0, 23, 59, 59, 999);
    return { fechaInicio, fechaFin };
};

// agrupar por semanas
const agruparPorSemanas = (citas, esIngreso = false) => {
    const etiquetas = ["01-07", "08-14", "15-21", "22-28", "29-31"];
    const valores = [0, 0, 0, 0, 0];

    citas.forEach((cita) => {
        const diaCita = new Date(cita.fecha).getDate();

        // saber a que semana pertenece
        let indexSemana = Math.ceil(diaCita / 7) - 1;
        if (indexSemana > 4) indexSemana = 4;

        if (esIngreso) {
            valores[indexSemana] += cita.servicioAgendado.precioSnapshot || 0;
        } else {
            valores[indexSemana] += 1;
        }
    });

    return { etiquetas, valores };
};

// @route GET /api/reportes/citas
// @desc GET reporte de cantidad de citas por día para un mes/año específico
// @access Private
const getReporteCitas = async (req, res) => {
    try {
        const { mes, año } = req.query;
        if (!mes || !año)
            return res.status(400).json({ ok: false, msg: "Falta mes y año" });

        if (
            isNaN(mes) ||
            isNaN(año) ||
            mes < 1 ||
            mes > 12 ||
            año < 2000 ||
            año > 2100
        )
            return res
                .status(400)
                .json({ ok: false, msg: "Mes o año inválido" });

        const { fechaInicio, fechaFin } = obtenerRangoMes(mes, año);

        const citas = await Cita.find({
            fecha: { $gte: fechaInicio, $lte: fechaFin },
            estado: { $ne: "cancelada" },
        });

        const { etiquetas, valores } = agruparPorSemanas(citas, false);

        res.status(200).json({
            ok: true,
            etiquetas,
            valores,
            msg: "Reporte de citas generado",
        });
    } catch (error) {
        logger.error("Error reporte citas: ", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

// @route GET /api/reportes/ingresos
// @desc GET reporte de ingresos por día para un mes/año específico
// @access Private
const getReporteIngresos = async (req, res) => {
    try {
        const { mes, año } = req.query;
        if (!mes || !año)
            return res.status(400).json({ ok: false, msg: "Falta mes y año" });

        if (
            isNaN(mes) ||
            isNaN(año) ||
            mes < 1 ||
            mes > 12 ||
            año < 2000 ||
            año > 2100
        )
            return res
                .status(400)
                .json({ ok: false, msg: "Mes o año inválido" });

        const { fechaInicio, fechaFin } = obtenerRangoMes(mes, año);

        const citas = await Cita.find({
            fecha: { $gte: fechaInicio, $lte: fechaFin },
            estado: "realizada",
        });

        const { etiquetas, valores } = agruparPorSemanas(citas, true);

        res.status(200).json({
            ok: true,
            etiquetas,
            valores,
            msg: "Reporte de ingresos generado",
        });
    } catch (error) {
        logger.error("Error reporte ingresos: ", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

// @route GET /api/reportes/servicios
// @desc GET reporte de cantidad de servicios realizados para un mes/año específico
// @access Private
const getReporteServicios = async (req, res) => {
    try {
        const { mes, año } = req.query;
        if (!mes || !año)
            return res.status(400).json({ ok: false, msg: "Falta mes y año" });

        if (
            isNaN(mes) ||
            isNaN(año) ||
            mes < 1 ||
            mes > 12 ||
            año < 2000 ||
            año > 2100
        )
            return res
                .status(400)
                .json({ ok: false, msg: "Mes o año inválido" });

        const { fechaInicio, fechaFin } = obtenerRangoMes(mes, año);

        const citas = await Cita.find({
            fecha: { $gte: fechaInicio, $lte: fechaFin },
            estado: { $ne: "cancelada" },
        });

        const conteoServicios = {};
        let totalServiciosAgendados = 0;

        citas.forEach((cita) => {
            const nombreServicio = cita.servicioAgendado.nombreSnapshot;
            conteoServicios[nombreServicio] =
                (conteoServicios[nombreServicio] || 0) + 1;
            totalServiciosAgendados += 1;
        });

        const etiquetas = Object.keys(conteoServicios);
        const valores = Object.values(conteoServicios);

        res.status(200).json({
            ok: true,
            etiquetas,
            valores,
            msg: "Reporte de servicios generado",
        });
    } catch (error) {
        logger.error("Error reporte servicios: ", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

// @route GET /api/reportes/productividad
// @desc GET reporte de productividad por empleado para un mes/año específico
// @access Private
const getReporteProductividad = async (req, res) => {
    try {
        const { mes, año } = req.query;
        if (!mes || !año)
            return res.status(400).json({ ok: false, msg: "Falta mes y año" });

        if (
            isNaN(mes) ||
            isNaN(año) ||
            mes < 1 ||
            mes > 12 ||
            año < 2000 ||
            año > 2100
        )
            return res
                .status(400)
                .json({ ok: false, msg: "Mes o año inválido" });

        const { fechaInicio, fechaFin } = obtenerRangoMes(mes, año);

        const citas = await Cita.find({
            fecha: { $gte: fechaInicio, $lte: fechaFin },
            estado: "realizada",
        }).populate("empleadoId", "nombre");

        const conteoProductividad = {};

        citas.forEach((cita) => {
            const nombreEmpleado = cita.empleadoId.nombre;
            conteoProductividad[nombreEmpleado] =
                (conteoProductividad[nombreEmpleado] || 0) + 1;
        });

        const etiquetas = Object.keys(conteoProductividad);
        const valores = Object.values(conteoProductividad);

        res.status(200).json({
            ok: true,
            etiquetas,
            valores,
            msg: "Reporte de productividad generado",
        });
    } catch (error) {
        logger.error("Error reporte productividad: ", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

module.exports = {
    getReporteCitas,
    getReporteIngresos,
    getReporteServicios,
    getReporteProductividad,
};
