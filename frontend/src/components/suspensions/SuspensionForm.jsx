import React, { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Utils
import { toastError } from '@/utils/notify';

// Iconos
import CheckIcon from '@mui/icons-material/Check';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

// Componentes propios
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';
import Calendar from '@/components/common/Calendar';
import BaseDialog from '@/components/common/BaseDialog';

// <--------------- CONSTANTE --------------->

// Genera tiempo de 30 a 30 min
const opcionesTiempo = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
    .toString()
    .padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const SuspensionForm = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  tipoSuspension,
  setTipoSuspension,
  horaInicio,
  setHoraInicio,
  horaFin,
  setHoraFin,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  empleados,
  handleAplicar,
  selectMenuProps,
  selectEstilos,
}) => {
  // <--------------- ESTADOS --------------->
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // <--------------- FUNCIONES --------------->

  // Abrir dialogo
  const handleOpenSaveDialog = () => {
    if (tipoSuspension === 'horario') {
      if (horaInicio >= horaFin) {
        toastError(
          'La hora de inicio debe ser anterior a la hora de fin.',
          'error-horas',
        );
        return;
      }
    }

    setIsSaveDialogOpen(true);
  };

  // Cerrar dialogo
  const handleCloseSaveDialog = (hasAccepted) => {
    setIsSaveDialogOpen(false);
    if (hasAccepted) {
      handleAplicar();
    }
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{
        border: (theme) => theme.palette.customBorders.section,
        borderRadius: '16px',
        p: { xs: 2, md: 4 },
      }}
    >
      <Text
        children='Registrar suspensión:'
        color='primary.light'
        size='22'
        sx={{ mb: { xs: 3, md: 4 }, display: 'block' }}
      />

      {/* Contenedor calendario y formulario */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: { xs: 4, md: 6 },
          width: '100%',
        }}
      >
        {/* Seccion calendario */}
        <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <Calendar
            value={fechaSeleccionada}
            onChange={(newValue) => setFechaSeleccionada(newValue)}
          />
        </Box>

        {/* Seccion formulario */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3,
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {/* Tipo de suspension */}
          <Select
            value={tipoSuspension}
            onChange={(e) => setTipoSuspension(e.target.value)}
            MenuProps={selectMenuProps}
            sx={selectEstilos}
          >
            <MenuItem value='horario'>Seleccionar horario</MenuItem>
            <MenuItem value='todo_dia'>Todo el día</MenuItem>
          </Select>

          {/* Rango de horas 24 horas */}
          {tipoSuspension === 'horario' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Hora inicio */}
              <Select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                size='small'
                MenuProps={selectMenuProps}
                sx={{
                  flex: 1,
                  backgroundColor: 'background.serviceChip',
                  borderRadius: '8px',
                  color: 'text.primary',
                  '& fieldset': { border: 'none' },
                  '& .MuiSelect-select': {
                    padding: '10px',
                    textAlign: 'center',
                  },
                  '& .MuiSvgIcon-root': { color: 'primary.light' },
                }}
              >
                {opcionesTiempo.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>

              <Text children='hasta' color='white' size='14px' />

              {/* Hora fin */}
              <Select
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                size='small'
                MenuProps={selectMenuProps}
                sx={{
                  flex: 1,
                  backgroundColor: 'background.serviceChip',
                  borderRadius: '8px',
                  color: 'text.primary',
                  '& fieldset': { border: 'none' },
                  '& .MuiSelect-select': {
                    padding: '10px',
                    textAlign: 'center',
                  },
                  '& .MuiSvgIcon-root': { color: 'primary.light' },
                }}
              >
                {opcionesTiempo.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {/* Seleccionar empleado */}
          <Select
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            MenuProps={selectMenuProps}
            sx={selectEstilos}
          >
            {empleados.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.nombre}
              </MenuItem>
            ))}
          </Select>

          {/* Boton aplicar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <MainButton
              size='16px'
              onClick={handleOpenSaveDialog}
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                px: 4,
                display: 'flex',
                gap: 1,
              }}
            >
              <CheckIcon fontSize='small' /> Aplicar
            </MainButton>
          </Box>
        </Box>
      </Box>

      {/* Dialogo */}
      <BaseDialog
        id='save-suspension-data'
        open={isSaveDialogOpen}
        onClose={handleCloseSaveDialog}
        title={'Atención'}
        icon={<AdvertismentIcon />}
        content={
          <>
            {' '}
            Está a punto de añadir una suspensión. Si hay citas programadas,
            serán canceladas. <br /> <b>¿Desea continuar?</b>
          </>
        }
      />
    </Box>
  );
};

export default SuspensionForm;
