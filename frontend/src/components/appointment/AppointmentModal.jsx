// React
import React, { useState, useEffect } from 'react';

// Utils
import { toastNeutral, toastError, toastSuccess } from '@/utils/notify';

// API
import { updateCitaStatus } from '@/api/citas.api';

// MUI
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Iconos
import CloseIcon from '@mui/icons-material/Close';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

// Componentes propios
import MainButton from '@/components/common/MainButton';
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import SimpleInfoDisplay from '@/components/common/SimpleInfoDisplay';
import BaseDialog from '@/components/common/BaseDialog';

// <--------------- CONSTANTES --------------->
const OPCIONES_ESTADO = ['Pendiente', 'Confirmada', 'Realizada'];

const AppointmentModal = ({ open, onClose, appointment }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- ESTADOS --------------->
  const [estadoCita, setEstadoCita] = useState('Pendiente');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // <--------------- EFFECTS --------------->

  // Sincroniza el estado local con la cita recibida
  useEffect(() => {
    if (appointment) {
      const rawStatus =
        appointment.estado ||
        appointment.status?.name ||
        appointment.status ||
        'pendiente';

      const capitalizedStatus =
        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

      setEstadoCita(capitalizedStatus);
    }
  }, [appointment]);

  // <--------------- FUNCIONES --------------->

  // Función para extraer el texto exacto del error del backend
  const extractErrorMessage = (error, defaultMsg) => {
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error !== null) {
      const primerError = Object.values(error)[0];
      return primerError?.msg || defaultMsg;
    }
    return defaultMsg;
  };

  // Abre el dialogo de cancelacion
  const handleOpenCancelDialog = () => setIsCancelDialogOpen(true);

  // Confirma y procesa la cancelacion
  const handleCloseCancelDialog = async (hasAccepted) => {
    setIsCancelDialogOpen(false);

    if (hasAccepted) {
      try {
        await updateCitaStatus(appointment._id, 'cancelada');
        toastNeutral('La cita ha sido cancelada.', 'cancel-appointment-toast');

        onClose(true); // Se recarga el calendario
      } catch (error) {
        toastError(
          extractErrorMessage(error, 'Error al cancelar la cita'),
          'error-change-status',
        );
      }
    }
  };

  // PATCH status cita
  const handleStatusChange = async (event) => {
    const nuevoEstado = event.target.value;

    try {
      await updateCitaStatus(appointment._id, nuevoEstado.toLowerCase());

      setEstadoCita(nuevoEstado);

      if (nuevoEstado === 'Cancelada') {
        toastNeutral(`La cita ahora está: ${nuevoEstado}`, 'status-update');
      } else {
        toastSuccess(
          `La cita ha sido marcada como ${nuevoEstado}`,
          'status-update',
        );
      }
    } catch (error) {
      toastError(
        extractErrorMessage(error, 'Error al actualizar el estado de la cita'),
        'error-status-update',
      );
    }
  };

  // <--------------- EARLY RETURN --------------->
  if (!appointment) return null;

  const showCancelButton =
    estadoCita !== 'Realizada' && estadoCita !== 'Cancelada';

  // <--------------- RENDER --------------->
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          backgroundImage: 'none',
          borderRadius: '16px',
          p: { xs: 3, md: 4 },
          position: 'relative',
          border: (theme) => theme.palette.customBorders.section,
        },
      }}
    >
      {/* Titulo y boton de cerrar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        {/* Titulo */}
        <Title
          children={appointment.servicioAgendado?.nombreSnapshot || 'Servicio'}
          color='white'
          size={{ xs: '24px', md: '32px' }}
        />
        {/* Boton cerrar */}
        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            '&:hover': { backgroundColor: 'primary.main' },
            width: 40,
            height: 40,
            flexShrink: 0,
          }}
        >
          <CloseIcon sx={{ fontSize: '24px', strokeWidth: 2 }} />
        </IconButton>
      </Box>

      {/* Fecha y estado de la cita */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Fecha */}
        <Box
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.primary.light}`,
            pb: 0.5,
            width: 'fit-content',
          }}
        >
          <Text
            children={
              appointment.fecha
                ? new Date(appointment.fecha).toLocaleDateString('es-ES', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }) + ` de ${appointment.horaInicio} a ${appointment.horaFin}`
                : 'Fecha no disponible'
            }
            color='primary.light'
            size='16px'
          />
        </Box>

        {/* Estado de la cita */}
        <Select
          value={estadoCita}
          onChange={handleStatusChange}
          IconComponent={() => (
            <ArrowDropDownIcon
              sx={{ color: 'primary.light', mr: 1, pointerEvents: 'none' }}
            />
          )}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <QueryBuilderIcon sx={{ color: 'white', fontSize: '20px' }} />
              <Text children='Estado:' color='white' size='16px' />
              <Text children={selected} color='primary.light' size='16px' />
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'background.modalMenu',
                color: 'text.primary',
                borderRadius: '12px',
                mt: 1,
                border: '1px solid rgba(255,255,255,0.1)',
                '& .MuiMenuItem-root': {
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '15px',
                },
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15) !important',
                  color: 'primary.light',
                  fontWeight: 'bold',
                },
              },
            },
          }}
          sx={{
            backgroundColor: 'background.serviceChip',
            borderRadius: '50px',
            width: 'fit-content',
            '& .MuiSelect-select': {
              py: 1,
              pl: 2,
              pr: '1px !important',
              display: 'flex',
              alignItems: 'center',
            },
            '& fieldset': { border: 'none' },
          }}
        >
          {OPCIONES_ESTADO.map((opcion) => (
            <MenuItem key={opcion} value={opcion}>
              {opcion}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Empleado y precio */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Empleado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={appointment.employee?.foto}
            sx={{ width: 40, height: 40 }}
          />
          <Text
            children={appointment.employee?.name || 'Empleado 1'}
            color='white'
            size='18px'
          />
        </Box>

        {/* Precio */}
        <Box>
          <SimpleInfoDisplay
            title='Costo: '
            text={
              appointment.servicioAgendado?.precioSnapshot !== undefined &&
              appointment.servicioAgendado?.precioSnapshot !== null
                ? `$${parseFloat(appointment.servicioAgendado.precioSnapshot).toFixed(2)} MXN`
                : '$0.00 MXN'
            }
            align='center'
            width='fit-content'
            textWeight='bold'
            titleWeight='normal'
            titleSize='18px'
            textSize='20px'
            titleColor='white'
            textColor='white'
            background={theme.palette.background.serviceChip}
            border='none'
          />
        </Box>
      </Box>

      {/* Datos del cliente */}
      <Box sx={{ mt: 1 }}>
        <Text
          children='Datos del cliente'
          color='primary.light'
          size='20'
          fontWeight='bold'
        />

        <Box
          sx={{
            p: 0,
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid size={{ xs: 12, md: 9 }}>
              {/* Nombre */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Nombre Completo'
                  color='primary.main'
                  size='14'
                />
                <SimpleInfoDisplay
                  title={
                    appointment.datosCliente?.nombre || 'Nombre no encontrado'
                  }
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              {/* Edad */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text children='Edad' color='primary.main' size='14' />
                <SimpleInfoDisplay
                  title={
                    appointment.datosCliente?.edad || 'Edad no especificada'
                  }
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              {/* Sexo */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text children='Sexo' color='primary.main' size='14' />
                <SimpleInfoDisplay
                  title={
                    appointment.datosCliente?.sexo
                      ? appointment.datosCliente.sexo.charAt(0).toUpperCase() +
                        appointment.datosCliente.sexo.slice(1)
                      : 'Sexo no especificado'
                  }
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Correo */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Correo electrónico'
                  color='primary.main'
                  size='14'
                />
                <SimpleInfoDisplay
                  title={
                    appointment.datosCliente?.correo || 'Correo no encontrado'
                  }
                />
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={{ xs: 2, md: 5 }}
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Grid size={{ xs: 12, md: showCancelButton ? 6 : 12 }}>
              {/* Numero */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Número telefónico'
                  color='primary.main'
                  size='14'
                />
                <SimpleInfoDisplay
                  title={
                    appointment.datosCliente?.telefono ||
                    'Teléfono no encontrado'
                  }
                />
              </Box>
            </Grid>

            {showCancelButton && (
              <Grid size={{ xs: 12, md: 6 }}>
                {/* Boton cancelar cita */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                  }}
                >
                  <MainButton
                    onClick={handleOpenCancelDialog}
                    size={{ xs: '14px', md: '16px' }}
                    sx={{
                      mt: 1,
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  >
                    <CloseIcon /> Cancelar cita
                  </MainButton>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Dialogo */}
      <BaseDialog
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        title={'Advertencia'}
        icon={<AdvertismentIcon />}
        content={
          <>
            {' '}
            Está a punto de cancelar una cita <br />
            <b>¿Desea continuar?</b>
          </>
        }
      />
    </Dialog>
  );
};

export default AppointmentModal;
