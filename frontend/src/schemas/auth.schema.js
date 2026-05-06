import { z } from 'zod';

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

export const loginSchema = z.object({
  correo: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const signupSchema = z
  .object({
    nombre: z
      .string()
      .min(1, { message: 'El nombre no puede estar vacío.' })
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(80, 'El nombre no puede exceder los 80 caracteres')
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        'El nombre solo puede contener letras y espacios',
      ),
    sexo: z
      .string({
        invalid_type_error: 'Selecciona tu sexo',
        required_error: 'Selecciona tu sexo',
      })
      .regex(/^[MF]$/, 'Selecciona tu sexo'),
    telefono: z
      .string()
      .regex(/^\d{10}$/, 'Ingresa un número de celular válido de 10 dígitos'),
    correo: z.string().email('Ingresa un correo electrónico válido'),
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
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .max(20, 'Máximo 20 caracteres')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    passwordConfirm: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm'],
  });
