const mongoose = require("mongoose");
const logger = require("./logger");

const db = process.env.MONGO_URI;

const connectDB = async () => {
    logger.info("Intentando conectar a Atlas...");
    try {
        await mongoose.connect(db);
        logger.info("-- MongoDB conectado --");
    } catch (err) {
        logger.error("-- ERROR CONECTANDO MONGO --", err.message);

        // exit process with failure
        setTimeout(() => {
            // para que el log se escriba antes de salir
            process.exit(1);
        }, 1000);
    }
};

module.exports = connectDB;
