const { fakerES_MX } = require("@faker-js/faker");

const generarServiciosFalsos = () => {
    return [
        "Corte Clasico",
        "Arreglo de Barba",
        "Tinte Completo",
        "Luces / Rayitos",
        "Peinado Express",
        "Keratina",
        "Planchado",
    ].map((nombreReal) => {
        return {
            nombre: nombreReal,
            descripcion: fakerES_MX.lorem.sentences(2),
            precio: parseFloat(
                fakerES_MX.commerce.price({ min: 150, max: 1200 }),
            ),
            foto: fakerES_MX.image.faker.image.url(),
            activo: true,
        };
    });
};

module.exports = generarServiciosFalsos;
