// React
import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// ****************************
// Componentes
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import BaseDialog from '@/components/common/BaseDialog';
import SimpleInfoDisplay from '@/components/common/SimpleInfoDisplay';
import MainButton from '@/components/common/MainButton';
// ****************************
// Iconos
import CloseIcon from '@mui/icons-material/CloseRounded';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

const AppointmentBody = ({ appointment, onConfirmCancel }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- ESTADOS --------------->
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // <--------------- DERIVADO --------------->
  const showCancelButton =
    appointment.status.name !== 'Cancelada' &&
    appointment.status.name !== 'Realizada';

  // <--------------- FUNCIONES --------------->

  // Funcion abrir dialogo
  const handleOpenCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  // Funcion cerrar dialogo
  const handleCloseCancelDialog = (hasAccepted) => {
    setIsCancelDialogOpen(false);
    if (hasAccepted) onConfirmCancel();
  };

  // <--------------- RENDER --------------->
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 0,
          px: { xs: 1, md: 2 },
          width: '100%',
          flexWrap: 'nowrap',
        }}
      >
        {/* Contenedor del Empleado */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Text children='Atiende:' fontWeight={'700'} size={16} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Avatar
              src={appointment.employee.pfp}
              sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}
            />
            <Text
              children={appointment.employee.name}
              size={14}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { xs: '110px', sm: '150px', md: 'none' },
              }}
            />
          </Box>
        </Box>

        {/* Contenedor del Estado */}
        <Box sx={{ flexShrink: 0 }}>
          <SimpleInfoDisplay
            title='Estado: '
            text={appointment.status.name}
            width='fit-content'
            hasIcon={true}
            icon={appointment.status.icon}
            flexDirection={{ xs: 'column', md: 'row' }}
          />
        </Box>
      </Box>

      {/* Datos del Cliente */}
      <Box sx={{ p: { xs: 0, md: 2 }, mt: 2 }}>
        <Title children={'Datos del Cliente'} size={'16'} />
        <Box
          sx={{
            background: (theme) => theme.customGradients.clientDataCard,
            p: 3,
            m: 1,
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Nombre Completo'
                  color='primary.main'
                  size='16'
                  fontWeight='bold'
                />
                <SimpleInfoDisplay title={appointment.client.name} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Edad'
                  color='primary.main'
                  size='16'
                  fontWeight='bold'
                />
                <SimpleInfoDisplay title={appointment.client.age} />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Sexo'
                  color='primary.main'
                  size='16'
                  fontWeight='bold'
                />
                <SimpleInfoDisplay title={appointment.client.gender} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Correo electrónico'
                  color='primary.main'
                  size='16'
                  fontWeight='bold'
                />
                <SimpleInfoDisplay title={appointment.client.mail} />
              </Box>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={{ xs: 2, md: 5 }}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: showCancelButton
                ? 'flex-start'
                : { xs: 'flex-start', md: 'center' },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Text
                  children='Número telefónico'
                  color='primary.main'
                  size='16'
                  fontWeight='bold'
                />
                <SimpleInfoDisplay title={appointment.client.phoneNumber} />
              </Box>
            </Grid>
            {/* Cancelar cita */}
            {showCancelButton && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                  }}
                >
                  <MainButton
                    size={{ xs: '12px', md: '16px' }}
                    onClick={handleOpenCancelDialog}
                  >
                    <CloseIcon /> Cancelar cita
                  </MainButton>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Dialogo */}
        <BaseDialog
          id='cancel-appointment'
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
      </Box>
    </>
  );
};
export default AppointmentBody;
