const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");
const logger = require("../config/logger");
const { matchedData } = require("express-validator");

// @route   GET /api/usuarios/perfil
// @desc    Obtener datos del perfil
// @access  Private
const getPerfil = async (req,res) => {
    try{
        const uid = req.uid; //id del user desde token
        
        const usuario = await Usuario.findById(uid); //buscar en la bd

        if(!usuario)
            return res.status(404).json({ok: false, msg: "Usuario no encontrado"});

        res.status(200).json({
            ok: true,
            nombre: usuario.nombre,
            fechaNacimiento: usuario.fechaNacimiento,
            sexo: usuario.sexo,
            correo: usuario.correo,
            telefono: usuario.telefono,
            msg: "Perfil obtenido correctamente"
        });
    } catch(error) {
        logger.error("Error al obtener perfil", error);
        rest.status(500).json({ok: false, msg: "Error interno del servidor"});
    }
}


// @route   PATCH /api/usuarios/perfil
// @desc    Editar datos del perfil
// @access  Private
const updatePerfil = async (req, res) => {
    try {
        const uid = req.uid;

        const data = matchedData(req, { locations: ["body"] }); //matchedData = solo datos del validator

        const usuario = await Usuario.findById(uid);
        if(!usuario)
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado"});

        // encriptar la contraseña
        if(data.password)
            data.password = bcrypt.hashSync(data.password, 10);
        else
            delete data.password // se elimina del obj
        
        delete data.passwordConfirmacion; // se elimina del obj
        
        Object.assign(usuario, data); // toma las propiedades de data y las pone en el obj usuario
        await usuario.save(); // guardar en bd

        res.status(200).json({
            ok: true,
            msg: "Perfil actualizado correctamente",
        });
    } catch (error) {
        logger.error("Error en Editar Perfil:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

module.exports = {getPerfil, updatePerfil };