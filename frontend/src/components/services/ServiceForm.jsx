import React, { useState, useEffect } from 'react';

// Utils
import { toastSuccess, toastError } from '@/utils/notify';

// Schema
import { servicioSchema } from '@/schemas/servicio.schema';

// API
import { createServicio, updateServicio } from '@/api/servicios.api';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

// Iconos
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Componentes propios
import MainButton from '@/components/common/MainButton';
import TextInput from '@/components/form/TextInput';
import Text from '@/components/common/Text';

// <----------- CONSTANTE ----------->
// Opciones para la duracion de un servicio hasta 6 horas max
const opcionesDuracion = Array.from(
  { length: 6 },
  (_, i) => `${(i + 1) * 30} minutos`,
);

const ServiceForm = ({ service, onCancel, onSave, isEditing }) => {
  // <--------------- ESTADOS --------------->
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    tiempo: '30 minutos',
    imagen: null,
    archivoFisico: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    if (service && service._id) {
      // Editar servicio
      setFormData({
        nombre: service.nombre || '',
        precio: service.precio || '',
        descripcion: service.descripcion || '',
        tiempo: service.duracion ? `${service.duracion} minutos` : '30 minutos',
        imagen: service.foto?.url || null,
        archivoFisico: null,
      });
    } else {
      // Nuevo servicio
      setFormData({
        nombre: '',
        precio: '',
        descripcion: '',
        tiempo: '30 minutos',
        imagen: null,
        archivoFisico: null,
      });
    }
  }, [service]);

  // <--------------- DERIVADO --------------->
  const opcionesSeguras = [...opcionesDuracion];
  if (formData.tiempo && !opcionesSeguras.includes(formData.tiempo)) {
    opcionesSeguras.unshift(formData.tiempo);
  }

  // <--------------- FUNCIONES --------------->

  // Llena los inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Llena la foto
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imagen: photoUrl,
        archivoFisico: file,
      }));

      if (formErrors.foto) setFormErrors((prev) => ({ ...prev, foto: null }));
    }
  };

  // Boton guardar
  const handleSubmit = async () => {
    if (isSaving) return;

    // Se limpian los errores
    setFormErrors({});

    const dataToValidate = {
      nombre: formData.nombre,
      precio: formData.precio,
      descripcion: formData.descripcion,
      tiempo: formData.tiempo,
      foto: formData.archivoFisico || formData.imagen,
    };

    // Validamos los campos
    const validation = servicioSchema.safeParse(dataToValidate);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);

      // Scroll al primer error
      setTimeout(() => {
        const fieldOrder = [
          'foto',
          'nombre',
          'descripcion',
          'precio',
          'tiempo',
        ];

        for (const key of fieldOrder) {
          if (fieldErrors[key]) {
            const element =
              document.getElementById(`field-${key}`) ||
              document.querySelector(`[name="${key}"]`);

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              break; 
            }
          }
        }
      }, 50);

      return;
    }

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', formData.precio);
      
      const duracionNumerica = formData.tiempo.replace(/\D/g, '');
      formDataToSend.append('duracion', duracionNumerica);

      if (formData.archivoFisico) {
        formDataToSend.append('foto', formData.archivoFisico);
      }

      if (isEditing) {
        // PATCH servicio
        const response = await updateServicio(service._id, formDataToSend);

        toastSuccess(
          response.msg || 'Servicio actualizado correctamente.',
          'service-save-toast',
        );
        
      } else {
        // POST servicio
        const response = await createServicio(formDataToSend);

        toastSuccess(
          response.msg || 'Servicio creado correctamente',
          'service-save-toast',
        );
      }

      // Se cierra y vuelve a donde estan todos los servicios
      onSave();

    } catch (error) {
      toastError(
        typeof error === 'string' ? error : 'Ocurrió un error al guardar.',
        'save-error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <Grid container spacing={4}>
        {/* Imagen y boton cargar foto */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}
          >
            {/* Foto */}
            <Box
              id='field-foto'
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                background: (theme) => theme.customGradients.imagePlaceholder,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0px 0px 10px rgba(0,0,0,0.1)',
              }}
            >
              {formData.imagen ? (
                <img
                  src={formData.imagen}
                  alt={formData.nombre || 'Servicio'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <InsertPhotoIcon
                  sx={{ fontSize: 80, color: 'white', opacity: 0.8 }}
                />
              )}
            </Box>

            {/* Cargar foto */}
            <MainButton
              component='label'
              fullWidth
              size={{ xs: '14px', md: '16px' }}
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '50px',
              }}
            >
              <UploadFileIcon fontSize='small' /> Subir foto
              <input
                type='file'
                accept='.png, .jpeg, .jpg, .webp'
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </MainButton>

            {/* Error */}
            {formErrors.foto && (
              <Text
                children={formErrors.foto[0]}
                color='error.main'
                size='12px'
                align='center'
              />
            )}
          </Box>
        </Grid>

        {/* Nombre y descripcion */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              height: '100%',
            }}
          >
            {/* Nombre */}
            <TextInput
              label='Nombre'
              name='nombre'
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder='Ejemplo'
              helperText={formErrors.nombre ? formErrors.nombre[0] : ''}
            />

            {/* Descripcion */}
            <TextInput
              label='Descripción'
              name='descripcion'
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              placeholder='Ejemplo'
              helperText={
                formErrors.descripcion ? formErrors.descripcion[0] : ''
              }
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  alignItems: 'flex-start',
                  borderRadius: '24px',
                },
              }}
            />
          </Box>
        </Grid>

        {/* Precio */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label='Precio'
            name='precio'
            value={formData.precio}
            onChange={handleInputChange}
            placeholder='$0.00'
            helperText={formErrors.precio ? formErrors.precio[0] : ''}
          />
        </Grid>

        {/* Duracion del servicio */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            select
            label='Duración del servicio'
            name='tiempo'
            value={formData.tiempo}
            onChange={handleInputChange}
            helperText={formErrors.tiempo ? formErrors.tiempo[0] : ''}
            SelectProps={{
              sx: { '& .MuiSvgIcon-root': { color: 'primary.light' } },
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: (theme) =>
                      theme.palette.background.serviceChip,
                    color: 'white',
                    '& .MuiMenuItem-root:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.background.menuHover,
                    },
                    '& .Mui-selected': {
                      backgroundColor: (theme) =>
                        `${theme.palette.background.menuSelected} !important`,
                    },
                  },
                },
              },
            }}
          >
            {opcionesSeguras.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </TextInput>
        </Grid>
      </Grid>

      {/* Boton guardar */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <MainButton
          size={{ xs: '16px', md: '18px' }}
          onClick={handleSubmit}
          disabled={isSaving}
          sx={{
            backgroundColor: isSaving
              ? 'action.disabledBackground'
              : 'primary.light',
            color: isSaving ? 'action.disabled' : 'primary.contrastText',
            px: 8,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Guardar
        </MainButton>
      </Box>
    </Box>
  );
};

export default ServiceForm;
