// React
import React, { useState, useEffect } from 'react';

// Constantes
import { ROUTES } from '@/constants/routes';

// MUI
import Box from '@mui/material/Box';

// Iconos
import CalendarIcon from '@mui/icons-material/CalendarMonth';

// Componentes propios
import CalendarBoard from '@/components/appointment/CalendarBoard';
import Title from '@/components/common/Title';
import MainButton from '@/components/common/MainButton';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';

// APIs
import { getEmpresa } from '@/api/empresa.api';
import { getEmpleadosAdmin } from '@/api/empleados.api';

const AppointmentCalendar = () => {
  // <--------------- ESTADOS --------------->
  const [dbEmpresaHorarios, setDbEmpresaHorarios] = useState([]);
  const [dbEmpleados, setDbEmpleados] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  // <--------------- EFFECTS --------------->
  const fetchInitialData = async () => {
    setIsLoading(true);
    setServerError(false);
    try {
      const [empresaRes, empleadosRes] = await Promise.all([
        getEmpresa(),
        getEmpleadosAdmin(),
      ]);

      if (empresaRes.ok) {
        setDbEmpresaHorarios(empresaRes.empresa.horarioGlobal);
      }

      if (empleadosRes.ok) {
        const empleadosActivos = empleadosRes.empleados.filter(
          (emp) => emp.activo === true,
        );

        // Solo activos
        const mapeados = empleadosActivos.map((emp) => ({
          id: emp._id,
          name: emp.nombre,
          foto: emp.foto?.url || null,
          horario: emp.horario || [],
        }));

        setDbEmpleados(mapeados);
      }
    } catch (error) {
      console.error(error);
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // <--------------- RENDER --------------->
  if (isLoading) return <Loader height='100%' />;

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={fetchInitialData}
        offsetMobile='64px'
        offsetDesktop='80px'
      />
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Seccion superior */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          gap: 2,
          mb: 4,
          width: '100%',
          flexGrow: 1,
        }}
      >
        {/* Titulo */}
        <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Title
            size={{ xs: '1.5rem', md: '2.5rem' }}
            textTransform='uppercase'
            color='text.primary'
            align={{ xs: 'center', md: 'left' }}
          >
            Calendario de citas
          </Title>
        </Box>

        {/* Boton agendar cita */}
        <MainButton size={{ xs: '14px', md: '16px' }} to={ROUTES.ADMIN.BOOK}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize='small' />
            Agendar cita
          </Box>
        </MainButton>
      </Box>

      {/* Calendario */}
      <CalendarBoard
        dbEmpresaHorarios={dbEmpresaHorarios}
        dbEmpleados={dbEmpleados}
      />
    </Box>
  );
};

export default AppointmentCalendar;
