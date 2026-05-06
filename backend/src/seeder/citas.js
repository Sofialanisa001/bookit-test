const { fakerES_MX } = require("@faker-js/faker");

const generarCitasFalsas = (
    usuariosDB,
    empleadosDB,
    serviciosDB,
    suspensionesDB,
    empresaDB,
) => {
    const citas = [];
    const horarioGlobal = empresaDB[0].horarioGlobal;

    // funcion horas a minutos
    // 14:30 a minutos 870
    const aMinutos = (hora) => {
        const [horas, minutos] = hora.split(":").map(Number);
        return horas * 60 + minutos;
    };

    // funcion minutos a horas
    // 360 min a horas 6:00
    const aHora = (minutos) => {
        const horas = Math.floor(minutos / 60)
            .toString()
            .padStart(2, "0");
        const mins = (minutos % 60).toString().padStart(2, "0");
        return `${horas}:${mins}`;
    };

    // Generar 50 intentos de citas
    for (let i = 0; i < 50; i++) {
        const usuarioRandom = fakerES_MX.helpers.arrayElement(usuariosDB);
        const empleadoRandom = fakerES_MX.helpers.arrayElement(empleadosDB);

        // el servicio DEBE ser uno que el empleado sepa hacer
        const servicioIdRandom = fakerES_MX.helpers.arrayElement(
            empleadoRandom.servicios,
        );
        const servicioReal = serviciosDB.find(
            (s) => s._id.toString() === servicioIdRandom.toString(),
        );

        // generar fecha y ver si el empleado trabaja ese día
        const fechaCita = fakerES_MX.date.soon({ days: 20 });
        fechaCita.setSeconds(0, 0); // quitamos segundos

        const nombreDia = fechaCita
            .toLocaleDateString("es-MX", { weekday: "long" })
            .toLowerCase();
        const turnoEmpleado = empleadoRandom.horario.find(
            (h) => h.dia === nombreDia,
        );
        const limitesEmpresa = horarioGlobal.find((h) => h.dia === nombreDia);

        // si el empleado no trabaja o la empresa esta cerrada, saltar
        if (!turnoEmpleado || !limitesEmpresa) continue;

        // definir rango de horas posibles para la cita, basado en el turno del empleado y el horario de la empresa
        const inicioPosible = Math.max(
            aMinutos(limitesEmpresa.horaInicio),
            aMinutos(turnoEmpleado.horaInicio),
        );
        const finPosible = Math.min(
            aMinutos(limitesEmpresa.horaFin),
            aMinutos(turnoEmpleado.horaFin),
        );

        // elegir una hora al azar en bloques de 60 min
        // si puede de 9:00 a 14:00, las opciones son 9, 10, 11, 12, 13
        const bloquesDisponibles = [];
        for (let m = inicioPosible; m <= finPosible - 60; m += 60) {
            bloquesDisponibles.push(m);
        }

        if (bloquesDisponibles.length === 0) continue;
        const inicioCitaMinutos =
            fakerES_MX.helpers.arrayElement(bloquesDisponibles);
        const finCitaMinutos = inicioCitaMinutos + 60;

        const horaInicioStr = aHora(inicioCitaMinutos);
        const horaFinStr = aHora(finCitaMinutos);

        // suspenciones
        const estaSuspendido = suspensionesDB.some((susp) => {
            const mismaFecha =
                susp.fecha.toDateString() === fechaCita.toDateString();
            const aplicaAEmpleado =
                susp.empleadoId === null ||
                susp.empleadoId.toString() === empleadoRandom._id.toString();

            if (mismaFecha && aplicaAEmpleado) {
                if (susp.todoElDia) return true;
                // si es parcial, checar si la cita choca con las horas de suspension
                const suspIni = aMinutos(susp.horaInicio);
                const suspFin = aMinutos(susp.horaFin);
                return inicioCitaMinutos < suspFin && finCitaMinutos > suspIni;
            }
            return false;
        });

        if (estaSuspendido) continue;

        // checar empalme con otras citas ya generadas
        const seEmpalma = citas.some((cita) => {
            const mismoDia =
                cita.fecha.toDateString() === fechaCita.toDateString();
            const mismoEmp =
                cita.empleadoId.toString() === empleadoRandom._id.toString();
            if (mismoDia && mismoEmp) {
                const cIni = aMinutos(cita.horaInicio);
                const cFin = aMinutos(cita.horaFin);
                return inicioCitaMinutos < cFin && finCitaMinutos > cIni;
            }
            return false;
        });

        if (seEmpalma) continue;

        // datos de terceros, opcional y con un 20 % de probabilidad
        let datosPaciente = undefined;
        if (fakerES_MX.datatype.boolean(0.2)) {
            datosPaciente = {
                nombre: fakerES_MX.person.fullName(),
                edad: fakerES_MX.number.int({ min: 1, max: 90 }),
                sexo: fakerES_MX.helpers.arrayElement([
                    "Hombre",
                    "Mujer",
                    "Otro",
                ]),
                telefono: fakerES_MX.phone.number(),
                correo: fakerES_MX.internet.email(),
            };
        }

        // crear cita
        citas.push({
            usuarioId: usuarioRandom._id,
            empleadoId: empleadoRandom._id,
            fecha: fechaCita,
            horaInicio: horaInicioStr,
            horaFin: horaFinStr,
            servicioAgendado: {
                servicioId: servicioReal._id,
                nombreSnapshot: servicioReal.nombre,
                precioSnapshot: servicioReal.precio,
            },
            total: servicioReal.precio,
            estado: fakerES_MX.helpers.arrayElement([
                "pendiente",
                "confirmada",
                //"realizada", no la puse pq es mas verificaciones para generar y equis la vdd
                "cancelada",
            ]),
            datosPaciente: datosPaciente,
        });
    }

    return citas;
};

module.exports = generarCitasFalsas;
