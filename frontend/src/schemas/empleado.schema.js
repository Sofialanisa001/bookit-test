import { z } from 'zod';
import { MAX_FILE_SIZE, VALID_IMAGE_TYPES } from '@/constants/validaciones';

// Funcion para calcular la edad
const calcularEdad = (dateString) => {
  const today = new Date();
  const [year, month, day] = dateString.split('-');
  const birthDate = new Date(year, month - 1, day);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const empleadoSchema = z.object({
  foto: z
    .any()
    .refine((file) => file !== null && file !== undefined, {
      message: 'La foto del empleado es obligatoria.',
    })
    .refine(
      (file) => {
        if (typeof file === 'string') return true; // Si ya estaba en la BD
        return file && VALID_IMAGE_TYPES.includes(file.type);
      },
      { message: 'El formato de la imagen debe ser PNG, JPG, JPEG o WEBP.' },
    )
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
        return file && file.size <= MAX_FILE_SIZE;
      },
      { message: 'La imagen no debe pesar más de 5MB.' },
    ),

  nombre: z
    .string()
    .min(1, { message: 'El nombre no puede estar vacío.' })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    .max(80, { message: 'El nombre no puede exceder los 80 caracteres.' })
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras y espacios',
    ),

  correo: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido.' })
    .email({ message: 'El formato del correo electrónico es inválido.' }),

  telefono: z
    .string()
    .regex(/^\d{10}$/, 'Ingresa un número de celular válido de 10 dígitos'),

  informacion: z
    .string()
    .min(1, { message: 'La información del empleado es requerida.' })
    .max(500, {
      message: 'La información no puede exceder los 500 caracteres.',
    }),

  // Se valida que sea una fecha y que el empleado sea mayor de 18 años
  fechaNacimiento: z
    .string()
    .min(1, 'Ingresa tu fecha de nacimiento')
    // Min 18 años
    .refine((dateString) => calcularEdad(dateString) >= 18, {
      message: 'Debes ser mayor de 18 años para registrarte',
    })
    // Max 150 años
    .refine((dateString) => calcularEdad(dateString) <= 150, {
      message: 'Ingresa una fecha de nacimiento válida',
    }),

  servicios: z
    .array(z.string())
    .min(1, { message: 'Debe asignar al menos un servicio al empleado.' }),
});
