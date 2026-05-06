import { z } from 'zod';
import { MAX_FILE_SIZE, VALID_IMAGE_TYPES } from '@/constants/validaciones';

export const servicioSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: 'El nombre es requerido.' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres.' }),

  descripcion: z
    .string()
    .min(1, { message: 'La descripción es requerida.' })
    .max(500, {
      message: 'La descripción no puede exceder los 500 caracteres.',
    }),

  precio: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El precio debe ser un número válido.' })
      .positive({ message: 'El precio debe ser mayor a $0.' })
      .refine(
        (val) => {
          const str = val.toString();
          if (str.includes('.')) {
            return str.split('.')[1].length <= 2;
          }
          return true;
        },
        {
          message: 'El precio solo puede tener hasta 2 decimales.',
        },
      ),
  ),

  tiempo: z
    .string()
    .min(1, { message: 'La duración es requerida.' })
    .refine(
      (val) => {
        const minutos = parseInt(val.replace(/\D/g, ''), 10);

        return !isNaN(minutos) && minutos >= 30 && minutos <= 180;
      },
      {
        message: 'La duración debe ser entre 30 y 180 minutos.',
      },
    ),

  foto: z
    .any()
    .refine((file) => file !== null && file !== undefined, {
      message: 'La foto es obligatoria.',
    })
    .refine(
      (file) => {
        if (typeof file === 'string') return true;
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
});
