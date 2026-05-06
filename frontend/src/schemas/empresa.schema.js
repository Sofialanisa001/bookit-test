import { z } from 'zod';
import {
  MAX_FILE_SIZE,
  VALID_IMAGE_TYPES,
  VALID_EXTENSIONS,
} from '@/constants/validaciones';

// Validar si una imagen ya estaba en la BD o el tipo de formato
const isValidFile = (val) => {
  if (typeof val === 'string') return true; // Imagen que ya estaba en la BD

  if (val instanceof File) {
    const hasValidType = VALID_IMAGE_TYPES.includes(val.type);

    const fileName = val.name.toLowerCase();
    const hasValidExtension = VALID_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );

    return hasValidType && hasValidExtension;
  }

  return false;
};

// Valida el tamaño de la imagen
const isValidSize = (val) => {
  if (typeof val === 'string') return true; // Si ya estaba en la BD, no verificamos
  if (val instanceof File) {
    return val.size <= MAX_FILE_SIZE;
  }
  return false;
};

export const empresaSchema = z.object({
  logo: z
    .any()
    .refine(
      (val) => val !== null && val !== '',
      'El logo de la empresa es obligatorio',
    )
    .refine(isValidFile, 'El logo debe ser PNG, JPEG, JPG o WEBP.')
    .refine(isValidSize, 'El logo no debe pesar más de 5MB.'),
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  telefono: z
    .string()
    .regex(
      /^\d{10,15}$/,
      'El teléfono debe tener entre 10 y 15 dígitos numéricos',
    ),
  descripcion: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(1000, 'Máximo 1000 caracteres')
    .refine(
      (val) => val.length === 0 || val.length >= 10,
      'La descripción es muy corta',
    ),
  slogan: z
    .string()
    .min(1, 'El slogan es obligatorio')
    .max(500, 'Máximo 500 caracteres'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),

  horario: z
    .any()
    .refine(
      (map) => Object.values(map || {}).some((arr) => arr.length > 0),
      'Debes asignar al menos un horario laboral en la semana',
    ),

  imagenPrincipal: z
    .any()
    .refine(
      (val) => val !== null && val !== '',
      'La imagen principal es obligatoria',
    )
    .refine(isValidFile, 'La imagen principal debe ser PNG, JPEG, JPG o WEBP.')
    .refine(isValidSize, 'La imagen principal no debe pesar más de 5MB.'),

  galeria: z
    .any()
    .refine(
      (data) => data.urls.length > 0,
      'Debes subir al menos una imagen para la galería',
    )
    .refine(
      (data) => data.files.every(isValidFile),
      'Una o más imágenes de la galería tienen un formato inválido. Solo PNG, JPEG, JPG o WEBP.',
    )
    .refine(
      (data) => data.files.every(isValidSize),
      'Una o más imágenes de la galería superan el límite de 5MB.',
    ),
});
