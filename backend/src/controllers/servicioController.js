const logger = require("../config/logger");
const Servicio = require("../models/servicioModel");
const Empleado = require("../models/empleadoModel");
const mongoose = require("mongoose");

const { matchedData } = require("express-validator");
const { subirImagen, borrarImagen } = require("../helpers/cloudinaryHelper");

// @route   GET /api/servicios/
// @desc    GET ALL servicios
// @access  Public
const getAllServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find({ activo: true }); //.find() trae todos los activos

        res.status(200).json({
            ok: true,
            servicios, // llave y valor se llaman igual, con solo ponerlo una vez funciona
        });
    } catch (error) {
        logger.error("Error al obtener servicios:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno",
        });
    }
};

// @route   GET /api/servicios/:id
// @desc    GET ONE servicio
// @access  Public
const getOneServicio = async (req, res) => {
    try {
        const { id } = req.params; //extraer id de la URL

        const servicio = await Servicio.findById(id);

        if (!servicio) {
            return res.status(404).json({
                ok: false,
                msg: "Servicio no encontrado",
            });
        }

        res.status(200).json({
            ok: true,
            servicio,
        });
    } catch (error) {
        logger.error("Error al obtener el servicio: ", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno. Revisa que el Id sea válido",
        });
    }
};

// @route   POST /api/servicios/
// @desc    CREATE servicio
// @access  Admin only
const createServicio = async (req, res) => {
    try {
        //extraer el req.body
        const data = matchedData(req, { locations: ["body"] });
        delete data.foto; // se borra la foto pq se maneja aparte

        const newServicio = new Servicio(data);

        if (req.files && req.files.foto) {
            newServicio.foto = await subirImagen(req.files.foto, "servicios");
        }
        //escribe en mongo
        await newServicio.save();

        res.status(201).json({
            ok: true,
            msg: "Servicio creado exitosamente",
        });
    } catch (error) {
        logger.error("Error al crear servicio:", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

// @route   PATCH /api/servicios/:id
// @desc    UPDATE servicio
// @access  Admin only
const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        let data = matchedData(req, { locations: ["body"] });
        delete data.foto; // se borra la foto pq en resumen, si la foto llega vacía, da error lol

        // si viene una nueva foto se borra la anterior y se sube la nueva
        if (req.files && req.files.foto) {
            const servicioActual = await Servicio.findById(id);

            if (!servicioActual) {
                return res
                    .status(404)
                    .json({ ok: false, msg: "Servicio no encontrado" });
            }

            // borra la imagen antigua si existe
            if (servicioActual.foto && servicioActual.foto.public_id) {
                await borrarImagen(servicioActual.foto.public_id);
            }

            // nueva foto
            data.foto = await subirImagen(req.files.foto, "servicios");
        }

        //findByIdAndUpdate(id, los nuevos datos, y opciones)
        //{new:true} trae el objeto ya actualizado no el anterior
        const updatedServicio = await Servicio.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!updatedServicio) {
            return res
                .status(404)
                .json({ ok: false, msg: "Servicio no encontrado" });
        }

        res.status(200).json({
            ok: true,
            servicio: updatedServicio,
            msg: "Servicio actualizado correctamente",
        });
    } catch (error) {
        logger.error("Error al actualizar servicio", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

// @route   DELETE /api/servicios/:id
// @desc    DELETE servicio SOFT DELETE
// @access  Admin only
const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;

        // findByIdAndUpdate solo para cambiar activo a false
        const deletedServicio = await Servicio.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }, //devuelve el doc ya actualizado
        );

        if (!deletedServicio) {
            return res
                .status(404)
                .json({ ok: false, msg: "Servicio no encontrado" });
        }

        // actualizar empleados que tenían este servicio para que ya no lo tengan asignado
        await Empleado.updateMany(
            { servicios: id },
            { $pull: { servicios: id } }, // extraer este ID del arreglo
        );

        res.status(200).json({
            ok: true,
            id: id,
            msg: "Servicio desactivado y desvinculado de los empleados exitosamente",
        });
    } catch (error) {
        logger.error("Error al eliminar servicio:", error);
        res.status(500).json({ ok: false, msg: "Error interno" });
    }
};

module.exports = {
    getAllServicios,
    getOneServicio,
    createServicio,
    updateServicio,
    deleteServicio,
};
