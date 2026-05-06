import React, { useState } from 'react';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Icono
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import AdvertismentIcon from '@mui/icons-material/ReportProblemOutlined';

// Componentes propios
import Text from '@/components/common/Text';
import SimpleInfoDisplay from '@/components/common/SimpleInfoDisplay';
import MainButton from '@/components/common/MainButton';
import BaseDialog from '@/components/common/BaseDialog';

const EmployeeBody = ({ employee, onEdit, onToggleEstado, listaServicios }) => {
  // <--------------- CONTEXTO --------------->
  const theme = useTheme();

  // <--------------- ESTADOS --------------->
  const [isToggling, setIsToggling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // <--------------- DERIVADO --------------->
  const nombresServicios = employee.servicios
    ?.map((id) => listaServicios.find((s) => s._id === id)?.nombre)
    .filter((nombre) => nombre);

  // <--------------- FUNCIONES --------------->
  // Abre el dialogo
  const handleToggleEstado = () => {
    if (isToggling) return;

    if (employee.activo) {
      setIsDialogOpen(true);
    } else {
      executeToggle();
    }
  };

  // Cerrar dialogo
  const handleCloseDialog = (hasAccepted) => {
    setIsDialogOpen(false);
    if (hasAccepted) {
      executeToggle();
    }
  };

  // Funcion que llama a la API
  const executeToggle = async () => {
    setIsToggling(true);
    await onToggleEstado(employee._id, employee.activo);
    setIsToggling(false);
  };

  // <--------------- RENDER --------------->
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}
    >
      {/* Fecha de nacimiento y telefono */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Text
              children='Fecha de nacimiento'
              color='primary.main'
              size='16px'
              align='center'
            />
            <SimpleInfoDisplay
              title={
                employee.fechaNacimiento
                  ? new Date(employee.fechaNacimiento).toLocaleDateString(
                      'es-MX',
                      { timeZone: 'UTC' },
                    )
                  : 'No especificada'
              }
              titleColor='white'
              titleSize={{ xs: '16px', md: '16px' }}
              align='center'
              border='none'
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Text
              children='Número telefónico'
              color='primary.main'
              size='16px'
              align='center'
            />
            <SimpleInfoDisplay
              title={employee.telefono || 'No especificado'}
              titleColor='white'
              titleSize={{ xs: '16px', md: '16px' }}
              align='center'
              border='none'
            />
          </Box>
        </Grid>
      </Grid>

      {/* Informacion y horarios */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Text
              children='Información'
              color='primary.main'
              size='16px'
              align='center'
            />
            <Box
              sx={{
                background: (theme) => theme.customGradients.searchBar,
                borderRadius: '16px',
                p: 3,
                width: '100%',
                height: '100%',
                minHeight: '170px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                children={employee.informacion || 'Sin información adicional.'}
                color='white'
                size='14px'
                align='center'
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              height: '100%',
            }}
          >
            <Text
              children='Horarios'
              color='primary.main'
              size='16px'
              align='center'
            />
            <Box
              sx={{
                background: (theme) => theme.customGradients.searchBar,
                borderRadius: '16px',
                p: 3,
                width: '100%',
                height: '100%',
                minHeight: '170px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {employee.horario && employee.horario.length > 0 ? (
                employee.horario.map((turno) => {
                  const diaCapitalizado =
                    turno.dia.charAt(0).toUpperCase() + turno.dia.slice(1);
                  return (
                    <Text
                      key={turno._id}
                      children={`${diaCapitalizado}: ${turno.horaInicio} - ${turno.horaFin}`}
                      color='white'
                      size='14px'
                      align='center'
                    />
                  );
                })
              ) : (
                <Text
                  children='No tiene horario registrado'
                  size='14px'
                  align='center'
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Servicios */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          width: '100%',
        }}
      >
        <Text
          children='Servicios'
          color='primary.main'
          size='16px'
          align='center'
        />
        <Box
          sx={{
            background: (theme) => theme.customGradients.searchBar,
            borderRadius: '16px',
            p: 2,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text
            children={
              nombresServicios?.length > 0
                ? nombresServicios.join(' • ')
                : 'Ningún servicio asignado'
            }
            color='white'
            size='14px'
            align='center'
          />
        </Box>
      </Box>

      {/* Botones */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          gap: 4,
          mt: 2,
        }}
      >
        {/* Boton editar */}
        {employee.activo && (
          <MainButton
            size={{ xs: '14px', md: '16px' }}
            onClick={() => onEdit(employee)}
            sx={{
              backgroundColor: 'primary.light',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <EditIcon fontSize='small' /> Editar información
          </MainButton>
        )}

        {/* Boton estado */}
        <MainButton
          size={{ xs: '14px', md: '16px' }}
          onClick={handleToggleEstado}
          disabled={isToggling}
          sx={{
            backgroundColor: isToggling
              ? 'action.disabledBackground'
              : 'primary.light',
            color: isToggling ? 'action.disabled' : 'primary.contrastText',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            cursor: isToggling ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <SyncIcon
            fontSize='small'
            sx={{
              animation: isToggling ? 'spin 2s linear infinite' : 'none',
              '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } },
            }}
          />
          {isToggling ? 'Cambiando' : 'Cambiar estado'}
        </MainButton>
      </Box>

      {/* Dialogo */}
      <BaseDialog
        id='toggle-employee-dialog'
        open={isDialogOpen}
        onClose={handleCloseDialog}
        title={'Advertencia'}
        fontSizeContent={18}
        icon={<AdvertismentIcon />}
        content={
          <>
            Al desactivar a este empleado, su horario será eliminado, se le
            desasignarán los servicios y{' '}
            <b>todas sus citas pendientes serán canceladas.</b>
            <br />
            <br />
            ¿Desea continuar?
          </>
        }
      />
    </Box>
  );
};

export default EmployeeBody;
