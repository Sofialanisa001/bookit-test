const { fakerES_MX, faker } = require("@faker-js/faker");

const generarEmpresa = () => {
    const cantidadImagenes = fakerES_MX.number.int({ min: 2, max: 5 });
    const galeria = [];

    for (let j = 0; j < cantidadImagenes; j++) {
        const fotoUrl = fakerES_MX.image.url() + `?random=${j}`;
        galeria.push(fotoUrl);
    }
    return [
        {
            nombre: "BookIT! Studio",
            correo: "contacto@bookit.com",
            telefono: "8100000000",
            descripcion: fakerES_MX.lorem.paragraph(), // ahi le agregan una chida
            slogan: "Tu agenda digital, tu control total", // tmb aqui
            direccion: fakerES_MX.location.streetAddress(),
            logoUrl:
                "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
            galeriaURLs: galeria,
            horarioGlobal: [
                { dia: "lunes", horaInicio: "09:00", horaFin: "18:00" },
                { dia: "martes", horaInicio: "09:00", horaFin: "18:00" },
                { dia: "miercoles", horaInicio: "09:00", horaFin: "18:00" },
                { dia: "jueves", horaInicio: "09:00", horaFin: "18:00" },
                { dia: "viernes", horaInicio: "09:00", horaFin: "18:00" },
                { dia: "sabado", horaInicio: "10:00", horaFin: "14:00" },
                //{ dia: "domingo", horaInicio: "10:00", horaFin: "14:00" },
            ],
        },
    ];
};

module.exports = generarEmpresa;
