// React
import React, { useState, useEffect } from 'react';

// API
import {
  getEmpleadosAdmin,
  createEmpleado,
  getEmpleado,
  updateEmpleado,
  activateEmpleado,
  deactivateEmpleado,
  getEmpleadoStatus,
} from '@/api/empleados.api';
import { getServicios } from '@/api/servicios.api';
import { getEmpresa } from '@/api/empresa.api';

// Utils
import { toastSuccess, toastError, toastNeutral } from '@/utils/notify';

// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Componentes propios
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';
import Collapsable from '@/components/common/Collapsable';
import EmployeeHeader from '@/components/collapsable/Header/EmployeeHeader';
import EmployeeBody from '@/components/collapsable/Body/EmployeeBody';
import EmployeeForm from '@/components/employees/EmployeeForm';
import Loader from '@/components/common/Loader';
import Combobox from '@/components/form/Combobox';
import ErrorScreen from '@/components/common/ErrorScreen';

const Employees = () => {
  // <--------------- ESTADOS --------------->
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [listaServicios, setListaServicios] = useState([]);
  const [empresaHorario, setEmpresaHorario] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [serverError, setServerError] = useState(false);

  // <--------------- DERIVADOS --------------->
  // GET empleados
  const fetchEmpleados = async () => {
    try {
      setIsLoadingData(true);
      setServerError(false);
      setBusqueda('');

      const [empleadosData, serviciosData, empresaData] = await Promise.all([
        getEmpleadosAdmin(),
        getServicios(),
        getEmpresa(),
      ]);

      if (empleadosData.ok) setEmpleados(empleadosData.empleados);
      if (serviciosData.ok) setListaServicios(serviciosData.servicios);
      if (empresaData.empresa)
        setEmpresaHorario(empresaData.empresa.horarioGlobal || []);
    } catch (error) {
      setServerError(true);
      setEmpleados([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Busqueda de empleado
  const empleadosFiltrados = empleados.filter((emp) => {
    const coincideBusqueda = emp.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    let coincideEstado = true;
    if (filtroEstado === 'Activos') {
      coincideEstado = emp.activo === true;
    } else if (filtroEstado === 'Inactivos') {
      coincideEstado = emp.activo === false;
    }

    return coincideBusqueda && coincideEstado;
  });

  // <--------------- EFFECTS --------------->
  // GET Empleados al cargar la página
  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Scroll hacia arriba al cambiar de lista/datos empleado
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [empleadoEditando]);

  // <--------------- FUNCIONES --------------->

  // Boton regresar a la lista de empleados
  const handleCloseForm = () => {
    setEmpleadoEditando(null);
    fetchEmpleados(); // Pedimos de nuevo los empleados
  };

  // Abrir formulario (Agregar/Editar)
  const handleOpenForm = async (empleadoObj) => {
    try {
      setIsLoadingData(true);

      const isNew = empleadoObj.id === 'nuevo';

      // Se pasa la información más reciente de servicios y empresa
      const [serviciosData, empresaData] = await Promise.all([
        getServicios(),
        getEmpresa(),
      ]);

      if (serviciosData.ok) setListaServicios(serviciosData.servicios);
      if (empresaData.empresa) {
        setEmpresaHorario(empresaData.empresa.horarioGlobal || []);
      }

      // Si es editar, se trae los datos del empleado
      if (!isNew) {
        // GET empleado
        const data = await getEmpleado(empleadoObj._id);

        if (data.ok && data.empleado) {
          setEmpleadoEditando(data.empleado);
        } else {
          throw 'No se pudo obtener la información completa del empleado.';
        }
      } else {
        setEmpleadoEditando(empleadoObj);
      }
    } catch (error) {
      toastError(
        typeof error === 'string'
          ? error
          : 'Error al obtener los datos actualizados del servidor.',
        'fetch-fresh-data',
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  // POST/PATCH empleado
  // Funcion guardar empleado
  const handleSaveEmployee = async (employeeData) => {
    const isNew = employeeData.id === 'nuevo';

    const formData = new FormData();
    formData.append('nombre', employeeData.name);
    formData.append('correo', employeeData.email);
    formData.append('telefono', employeeData.phone);
    formData.append('fechaNacimiento', employeeData.birthdate);
    formData.append('informacion', employeeData.info);

    // Solo adjuntamos la foto si el usuario cargo una nueva
    if (employeeData.archivoFisico) {
      formData.append('foto', employeeData.archivoFisico);
    }

    // Pasa los nombres de los servicios a ID
    const serviciosIds = employeeData.services
      .map((nombreServicio) => {
        const serv = listaServicios.find((s) => s.nombre === nombreServicio);
        return serv ? serv._id : null;
      })
      .filter((id) => id !== null);

    formData.append('servicios', JSON.stringify(serviciosIds));

    // Formatea el horario
    const diasReverseMap = {
      Domingo: 'domingo',
      Lunes: 'lunes',
      Martes: 'martes',
      Miércoles: 'miercoles',
      Jueves: 'jueves',
      Viernes: 'viernes',
      Sábado: 'sabado',
    };

    const timeToMins = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const minsToTime = (mins) => {
      const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const horarioFinal = [];

    for (const [dia, bloques] of Object.entries(employeeData.scheduleMap)) {
      if (!bloques || bloques.length === 0) continue;

      let minInicioGlobal = Infinity;
      let maxFinGlobal = -Infinity;

      // Recorre todos los bloques del día para encontrar el punto más temprano y el más tardío
      bloques.forEach((b) => {
        const [start, end] = b.split('-');
        const startMins = timeToMins(start);
        const endMins = timeToMins(end);

        if (startMins < minInicioGlobal) minInicioGlobal = startMins;
        if (endMins > maxFinGlobal) maxFinGlobal = endMins;
      });

      horarioFinal.push({
        dia: diasReverseMap[dia],
        horaInicio: minsToTime(minInicioGlobal),
        horaFin: minsToTime(maxFinGlobal),
      });
    }

    formData.append('horario', JSON.stringify(horarioFinal));

    let response;
    if (isNew) {
      // POST empleado
      response = await createEmpleado(formData);
    } else {
      // PATCH empleado
      response = await updateEmpleado(employeeData._id, formData);
    }

    toastSuccess(
      response.msg ||
        `Empleado ${isNew ? 'agregado' : 'actualizado'} correctamente.`,
      'employee-save-toast',
    );

    handleCloseForm();
  };

  // Cambiar estado del empleado
  const handleToggleEstado = async (empleadoId, estadoActualEnUI) => {
    try {
      // GET estado del empleado
      const statusData = await getEmpleadoStatus(empleadoId);
      const estadoReal = statusData.activo;

      // Se compara el estado real con lo que el usuario ve en pantalla
      if (estadoReal === false && estadoActualEnUI === true) {
        // El usuario intentaba desactivarlo, pero alguien más ya lo hizo
        toastNeutral(
          'El empleado ya había sido desactivado previamente.',
          'toggle-estado',
        );
        fetchEmpleados(); 
        return; 
      }

      if (estadoReal === true && estadoActualEnUI === false) {
        // El usuario intentaba activarlo, pero alguien más ya lo hizo
        toastSuccess(
          'El empleado ya había sido activado previamente.',
          'toggle-estado',
        );
        fetchEmpleados(); 
        return;
      }

      let response;
      if (estadoReal) {
        // Si está activo, lo desactivamos
        response = await deactivateEmpleado(empleadoId);
        toastNeutral(response.msg || 'Empleado desactivado.', 'toggle-estado');
      } else {
        // Si está inactivo, lo activamos
        response = await activateEmpleado(empleadoId);
        toastSuccess(response.msg || 'Empleado activado.', 'toggle-estado');
      }

      fetchEmpleados();
    } catch (error) {
      toastError(
        typeof error === 'string' ? error : 'Error al cambiar el estado.',
        'toggle-estado-error',
      );
    }
  };

  // <--------------- RENDER --------------->
  if (isLoadingData) return <Loader height='100%' />;

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={fetchEmpleados}
        offsetMobile='64px'
        offsetDesktop='80px'
      />
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '1000px',
        mx: 'auto',
      }}
    >
      {/* Vista datos empleado / Vista lista empleado */}
      {empleadoEditando ? (
        // Agregar / Editar empleado
        <Box>
          {/* Boton de regreso y titulo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              pb: 2,
            }}
          >
            {/* Flecha */}
            <IconButton
              onClick={handleCloseForm}
              sx={{
                color: 'white',
                backgroundColor: 'background.hoverLighter',
                '&:hover': { backgroundColor: 'background.hoverLight' },
                width: 40,
                height: 40,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            {/* Titulo */}
            <Box
              sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
            >
              <Title
                children={
                  empleadoEditando.id === 'nuevo'
                    ? 'Agregar empleado'
                    : 'Editar empleado'
                }
                size={{ xs: '1.8rem', md: '2.2rem' }}
                color='white'
                align='center'
              />
            </Box>

            <Box sx={{ width: 40, flexShrink: 0 }} />
          </Box>

          {/* Componente del formulario */}
          <EmployeeForm
            employee={empleadoEditando}
            empresaHorario={empresaHorario}
            listaServicios={listaServicios}
            onCancel={handleCloseForm}
            onSave={handleSaveEmployee}
          />
        </Box>
      ) : (
        // Lista de empleados
        <Box>
          {/* Titulo y boton agregar empleado */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'center' },
              gap: 2,
              mb: 4,
              width: '100%',
            }}
          >
            {/* Titulo */}
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Title
                children='Gestión de empleados'
                size={{ xs: '1.8rem', md: '2.2rem' }}
                color='white'
                align={{ xs: 'center', md: 'left' }}
              />
            </Box>
            {/* Boton agregar empleado */}
            {!serverError && (
              <MainButton
                size={{ xs: '14px', md: '16px' }}
                onClick={() => handleOpenForm({ id: 'nuevo' })}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAddIcon fontSize='small' />
                  Agregar empleado
                </Box>
              </MainButton>
            )}
          </Box>

          {/* Barra de busqueda y Filtros */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 4,
            }}
          >
            {/* Buscar empleado */}
            <TextField
              fullWidth
              placeholder='Busca un empleado por su nombre'
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  background: (theme) => theme.customGradients.searchBar,
                  borderRadius: '50px',
                  fontFamily: "'Montserrat', sans-serif",
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Combobox de Estado */}
            <Box sx={{ minWidth: { xs: '100%', md: '200px' } }}>
              <Combobox
                name='Estado'
                array={['Todos', 'Activos', 'Inactivos']}
                defaultValue='Todos'
                onValueChange={(val) => setFiltroEstado(val)}
              />
            </Box>
          </Box>

          {/* Lista de Empleados */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {empleados.length === 0 ? (
              <Text
                children='No tienes empleados registrados.'
                color='text.disabled'
                align='center'
              />
            ) : empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((empleado) => (
                <Collapsable
                  key={empleado._id}
                  headerContent={<EmployeeHeader employee={empleado} />}
                >
                  <EmployeeBody
                    employee={empleado}
                    onEdit={handleOpenForm}
                    onToggleEstado={handleToggleEstado}
                    listaServicios={listaServicios}
                  />
                </Collapsable>
              ))
            ) : (
              <Text
                children='No se encontraron empleados con ese nombre.'
                color='rgba(255,255,255,0.5)'
                align='center'
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};;;;

export default Employees;
