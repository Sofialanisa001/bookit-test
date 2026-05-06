// React
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Utils
import { toastNeutral, toastError } from '@/utils/notify';

// APIs
import { getMisCitas, updateCitaStatus } from '@/api/citas.api';
import { getEmpleadosPublicos } from '@/api/empleados.api';
import { getServicios } from '@/api/servicios.api';

// ************** componentes propios :3 **************
// |  common
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import Collapsable from '@/components/common/Collapsable';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';
// |  formulario
import Combobox from '@/components/form/Combobox';
// |  collapsable
import AppointmentHeader from '@/components/collapsable/Header/AppointmentHeader';
import AppointmentBody from '@/components/collapsable/Body/AppointmentBody';

// |  iconos para los estatus
import ClockIcon from '@mui/icons-material/QueryBuilder';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CheckIcon from '@mui/icons-material/CheckRounded';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOutlined';

// Estatus de una cita
const statusAppointment = [
  { name: 'Pendiente', icon: <ClockIcon /> },
  { name: 'Confirmada', icon: <ThumbUpIcon /> },
  { name: 'Realizada', icon: <CheckIcon /> },
  { name: 'Cancelada', icon: <CloseIcon /> },
];

const filterOptions = [
  'Mostrar todas las citas',
  'Pendiente',
  'Confirmada',
  'Realizada',
  'Cancelada',
];
// ****************************

