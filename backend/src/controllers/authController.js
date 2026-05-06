const logger = require("../config/logger");
const Usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { matchedData } = require("express-validator");
const { generarJWT, generarRefreshToken } = require("../helpers/jwt");

// @route   POST /api/usuarios/register
// @desc    Registrar un nuevo usuario
// @access  Public
const registrarUsuario = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ["body"] });
        delete data.passwordConfirmacion;

        // encriptar la contraseña
        data.password = bcrypt.hashSync(data.password, 10);

        // crear el nuevo usuario con los datos de req.body
        let usuario = new Usuario(data);

        //guardar en la base de datos
        await usuario.save();

        // generar respuesta (cambiar luego, es para postman)
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            nombre: usuario.nombre,
            msg: "Registro completado con éxito",
        });
    } catch (error) {
        logger.error("Error en Registrar Usuario:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

// @route   POST /api/usuarios/login
// @desc    Iniciar sesión de usuario
// @access  Public

const loginUsuario = async (req, res) => {
    try {
        const data = matchedData(req, { locations: ["body"] });

        // checar que el usuario existe
        let usuario = await Usuario.findOne({ correo: data.correo });

        // si no existe
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Credenciales Inválidas",
            });
        }

        // checar que la contraseña sea correcta
        const esValido = await bcrypt.compare(data.password, usuario.password);

        // si no es valida
        if (!esValido) {
            return res.status(400).json({
                ok: false,
                msg: "Credenciales Inválidas",
            });
        }

        // JWT
        const token = await generarJWT(usuario.id, usuario.nombre, usuario.rol);
        const refreshToken = await generarRefreshToken(usuario.id);

        // cookie
        res.cookie("accessToken", token, {
            httpOnly: true, // para que no se pueda acceder a la cookie desde JavaScript (protección contra XSS)
            secure: process.env.NODE_ENV === "production", // false para desarrollo (http), true para producción (https)
            sameSite: "lax", // para proteger contra CSRF, permite enviar la cookie en solicitudes de navegación normales pero no en solicitudes cross-site
            maxAge: 3600000, // 1 hora de vida
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 604800000, // 7 días de vida
        });

        // respuesta al frontend
        return res.status(200).json({
            ok: true,
            usuario: {
                uid: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol,
            },
            msg: "Login exitoso",
        });
    } catch (error) {
        logger.error("Error en LogIn: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno del servidor",
        });
    }
};

const logoutUsuario = (req, res) => {
    // borrar cookies de acceso y refresh token
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info({
        mensaje: "Transacción: Cerrar Sesión",
        detalles: {
            uid: req.uid,
            status: "Sesión terminada físicamente",
        },
    });

    res.status(200).json({ ok: true, msg: "Logout exitoso" });
};

const refrescarToken = async (req, res) => {
    const { refreshToken } = req.cookies; // extraemos el refresh token de las cookies

    if (!refreshToken) {
        return res
            .status(401)
            .json({ ok: false, msg: "No hay token de refresco" });
    }

    try {
        const { uid } = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
        );

        // si el token es válido, buscamos al usuario en la base de datos
        const usuario = await Usuario.findById(uid);

        // si el usuario no existe
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }

        // generar un nuevo token de acceso
        const nuevoToken = await generarJWT(
            usuario.id,
            usuario.nombre,
            usuario.rol,
        );

        // enviar el nuevo token en una cookie
        res.cookie("accessToken", nuevoToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3600000,
        });

        res.json({ ok: true, msg: "Token renovado con éxito" });
    } catch (error) {
        logger.error("Error en Refrescar Token:", error);
        res.status(401).json({
            ok: false,
            msg: "Sesión expirada, por favor inicia sesión de nuevo",
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    refrescarToken,
    logoutUsuario,
};
