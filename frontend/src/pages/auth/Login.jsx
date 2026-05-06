// React
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Contexto
import { useAuth } from '@/context/AuthContext';

// Constantes
import { ROUTES, ROLES } from '@/constants/routes';

// Utils
import { toastError } from '@/utils/notify';

// API y Schemas
import { postLogin } from '@/api/auth.api';
import { loginSchema } from '@/schemas/auth.schema';

// MUI
import { useTheme } from '@mui/material/styles';
import MuiLink from '@mui/material/Link';

// <--------------- Componentes --------------->

// Common
import Card from '@/components/common/Card';
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';

// Form
import TextInput from '@/components/form/TextInput';
import PasswordInput from '@/components/form/PasswordInput';

function Login() {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  // <--------------- ESTADOS --------------->
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // <--------------- FUNCIONES --------------->

  // Funcion para el correo
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Si hay un error, se limpiamos al escribir
    if (formErrors.correo) {
      setFormErrors((prev) => ({ ...prev, correo: null }));
    }
  };

  // Funcion para la contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Si hay un error, se limpiamos al escribir
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: null }));
    }
  };

  // Funcion boton login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    // Se limpian los errores al intentar de nuevo
    setFormErrors({});

    // Valida los campos
    const validation = loginSchema.safeParse({ correo: email, password });

    if (!validation.success) {
      // Zod separa los errores por campo automáticamente
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);
      return; // Detenemos la ejecución sin lanzar el toast general
    }

    setIsSaving(true);

    try {
      // Se llama la api
      const response = await postLogin(validation.data);

      // Guarda datos
      login({
        token: 'active',
        role: response.usuario.rol,
        name: response.usuario.nombre,
        email: email,
      });

      // Redireccionamiento segun rol
      if (response.usuario.rol === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.CALENDAR);
      } else {
        navigate(ROUTES.CLIENT.MAIN);
      }
    } catch (error) {
      toastError(error, 'login-error');
    } finally {
      setIsSaving(false);
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Card
      bg={theme.customGradients.mainBackground}
      brRadius='12px'
      showShadow={true}
    >
      {/* Titulo y descripcion */}
      <Title>Bienvenido de vuelta</Title>
      <Text size={20}>Inicia sesión para continuar</Text>

      {/* Correo */}
      <TextInput
        type='email'
        label='Correo electrónico'
        placeholder='ejemplo@gmail.com'
        value={email}
        onChange={handleEmailChange}
        helperText={formErrors.correo ? formErrors.correo[0] : ''}
      />

      {/* Contrasena */}
      <PasswordInput
        value={password}
        onChange={handlePasswordChange}
        helperText={formErrors.password ? formErrors.password[0] : ''}
      />

      {/* Boton login */}
      <MainButton size={20} onClick={handleLogin} disabled={isSaving}>
        {isSaving ? 'Cargando' : 'Iniciar sesión'}
      </MainButton>

      {/* Redirigir signup */}
      <Text align='center'>
        ¿No tienes una cuenta?{' '}
        <MuiLink
          component={RouterLink}
          to={ROUTES.PUBLIC.SIGNUP}
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.light',
            },
          }}
        >
          Regístrate
        </MuiLink>
      </Text>
    </Card>
  );
}

export default Login;