function MyAppointments() {
  // <--------------- ESTADOS --------------->
  const [allAppointments, setAllAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(filterOptions[0]);

  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  // <--------------- DERIVADOS --------------->

  // GET citas, empleados y servicios
  const fetchAppointments = async () => {
    setIsLoading(true);
    setServerError(false);
    try {
      const [citasRes, serviciosRes] = await Promise.all([
        getMisCitas(),
        getServicios(),
      ]);

      if (citasRes.ok && serviciosRes.ok) {
        const citas = citasRes.citas;
        const serviciosLista = serviciosRes.servicios;

        const serviciosUnicosIds = [
          ...new Set(citas.map((cita) => cita.servicioAgendado.servicioId)),
        ];

        const empleadosPromises = serviciosUnicosIds.map((id) =>
          getEmpleadosPublicos(id),
        );
        const empleadosRespuestas = await Promise.all(empleadosPromises);

        let empleadosLista = [];
        empleadosRespuestas.forEach((res) => {
          if (res.ok && res.empleados) {
            empleadosLista = [...empleadosLista, ...res.empleados];
          }
        });

        // Se quita empleado duplicado
        empleadosLista = empleadosLista.filter(
          (emp, index, self) =>
            index === self.findIndex((t) => t._id === emp._id),
        );

        const formattedData = citas.map((cita) => {
          const dateStr = dayjs(cita.fecha.split('T')[0])
            .locale('es')
            .format('MMMM D, YYYY');
          const capitalizedDateStr =
            dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

          let statusIndex = 0;
          if (cita.estado === 'confirmada') statusIndex = 1;
          if (cita.estado === 'realizada') statusIndex = 2;
          if (cita.estado === 'cancelada') statusIndex = 3;

          const empleadoMatch = empleadosLista.find(
            (emp) => emp._id === cita.empleadoId,
          );
          const servicioMatch = serviciosLista.find(
            (srv) => srv._id === cita.servicioAgendado.servicioId,
          );

          return {
            _id: cita._id,
            service: servicioMatch
              ? servicioMatch.nombre
              : cita.servicioAgendado.nombreSnapshot,
            date: `${capitalizedDateStr} de ${cita.horaInicio} a ${cita.horaFin}.`,
            price: cita.servicioAgendado.precioSnapshot,

            rawStatus: cita.estado,
            status: {
              name: cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1),
              icon: statusAppointment[statusIndex]?.icon,
            },

            originalDate: new Date(
              `${cita.fecha.split('T')[0]}T${cita.horaInicio}:00`,
            ),

            employee: {
              name: empleadoMatch ? empleadoMatch.nombre : 'Empleado Asignado',
              pfp: empleadoMatch?.foto?.url || null,
            },

            client: {
              name: cita.datosCliente.nombre,
              age: cita.datosCliente.edad,
              gender:
                cita.datosCliente.sexo.charAt(0).toUpperCase() +
                cita.datosCliente.sexo.slice(1),
              mail: cita.datosCliente.correo,
              phoneNumber: cita.datosCliente.telefono,
            },
            isCanceled: cita.estado === 'cancelada',
          };
        });

        const sortedData = formattedData.sort(
          (a, b) => b.originalDate - a.originalDate,
        );

        setAllAppointments(sortedData);
        setDisplayedAppointments(sortedData);
      }
    } catch (error) {
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Aplicacion del filtro
  useEffect(() => {
    if (currentFilter === 'Mostrar todas las citas') {
      setDisplayedAppointments(allAppointments);
    } else {
      const filtered = allAppointments.filter(
        (app) => app.rawStatus.toLowerCase() === currentFilter.toLowerCase(),
      );
      setDisplayedAppointments(filtered);
    }
  }, [currentFilter, allAppointments]);
  // <--------------- FUNCIONES --------------->

  // PATCH actualizar cita
  // Funcion boton cancelar cita
  const handleCancel = async (appointmentId) => {
    try {
      await updateCitaStatus(appointmentId, 'cancelada');

      const updatedAllAppointments = allAppointments.map((app) => {
        if (app._id === appointmentId) {
          return {
            ...app,
            rawStatus: 'cancelada',
            status: {
              name: 'Cancelada',
              icon: statusAppointment[3].icon,
            },
            isCanceled: true,
          };
        }
        return app;
      });

      setAllAppointments(updatedAllAppointments);

      if (
        currentFilter !== 'Mostrar todas las citas' &&
        currentFilter !== 'Cancelada'
      ) {
        setDisplayedAppointments(
          updatedAllAppointments.filter(
            (app) =>
              app.rawStatus.toLowerCase() === currentFilter.toLowerCase(),
          ),
        );
      } else {
        setDisplayedAppointments(
          updatedAllAppointments.filter(
            (app) =>
              app.rawStatus.toLowerCase() === currentFilter.toLowerCase() ||
              currentFilter === 'Mostrar todas las citas',
          ),
        );
      }

      toastNeutral('La cita ha sido cancelada.', 'cancel-appointment-toast');
    } catch (error) {
      toastError(
        typeof error === 'string' ? error : 'No se pudo cancelar la cita.',
        'cancel-error',
      );
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
        onRetry={fetchAppointments}
        offsetMobile='64px'
        offsetDesktop='64px'
      />
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 2, md: 5 },
        px: { xs: 1, md: 5 },
        width: '95%',
        maxWidth: '1000px',
        mx: 'auto',
      }}
    >
      {/* Seccion superior */}
      <Grid
        container
        sx={{ display: 'flex', alignItems: 'center' }}
        rowSpacing={{ xs: 2, md: 0 }}
      >
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Titulo */}
          <Title
            children='Mis citas'
            color='text.primary'
            align={{ xs: 'center', md: 'start' }}
          />
        </Grid>

        {/* Combobox */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Combobox
            name='Filtrar por estado:'
            array={filterOptions}
            size='14px'
            value={currentFilter}
            onValueChange={(value) => setCurrentFilter(value)}
          />
        </Grid>
      </Grid>

      {/* Linea separadora */}
      <Box
        component='hr'
        sx={{
          border: 'none',
          height: '1px',
          backgroundColor: 'divider',
        }}
      />

      {/* Citas */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 5 }}>
        {displayedAppointments.length === 0 ? (
          // No hay citas
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'secondary.blueShade',
              gap: { xs: 0, md: 2 },
              mx: { xs: 2 },
            }}
          >
            <CloseIcon fontSize='large' />
            <Text size={18} color='secondary.blueShade' align='center'>
              No se encontraron citas
            </Text>
          </Box>
        ) : (
          // Se muestran citas
          displayedAppointments.map((appointment, index) => {
            return (
              <Collapsable
                key={appointment._id}
                headerContent={
                  <AppointmentHeader
                    title={appointment.service}
                    date={appointment.date}
                    price={appointment.price}
                  />
                }
              >
                <AppointmentBody
                  appointment={appointment}
                  onConfirmCancel={() => handleCancel(appointment._id)}
                />
              </Collapsable>
            );
          })
        )}
      </Box>
    </Box>
  );
}

export default MyAppointments;
