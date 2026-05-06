import React, { useState, useEffect } from 'react';

// API
import { getServicios, getServicio, deleteServicio } from '@/api/servicios.api';

// Utils
import { toastNeutral, toastError } from '@/utils/notify';

// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Iconos
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

// Componentes propios
import Title from '@/components/common/Title';
import Text from '@/components/common/Text';
import MainButton from '@/components/common/MainButton';
import Collapsable from '@/components/common/Collapsable';
import ServiceHeader from '@/components/collapsable/Header/ServiceHeader';
import ServiceBody from '@/components/collapsable/Body/ServiceBody';
import ServiceForm from '@/components/services/ServiceForm';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';

const Services = () => {
  // <--------------- ESTADOS --------------->
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [servicioEditando, setServicioEditando] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [serverError, setServerError] = useState(false);

  // <--------------- DATOS DERIVADOS --------------->
  const fetchServicios = async () => {
    try {
      setIsLoadingData(true);
      setServerError(false);
      setBusqueda('');
      const data = await getServicios();
      if (data.ok) {
        setServicios(data.servicios);
      }
    } catch (error) {
      setServerError(true);
      setServicios([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  // <--------------- EFFECTS --------------->

  // Scroll hasta arriba al cambiar de ver servicios/agregar o editar
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [servicioEditando]);

  // GET servicios
  useEffect(() => {
    fetchServicios();
  }, []);

  // <--------------- DERIVADO --------------->
  // Buscar servicio
  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  // <--------------- FUNCIONES --------------->

  // GET servicio
  // Funcion para editar un servicio
  const handleEdit = async (servicioSeleccionado) => {
    try {
      setIsLoadingData(true);

      // Se llama a la api
      const data = await getServicio(servicioSeleccionado._id);

      if (data.ok) {
        setServicioEditando(data.servicio);
      }
    } catch (error) {
      toastError(
        typeof error === 'string'
          ? error
          : 'Error al cargar los datos del servicio.',
        'get-servicio-id',
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  // Funcion para regresar a ver servicios y que carguen
  const handleCloseForm = (shouldRefresh = false) => {
    setServicioEditando(null);
    if (shouldRefresh) {
      fetchServicios(); // Se vuelven a pedir los datos al servidor
    }
  };

  // DELETE servicio
  // Funcion eliminar servicio
  const handleDelete = async (id) => {
    try {
      setIsLoadingData(true);

      // Se llama a la api
      const response = await deleteServicio(id);

      toastNeutral(
        response.msg || 'Servicio eliminado del catálogo.',
        'service-delete-toast',
      );

      // Se piden de nuevo los servicios
      await fetchServicios();
    } catch (error) {
      toastError(
        typeof error === 'string'
          ? error
          : 'Error al intentar eliminar el servicio.',
        'delete-service-error',
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  // <--------------- RENDER --------------->
  if (isLoadingData) return <Loader height='100%' />;

  if (serverError) {
    return (
      <ErrorScreen
        onRetry={fetchServicios}
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
      {/* Vista datos servicio / Vista lista servicios */}
      {servicioEditando ? (
        // Vista datos servicio
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
            {/* Boton regreso */}
            <IconButton
              onClick={() => handleCloseForm(true)}
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
                  servicioEditando.id === 'nuevo'
                    ? 'Agregar servicio'
                    : 'Editar servicio'
                }
                size={{ xs: '1.8rem', md: '2.2rem' }}
                color='white'
                align='center'
              />
            </Box>

            <Box sx={{ width: 40, flexShrink: 0 }} />
          </Box>

          {/* Formulario */}
          <Box sx={{ mt: 5 }}>
            <ServiceForm
              service={servicioEditando}
              isEditing={servicioEditando._id !== undefined}
              onCancel={() => handleCloseForm(true)}
              onSave={() => handleCloseForm(true)}
            />
          </Box>
        </Box>
      ) : (
        // Vista de la lista de servicios
        <Box>
          {/* Titulo y boton agregar servicio */}
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
                children='Gestión de servicios'
                size={{ xs: '1.8rem', md: '2.5rem' }}
                color='white'
                align={{ xs: 'center', md: 'left' }}
              />
            </Box>

            {/* Agregar servicio */}
            {!serverError && (
              <MainButton
                size={{ xs: '14px', md: '16px' }}
                onClick={() => setServicioEditando({ id: 'nuevo' })}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddIcon fontSize='small' /> Agregar servicio
                </Box>
              </MainButton>
            )}
          </Box>

          {/* Buscar servicio */}
          <TextField
            fullWidth
            placeholder='Busca un servicio por su nombre'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{
              mb: 4,
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
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Lista de servicios */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {servicios.length === 0 ? (
              // No existen servicios en la base de datos
              <Text
                children='No tienes servicios registrados.'
                color='text.disabled'
                align='center'
              />
            ) : serviciosFiltrados.length > 0 ? (
              // Hay servicios y coinciden con la busqueda
              serviciosFiltrados.map((servicio) => (
                <Collapsable
                  key={servicio._id}
                  headerContent={<ServiceHeader service={servicio} />}
                >
                  <ServiceBody
                    service={servicio}
                    onEdit={handleEdit}
                    onDeleteConfirm={() => handleDelete(servicio._id)}
                  />
                </Collapsable>
              ))
            ) : (
              //Hay servicios pero ninguno coincide con la busqueda
              <Text
                children='No se encontraron servicios con ese nombre.'
                color='text.disabled'
                align='center'
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Services;
