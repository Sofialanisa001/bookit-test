// React
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Constantes y validacion
import { ROUTES } from '@/constants/routes';
import { signupSchema } from '@/schemas/auth.schema';

// Utils
import { toastError } from '@/utils/notify';

// API
import { postRegister } from '@/api/auth.api';

// MUI
import { useTheme } from '@mui/material/styles';
import MuiLink from '@mui/material/Link';
import Box from '@mui/material/Box';

// <--------------- Componentes --------------->
import Card from '@/components/common/Card';
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';
import InfoDialog from '@/components/common/InfoDialog';
import TextInput from '@/components/form/TextInput';
import PasswordInput from '@/components/form/PasswordInput';
import GenderSelect from '@/components/form/GenderSelect';
import DateInput from '@/components/form/DateInput';

function Signup() {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();
  const navigate = useNavigate();

  // <--------------- ESTADOS --------------->

  // Estado del dialogo
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Guarda los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '',
    telefono: '',
    correo: '',
    fechaNacimiento: '',
    password: '',
    passwordConfirm: '',
  });

  // Guardar los errores individuales
  const [formErrors, setFormErrors] = useState({});

  // API
  const [isSaving, setIsSaving] = useState(false);

  // <--------------- FUNCIONES --------------->

  // Funcion para actualizar el estado del formulario y limpiar errores
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Funcion boton registrar
  const handleSignup = async () => {
    // Evita doble click
    if (isSaving) return;

    // Se limpian los errores
    setFormErrors({});

    // Se validan los campos
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);

      const firstErrorKey = Object.keys(fieldErrors)[0];

      // Si hay un error al validar, se hace scroll al primer error
      if (firstErrorKey) {
        setTimeout(() => {
          const errorElement = document.getElementById(
            `campo-${firstErrorKey}`,
          );
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center', 
            });
          }
        }, 100);
      }

      return;
    }

    const payload = {
      nombre: formData.nombre,
      sexo: formData.sexo === 'M' ? 'Masculino' : 'Femenino',
      telefono: formData.telefono,
      correo: formData.correo,
      fechaNacimiento: formData.fechaNacimiento,
      password: formData.password,
      passwordConfirmacion: formData.passwordConfirm,
    };

    try {
      // Se bloquea el boton
      setIsSaving(true);
      await postRegister(payload);

      // Si todo bien, sale el dialogo
      setIsSuccessDialogOpen(true);
    } catch (error) {
      let errorMessage = 'Ocurrió un error al registrarse';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
        // Se obtiene todo el objeto de la respuesta
        const errorInterno = Object.values(error)[0];

        // Se muestra solo el mensaje de error
        errorMessage = errorInterno?.msg || 'Error de validación en los datos';
      }

      toastError(String(errorMessage), 'signup-error');
    } finally {
      // Se desbloquea el boton
      setIsSaving(false);
    }
  };

  // Funciones de diálogo y redireccionamiento
  const handleCloseDialog = () => setIsSuccessDialogOpen(false);
  const handleNavigation = () => navigate(ROUTES.PUBLIC.LOGIN);

  // <--------------- RENDER --------------->
  return (
    <>
      <Card
        bg={theme.customGradients.mainBackground}
        brRadius='12px'
        showShadow={true}
        offset={12}
      >
        {/* Titulo y descripcion */}
        <Title>BIENVENIDO.</Title>
        <Text size={20}>Regístrate para comenzar</Text>

        {/* Nombre */}
        <TextInput
          id='campo-nombre'
          type='text'
          label='Nombre'
          placeholder='Ejemplo'
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          helperText={formErrors.nombre ? formErrors.nombre[0] : ''}
        />

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          {/* Sexo */}
          <Box sx={{ flex: 0.35 }}>
            <GenderSelect
              id='campo-sexo'
              height='80px'
              value={formData.sexo}
              onChange={(value) => handleChange('sexo', value)}
              helperText={formErrors.sexo ? formErrors.sexo[0] : ''}
            />
          </Box>

          {/* Telefono */}
          <Box sx={{ flex: 0.65 }}>
            <TextInput
              id='campo-telefono'
              type='number'
              label='Teléfono'
              placeholder='Ej: 8123456789'
              height='80px'
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              helperText={formErrors.telefono ? formErrors.telefono[0] : ''}
            />
          </Box>
        </Box>

        {/* Correo */}
        <TextInput
          id='campo-correo'
          type='email'
          label='Correo electrónico'
          placeholder='ejemplo@gmail.com'
          value={formData.correo}
          onChange={(e) => handleChange('correo', e.target.value)}
          helperText={formErrors.correo ? formErrors.correo[0] : ''}
        />

        {/* Fecha de nacimiento */}
        <DateInput
          id='campo-fechaNacimiento'
          value={formData.fechaNacimiento}
          onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
          helperText={
            formErrors.fechaNacimiento ? formErrors.fechaNacimiento[0] : ''
          }
        />

        {/* Contrasena */}
        <PasswordInput
          id='campo-password'
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          helperText={formErrors.password ? formErrors.password[0] : ''}
        />

        {/* Confirmar contrasena */}
        <PasswordInput
          id='campo-passwordConfirm'
          label='Confirmar Contraseña'
          value={formData.passwordConfirm}
          onChange={(e) => handleChange('passwordConfirm', e.target.value)}
          helperText={
            formErrors.passwordConfirm ? formErrors.passwordConfirm[0] : ''
          }
        />

        {/* Boton registrar */}
        <MainButton size={20} onClick={handleSignup} disabled={isSaving}>
          {isSaving ? 'Registrando' : 'Regístrate'}
        </MainButton>

        {/* Redirigir login */}
        <Text align='center'>
          ¿Ya tienes una cuenta?{' '}
          <MuiLink
            component={RouterLink}
            to={ROUTES.PUBLIC.LOGIN}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.light',
              },
            }}
          >
            Inicia Sesión
          </MuiLink>
        </Text>
      </Card>

      {/* Dialogo inmediato */}
      <InfoDialog
        open={isSuccessDialogOpen}
        onClose={handleCloseDialog}
        onTransitionExited={handleNavigation}
        title='¡Registro Exitoso!'
        content='Tu cuenta ha sido creada.'
      />
    </>
  );
}

export default Signup;
