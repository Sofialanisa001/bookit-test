const Empleado = require("../models/empleadoModel");
const Empresa = require("../models/empresaModel");
const Suspension = require("../models/suspensionModel");
const Cita = require("../models/citaModel");
const mongoose = require("mongoose");

const horaAMinutos = (horaStr) => {
    const [h, m] = horaStr.split(":").map(Number);
    return h * 60 + m; // 09:30 -> 570
};

const minutosAHora = (minutos) => {
    const h = Math.floor(minutos / 60)
        .toString()
        .padStart(2, "0");
    const m = (minutos % 60).toString().padStart(2, "0");
    return `${h}:${m}`; // 570 -> "09:30"
};

const calcularHorariosDisponibles = async (
    fecha,
    empleadoId,
    duracionMinutos,
) => {
    // buscar el empleado
    const empleado = await Empleado.findById(empleadoId);

    // buscar el horario del empleado dependiendo del dia de la fecha
    const diaSemana = new Date(fecha)
        .toLocaleDateString("es-ES", {
            weekday: "long",
            timeZone: "UTC",
        })
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const horario = empleado.horario.find((h) => h.dia === diaSemana);

    if (!horario) {
        return []; // si no trabaja ese dia
    }

    // convertir el horario a minutos
    const inicioTurno = horaAMinutos(horario.horaInicio);
    const finTurno = horaAMinutos(horario.horaFin);

    // slots disponibles [540, 570, 600, ...]
    let slotsLibres = [];
    for (let i = inicioTurno; i < finTurno; i += 30) {
        slotsLibres.push(i);
    }

    // arreglo para meter las horas ocupadas
    const ocupados = [];

    const inicioDia = new Date(fecha);
    inicioDia.setUTCHours(0, 0, 0, 0);

    const finDia = new Date(fecha);
    finDia.setUTCHours(23, 59, 59, 999);

    // suspensiones del empleado o globales
    const suspensiones = await Suspension.find({
        fecha: { $gte: inicioDia, $lte: finDia },
        activo: true,
        $or: [{ empleadoId: empleadoId }, { empleadoId: null }],
    });

    for (const susp of suspensiones) {
        if (susp.todoElDia) {
            ocupados.push({ inicio: 0, fin: 1440 }); // 1440 son los minutos de todo el dia
        } else {
            ocupados.push({
                inicio: horaAMinutos(susp.horaInicio),
                fin: horaAMinutos(susp.horaFin),
            });
        }
    }

    // traer las citas de ese día que no estén canceladas
    const citas = await Cita.find({
        empleadoId: empleadoId,
        fecha: { $gte: inicioDia, $lte: finDia },
        estado: { $nin: ["cancelada", "realizada"] },
    });
    for (const cita of citas) {
        ocupados.push({
            inicio: horaAMinutos(cita.horaInicio),
            fin: horaAMinutos(cita.horaFin),
        });
    }

    // FILTRAR LOS SLOTS
    // quitar los slots que caen adentro de un bloque ocupado
    slotsLibres = slotsLibres.filter((slot) => {
        const estaOcupado = ocupados.some(
            (bloque) => slot >= bloque.inicio && slot < bloque.fin,
        );
        return !estaOcupado;
    });

    // checar la duración del servicio y asegurarnos de que haya suficientes slots consecutivos
    const slotsNecesarios = duracionMinutos / 30;

    const slotsFinales = slotsLibres.filter((slotBase) => {
        for (let i = 0; i < slotsNecesarios; i++) {
            const slotRequerido = slotBase + i * 30;
            // Si falta alguno de los slots requeridos este slot no sirve
            if (!slotsLibres.includes(slotRequerido)) {
                return false;
            }
        }
        return true;
    });

    // regresar los slots disponibles en formato "HH:MM"
    return slotsFinales.map(minutosAHora);
};

module.exports = {
    calcularHorariosDisponibles,
};
