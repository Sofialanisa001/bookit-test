const { fakerES_MX } = require("@faker-js/faker");

const generarSuspensionesFalsas = (empleadosDB) => {
    const suspensiones = [];

    // SUSPENSION GLOBAL
    suspensiones.push({
        empleadoId: null,
        fecha: new Date("2026-05-01T00:00:00"),
        todoElDia: true,
    });

    // ESPECIFICAS
    for (let i = 0; i < 4; i++) {
        const empleadoRandom = fakerES_MX.helpers.arrayElement(empleadosDB);
        const fechaAleatoria = fakerES_MX.date.soon({ days: 20 });

        // se obtiene el nombre del dia
        const opciones = { weekday: "long" };
        const diaNombre = fechaAleatoria
            .toLocaleDateString("es-MX", opciones)
            .toLowerCase();

        // se verifica que trabaje ese dia
        const horarioDia = empleadoRandom.horario.find(
            (h) => h.dia === diaNombre,
        );

        // si no trabaja, se omite
        if (!horarioDia) continue;

        const esTodoElDia = fakerES_MX.datatype.boolean();

        if (esTodoElDia) {
            suspensiones.push({
                empleadoId: empleadoRandom._id,
                fecha: fechaAleatoria,
                todoElDia: true,
            });
        } else {
            // SUSPENSION PARCIAL
            // la suspencion debe de serguir el horario del empleado

            // durará 2 horas pq me dio flojera lol, y empieza tmb en su hora de entrada
            suspensiones.push({
                empleadoId: empleadoRandom._id,
                fecha: fechaAleatoria,
                todoElDia: false,
                horaInicio: horarioDia.horaInicio,
                horaFin: `${(parseInt(horarioDia.horaInicio.split(":")[0]) + 2).toString().padStart(2, "0")}:00`,
            });
        }
    }

    return suspensiones;
};

module.exports = generarSuspensionesFalsas;
