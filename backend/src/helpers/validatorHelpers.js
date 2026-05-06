const mongoose = require("mongoose");

// helper para UNA sola imagen
const validarImagen = (opcional = false) => {
    // path es el nombre del campo
    return (value, { req, path }) => {
        // si no hay archivos o si el campo específico no existe
        if (!req.files || !req.files[path]) {
            if (opcional) return true;
            throw new Error(`El archivo para '${path}' es obligatorio.`);
        }

        // si existe, se valida
        const archivo = req.files[path];

        // si es array, que solo sea una imagen
        if (Array.isArray(archivo)) {
            throw new Error(`Solo se permite un archivo para '${path}'.`);
        }

        // se valida que no esté vacío
        if (archivo.size === 0) {
            throw new Error(`El archivo '${path}' está vacío o dañado.`);
        }

        // se valida su formato
        const formatosValidos = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];
        if (!formatosValidos.includes(archivo.mimetype)) {
            throw new Error(
                `Formato inválido en '${path}'. Solo JPG, PNG o WEBP.`,
            );
        }

        return true;
    };
};

// sanitizar arreglos
const sanitizarArreglo = (value) => {
    if (!value || value === "[]" || value === "") {
        return [];
    }

    let arreglo = typeof value === "string" ? JSON.parse(value) : value;

    return arreglo;
};

// arreglo sanitizado de IDs para que no haya duplicados
const sanitizarArregloIDs = (value) => {
    if (!value || value === "[]" || value === "") return [];
    let arreglo = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(arreglo)) return arreglo;
    return [...new Set(arreglo)]; // limpia IDs duplicados
};

// valida que el horario tenga la estructura correcta
const validarEstructuraHorario = (horarioParseado) => {
    const diasValidos = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ];
    const diasVistos = new Set();
    const regexHora = /^([0-1]?[0-9]|2[0-3]):(00|30)$/;

    for (const turno of horarioParseado) {
        if (!turno.dia || !turno.horaInicio || !turno.horaFin) {
            throw new Error(
                "Un registro del horario está incompleto. Faltan datos.",
            );
        }
        if (!diasValidos.includes(turno.dia)) {
            throw new Error(`El día "${turno.dia}" no es válido.`);
        }
        if (diasVistos.has(turno.dia)) {
            throw new Error(
                `El día "${turno.dia}" está duplicado en el horario.`,
            );
        }
        diasVistos.add(turno.dia);

        if (
            !regexHora.test(turno.horaInicio) ||
            !regexHora.test(turno.horaFin)
        ) {
            throw new Error(
                `Las horas en ${turno.dia} deben tener formato HH:MM (en bloques de 00 o 30).`,
            );
        }
        if (turno.horaInicio >= turno.horaFin) {
            throw new Error(
                `En ${turno.dia}, la hora de inicio debe ser menor a la de fin.`,
            );
        }
    }
    return true;
};

// fechas de nacimiento deben ser en el pasado y mayor de edad
const validarFechaNacimiento = (value) => {
    const fecha = new Date(value);
    const hoy = new Date();

    if (fecha >= hoy) {
        throw new Error("La fecha de nacimiento debe ser en el pasado.");
    }

    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
    }

    if (edad < 18) {
        throw new Error("Debe ser mayor de edad.");
    }

    return true;
};

// valida la galeria mixta
const validarGaleria = (value, { req }) => {
    const hayFotosNuevas = req.files && req.files.nuevasFotosGaleria;
    let cantidadViejas = 0;
    let cantidadNuevas = 0;

    // validar la estructura de las fotos conservadas
    if (value && Array.isArray(value)) {
        cantidadViejas = value.length;

        for (const [index, foto] of value.entries()) {
            if (!foto.url || !foto.public_id) {
                throw new Error(
                    `La imagen conservada en la posición ${index} no tiene una estructura válida (Falta url o public_id).`,
                );
            }
        }
    }

    // valdiar fotos nuevas
    if (hayFotosNuevas) {
        // normalizar a array si viene una sola foto
        const fotosNuevas = Array.isArray(req.files.nuevasFotosGaleria)
            ? req.files.nuevasFotosGaleria
            : [req.files.nuevasFotosGaleria];

        cantidadNuevas = fotosNuevas.length;
        const formatosValidos = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];

        for (const foto of fotosNuevas) {
            if (foto.size === 0) {
                throw new Error(
                    `El archivo "${foto.name}" está vacío o dañado.`,
                );
            }
            if (!formatosValidos.includes(foto.mimetype)) {
                throw new Error(
                    `El archivo "${foto.name}" no es válido. Solo JPG, PNG o WEBP.`,
                );
            }
        }
    }

    // que haya al menos 1 foto
    if (cantidadViejas + cantidadNuevas === 0) {
        throw new Error(
            "La galería no puede quedar completamente vacía. Debe tener al menos una imagen.",
        );
    }

    return true;
};

module.exports = {
    validarImagen,
    sanitizarArreglo,
    sanitizarArregloIDs,
    validarEstructuraHorario,
    validarFechaNacimiento,
    validarGaleria,
};
