import { z } from 'zod';

export const citaClientSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: 'El nombre no puede estar vacío.' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede exceder los 80 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras y espacios',
    ),
  edad: z.coerce
    .number({
      invalid_type_error: 'La edad debe ser un número',
      required_error: 'La edad es requerida',
    })
    .min(10, 'Debes ser mayor de 10 años para agendar')
    .max(150, 'Ingresa una edad válida'),
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\d{10}$/, 'Ingresa un celular válido de 10 dígitos'),
  sexo: z
    .string({
      invalid_type_error: 'Selecciona tu sexo',
      required_error: 'Selecciona tu sexo',
    })
    .regex(/^[MF]$/, 'Selecciona tu sexo'),
  correo: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo electrónico válido'),
});
