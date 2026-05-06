import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

// Componentes propios
import MainButton from '@/components/common/MainButton';
import TextInput from '@/components/form/TextInput';
import DateInput from '@/components/form/DateInput';
import Text from '@/components/common/Text';

// Icono
import UploadFileIcon from '@mui/icons-material/UploadFile';

const EmployeeDataSection = ({
  formData,
  handleInputChange,
  handleDateChange,
  handlePhotoChange,
  formErrors,
}) => {
  return (
    <Grid container spacing={4}>
      {/* Foto y nombre */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Foto */}
          <Box
            id='field-foto'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 1,
            }}
          >
            <Avatar
              src={formData.foto}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                border: (theme) => theme.palette.customBorders.avatar,
              }}
            />
            <MainButton
              component='label'
              size={{ xs: '12px', md: '14px' }}
              sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                cursor: 'pointer',
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
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Nombre */}
          <TextInput
            id='field-nombre'
            label='Nombre'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Nombre completo'
            helperText={formErrors.nombre ? formErrors.nombre[0] : ''}
          />
        </Box>
      </Grid>

      {/* Correo, fecha y telefono */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 0 },
          }}
        >
          {/* Correo */}
          <TextInput
            id='field-correo'
            label='Correo electrónico'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            type='email'
            placeholder='ejemplo@gmail.com'
            helperText={formErrors.correo ? formErrors.correo[0] : ''}
          />

          {/* Fecha */}
          <DateInput
            id='field-fechaNacimiento'
            label='Fecha de nacimiento'
            name='birthdate'
            value={formData.birthdate}
            onChange={handleDateChange}
            helperText={
              formErrors.fechaNacimiento ? formErrors.fechaNacimiento[0] : ''
            }
          />

          {/* Telefono */}
          <TextInput
            id='field-telefono'
            label='Número telefónico'
            name='phone'
            type='number'
            value={formData.phone}
            onChange={handleInputChange}
            placeholder='81 1111 1111'
            helperText={formErrors.telefono ? formErrors.telefono[0] : ''}
          />
        </Box>
      </Grid>

      {/* Informacion */}
      <Grid size={12}>
        <Box sx={{ mt: 1 }}>
          <TextInput
            id='field-informacion'
            label='Información'
            name='info'
            value={formData.info}
            onChange={handleInputChange}
            multiline
            rows={5}
            placeholder='Escriba la información del empleado'
            helperText={formErrors.informacion ? formErrors.informacion[0] : ''}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '16px' },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EmployeeDataSection;
