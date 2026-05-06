const fileUpload = require("express-fileupload");

const subirArchivos = fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: false,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = subirArchivos;
