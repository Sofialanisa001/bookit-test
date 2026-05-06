// React
import React, { useState, useEffect } from 'react';

// MUI
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// Contexto
import { useAuth } from '@/context/AuthContext';

// Utils
import { toastSuccess, toastError } from '@/utils/notify';

// API
import { getPerfil, updatePerfil } from '@/api/usuarios.api';

// Schema
import { updatePerfilSchema } from '@/schemas/usuario.schema';

// ************** componentes propios :3 **************
// |  common
import Title from '@/components/common/Title';
import MainButton from '@/components/common/MainButton';
import BaseDialog from '@/components/common/BaseDialog';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';
// |  formulario
import TextInput from '@/components/form/TextInput';
import DateInput from '@/components/form/DateInput';
import GenderSelect from '@/components/form/GenderSelect';
import PasswordInput from '@/components/form/PasswordInput';
// |  iconos
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

function Profile() {
  // <--------------- CONTEXTO --------------->
  const { updateUser } = useAuth();

  // <--------------- ESTADOS --------------->
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  // <--------------- DERIVADOS --------------->

  // GET perfil
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setServerError(false);

      const response = await getPerfil();

      if (response.ok) {
        let sexoMapeado = '';
        if (response.sexo) {
          sexoMapeado = response.sexo.toLowerCase() === 'masculino' ? 'M' : 'F';
        }

        const fetchedData = {
          nombre: response.nombre || '',
          correo: response.correo || '',
          fechaNacimiento: response.fechaNacimiento
            ? response.fechaNacimiento.split('T')[0]
            : '',
          sexo: sexoMapeado,
          telefono: response.telefono || '',
          password: '',
          confirmPassword: '',
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      }
    } catch (error) {
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    fetchProfileData();
  }, []);

  // <--------------- FUNCIONES --------------->
  // Manejo de cambios en los inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, sexo: value }));
    if (formErrors.sexo) {
      setFormErrors((prev) => ({ ...prev, sexo: null }));
    }
  };

  // Funcion para activar el modo editar
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Funcion para cancelar cambios
  const handleCancelEdit = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setFormErrors({});
    setIsEditing(false);
  };

  // Funcion boton guardar perfil
  const handleSaveProfile = () => {
    setFormErrors({});

    const validation = updatePerfilSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);

      const firstErrorKey = Object.keys(fieldErrors)[0];

      // Hacer scroll hacia el primer campo con error
      if (firstErrorKey) {
        setTimeout(() => {
          const errorElement = document.getElementById(
            `campo-${firstErrorKey}`,
          );
          if (errorElement) {
            const yOffset = -100;
            const y =
              errorElement.getBoundingClientRect().top +
              window.scrollY +
              yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }

      return;
    }

    setIsSaveDialogOpen(true);
  };

  // PATCH perfil
  // Funcion dialogo
  const handleCloseDialog = async (hasAccepted) => {
    if (!hasAccepted) {
      setIsSaveDialogOpen(false);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo === 'M' ? 'Masculino' : 'Femenino',
        telefono: formData.telefono,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.passwordConfirmacion = formData.confirmPassword;
      }

      // Llamada a la API
      const response = await updatePerfil(payload);

      toastSuccess(
        response.msg || 'Perfil actualizado correctamente.',
        'profile-save-toast',
      );

      updateUser(formData.nombre, formData.correo);

      setIsSaveDialogOpen(false);
      setIsEditing(false);

      // Se piden los datos de nuevo
      await fetchProfileData();
    } catch (error) {
      setIsSaveDialogOpen(false);

      const isValidationError =
        typeof error === 'object' &&
        error !== null &&
        Object.keys(error).length > 0 &&
        error[Object.keys(error)[0]]?.msg;

      if (isValidationError) {
        const fieldName = Object.keys(error)[0];
        const errorMsg = error[fieldName].msg;

        setFormErrors({ [fieldName]: [errorMsg] });

        setTimeout(() => {
          let errorElement = document.getElementById(`campo-${fieldName}`);
          if (fieldName === 'telefono') {
            const isDesktop = window.innerWidth >= 900;
            errorElement = document.getElementById(
              isDesktop ? 'campo-telefono-pc' : 'campo-telefono-mobile',
            );
          }
          if (errorElement) {
            const yOffset = -100;
            const y =
              errorElement.getBoundingClientRect().top +
              window.scrollY +
              yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      } else {
        toastError(
          typeof error === 'string' ? error : 'Ocurrió un error al guardar.',
          'profile-error',
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  // <--------------- RENDER --------------->
  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader height='auto' />
      </Box>
    );
  }

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={fetchProfileData}
        offsetMobile='64px'
        offsetDesktop='64px'
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          py: { xs: 2, md: 5 },
          px: { xs: 2, md: 5 },
          width: '95%',
          maxWidth: '1000px',
          mx: 'auto',
        }}
      >
        {/* Titulo */}
        <Box sx={{ px: 3 }}>
          <Title children='Editar perfil' color='text.primary' align='center' />
        </Box>

        {/* Formulario */}
        <Box
          sx={{
            mx: { xs: 0, md: 10 },
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Grid container spacing={{ xs: 3, md: 2 }} alignItems='flex-start'>
            {/* Nombre */}
            <Grid size={{ xs: 12 }}>
              <TextInput
                id='campo-nombre'
                label='Nombre'
                name='nombre'
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder='Ingrese su nombre'
                disabled={!isEditing}
                helperText={formErrors.nombre ? formErrors.nombre[0] : ''}
              />
            </Grid>

            {/* Fecha de nacimiento */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DateInput
                id='campo-fechaNacimiento'
                name='fechaNacimiento'
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                disabled={!isEditing}
                helperText={
                  formErrors.fechaNacimiento
                    ? formErrors.fechaNacimiento[0]
                    : ''
                }
              />
            </Grid>

            {/* Correo electrónico */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                id='campo-correo'
                label='Correo electrónico'
                name='correo'
                type='email'
                height='80px'
                value={formData.correo}
                onChange={handleInputChange}
                placeholder='Ingrese su correo'
                disabled={!isEditing}
                helperText={formErrors.correo ? formErrors.correo[0] : ''}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: { xs: 1.5, md: 2 },
                }}
              >
                {/* Sexo */}
                <Box sx={{ flex: { xs: 5, md: 1 } }}>
                  <GenderSelect
                    id='campo-sexo'
                    name='sexo'
                    value={formData.sexo}
                    onChange={handleGenderChange}
                    disabled={!isEditing}
                    helperText={formErrors.sexo ? formErrors.sexo[0] : ''}
                    height='80px'
                  />
                </Box>

                {/* Número telefónico */}
                <Box sx={{ flex: { xs: 9, md: 1 } }}>
                  <TextInput
                    id='campo-telefono'
                    label='Número telefónico'
                    name='telefono'
                    type='number'
                    height='80px'
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder='Ej: 8101010011'
                    disabled={!isEditing}
                    helperText={
                      formErrors.telefono ? formErrors.telefono[0] : ''
                    }
                  />
                </Box>
              </Box>
            </Grid>

            {/* Contraseñas */}
            {isEditing && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PasswordInput
                    id='campo-password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Nueva contraseña'
                    disabled={!isEditing}
                    helperText={
                      formErrors.password ? formErrors.password[0] : ''
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <PasswordInput
                    id='campo-confirmPassword'
                    label='Confirmar contraseña'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder='Confirme contraseña'
                    disabled={!isEditing}
                    helperText={
                      formErrors.confirmPassword
                        ? formErrors.confirmPassword[0]
                        : ''
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Botones de acción */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 3,
            m: 2,
            mt: 4,
          }}
        >
          {!isEditing ? (
            <MainButton onClick={handleEditClick}>Editar datos</MainButton>
          ) : (
            <>
              <MainButton
                onClick={handleCancelEdit}
                disabled={isSaving}
                sx={{
                  backgroundColor: 'transparent',
                  color: 'primary.light',
                  border: '2px solid',
                  borderColor: 'primary.light',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                Cancelar
              </MainButton>
              <MainButton onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Guardando' : 'Guardar'}
              </MainButton>
            </>
          )}
        </Box>
      </Box>

      {/* Dialogo */}
      <BaseDialog
        id='save-client-data'
        open={isSaveDialogOpen}
        onClose={handleCloseDialog}
        title={'Advertencia'}
        icon={<AdvertismentIcon />}
        content={
          <>
            {' '}
            Está a punto de cambiar sus datos personales <br />{' '}
            <b>¿Desea continuar?</b>
          </>
        }
      />
    </>
  );
}
export default Profile;
