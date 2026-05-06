const { fakerES_MX } = require("@faker-js/faker"); // faker mexicano
const Usuario = require("../models/usuario"); // modelo de usuario

const generarUsuariosFalsos = (cantidad) => {
    const usuarios = [];

    usuarios.push({
        // USUARIO ADMINISTRADOR
        nombre: "Administrador BookIT",
        correo: "admin@bookit.com",
        password: "admin123",
        sexo: "femenino",
        telefono: "8100000000",
        fechaNacimiento: new Date("1990-01-01"),
        rol: "ADMIN",
    });

    // para x cantidad de usuarios
    for (let i = 0; i < cantidad; i++) {
        const nuevoUsuario = {
            nombre: fakerES_MX.person.fullName(),
            correo: fakerES_MX.internet.email(),
            password: fakerES_MX.internet.password(10), // NO ESTÁ ENCRIPTADA, SOLO PARA PRUEBAS
            sexo: fakerES_MX.helpers.arrayElement(["masculino", "femenino"]),
            telefono: fakerES_MX.phone.number(),
            fechaNacimiento: fakerES_MX.date.birthdate({
                min: 18,
                max: 65,
                mode: "age",
            }),

            rol: "CLIENTE", // Es default, pero aja
        };
        usuarios.push(nuevoUsuario);
    }

    return usuarios;
};

module.exports = generarUsuariosFalsos;
