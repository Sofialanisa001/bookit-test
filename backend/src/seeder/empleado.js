const { fakerES_MX } = require("@faker-js/faker");

const generarEmpleadosFalsos = (cantidad, serviciosDB, empresaDB) => {
    const empleados = [];
    const horarioGlobal = empresaDB[0].horarioGlobal;
    const diasAbiertos = horarioGlobal.map((h) => h.dia);

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

    for (let i = 0; i < cantidad; i++) {
        // se agarran de 1 a 4 servicios al azar
        const idsServicios = serviciosDB.map((servicio) => servicio._id);
        const serviciosAlAzar = fakerES_MX.helpers.arrayElements(idsServicios, {
            min: 1,
            max: 4,
        });

        const horarioGenerado = [];

        // de 4 a 6 doas de trabajo al azar
        const maxDias = Math.min(6, diasAbiertos.length); // no se pueden asignar mas dias de los que la empresa tiene abiertos
        const diasDeTrabajo = fakerES_MX.helpers.arrayElements(diasAbiertos, {
            min: Math.min(4, maxDias), // no se pueden asignar menos de 4 dias, pero tampoco mas de los que la empresa tiene abiertos
            max: maxDias,
        });

        // horario de trabajo
        diasDeTrabajo.forEach((dia) => {
            // se busca el horario de la empresa para ese dia
            const limitesEmpresa = horarioGlobal.find((h) => h.dia === dia);

            const minInicioEmpresa = aMinutos(limitesEmpresa.horaInicio);
            const minFinEmpresa = aMinutos(limitesEmpresa.horaFin);
            const duracionTotal = minFinEmpresa - minInicioEmpresa;

            let empInicio, empFin;

            // si abre muchas horas, se le da un turno de 6 o 8 horas
            // si abre poquito, q trabaje todo el turno
            if (duracionTotal >= 480) {
                // si abren 8 horas o más
                const esTurnoMatutino = fakerES_MX.datatype.boolean();
                const duracionTurno = fakerES_MX.helpers.arrayElement([
                    360, 480,
                ]); // 6 u 8 horas de trabajo

                if (esTurnoMatutino) {
                    empInicio = minInicioEmpresa; // entra a abrir
                    empFin = minInicioEmpresa + duracionTurno;
                } else {
                    empFin = minFinEmpresa; // se queda a cerrar
                    empInicio = minFinEmpresa - duracionTurno;
                }
            } else {
                // si es un dia corto, trabaja todo el tiempo que esté abierto
                empInicio = minInicioEmpresa;
                empFin = minFinEmpresa;
            }

            horarioGenerado.push({
                dia: dia,
                horaInicio: aHora(empInicio),
                horaFin: aHora(empFin),
            });
        });

        const nuevoEmpleado = {
            nombre: fakerES_MX.person.fullName(),
            correo: fakerES_MX.internet.email(),
            fechaNacimiento: fakerES_MX.date.birthdate({
                min: 18,
                max: 55,
                mode: "age",
            }),
            telefono: fakerES_MX.phone.number(),
            informacionAdicional: fakerES_MX.lorem.paragraph({
                min: 1,
                max: 3,
            }), // 1 a 3 parrafos de descripcion lorem
            foto: fakerES_MX.image.avatar(),

            servicios: serviciosAlAzar,
            horario: horarioGenerado,
        };

        empleados.push(nuevoEmpleado);
    }

    return empleados;
};

module.exports = generarEmpleadosFalsos;
