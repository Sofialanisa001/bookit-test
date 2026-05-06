const cloudinary = require("../config/cloudinary");

const subirImagen = async (file, folder) => {
    try {
        if (!file) return null;

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: `${folder || "default"}`,
        });

        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        logger.error("Error en el helper de Cloudinary:", error);
        throw new Error("Fallo al subir la imagen");
    }
};

const borrarImagen = async (public_id) => {
    try {
        if (!public_id) return;
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        logger.error("Error al borrar imagen en Cloudinary:", error);
    }
};

module.exports = { subirImagen, borrarImagen };
