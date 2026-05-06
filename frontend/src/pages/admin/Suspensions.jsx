import React, { useState, useEffect } from 'react';

// Utils
import { toastSuccess, toastNeutral, toastError } from '@/utils/notify';

// Dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

// MUI
import Box from '@mui/material/Box';

// API
import {
  getSuspensiones,
  createSuspension,
  deleteSuspension,
} from '@/api/suspensiones.api';
import { getEmpleadosAdmin } from '@/api/empleados.api';

// Componentes propios
import Title from '@/components/common/Title';
import SuspensionForm from '@/components/suspensions/SuspensionForm';
import SuspensionList from '@/components/suspensions/SuspensionList';
import Loader from '@/components/common/Loader';
import ErrorScreen from '@/components/common/ErrorScreen';

const NOMBRES_MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const Suspensions = () => {
  // <--------------- ESTADOS --------------->
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());
  const [tipoSuspension, setTipoSuspension] = useState('horario');
  const [horaInicio, setHoraInicio] = useState('07:00');
  const [horaFin, setHoraFin] = useState('12:00');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('todos');
  const [mesFiltro, setMesFiltro] = useState(NOMBRES_MESES[dayjs().month()]);
  const [anioFiltro, setAnioFiltro] = useState(dayjs().year());
  const [listaSuspensiones, setListaSuspensiones] = useState([]);
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  // <--------------- DATOS DERIVADOS --------------->
  // Carga inicial
  const fetchInitialData = async () => {
    try {
      setIsPageLoading(true);
      setServerError(false);
      const resEmpleados = await getEmpleadosAdmin();

      if (resEmpleados.ok) {
        const empList = [
          { id: 'todos', nombre: 'Todos los empleados' },
          ...resEmpleados.empleados
            .filter((emp) => emp.activo === true)
            .map((emp) => ({
              id: emp._id?.$oid || emp._id,
              nombre: emp.nombre,
            })),
        ];
        setListaEmpleados(empList);
      }
    } catch (error) {
      setServerError(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Carga de la lista de suspensiones
  const fetchSuspensionesList = async () => {
    try {
      setIsListLoading(true);
      const mesesMap = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Septiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
      };
      const numeroMes = mesesMap[mesFiltro] || null;

      const resSuspensiones = await getSuspensiones(numeroMes, anioFiltro);

      if (resSuspensiones.ok) {
        const suspensionesOrdenadas = resSuspensiones.suspensiones.sort(
          (a, b) => {
            const fechaA = new Date(a.fecha?.$date || a.fecha).getTime();
            const fechaB = new Date(b.fecha?.$date || b.fecha).getTime();

            if (fechaA === fechaB) {
              return a.horaInicio.localeCompare(b.horaInicio);
            }

            return fechaA - fechaB;
          },
        );

        const mappedSuspensiones = suspensionesOrdenadas.map((susp) => {
          const fechaString = susp.fecha?.$date || susp.fecha;
          const fechaLocal = fechaString.split('T')[0];

          const fechaCruda = dayjs(fechaLocal).format('dddd D [de] MMMM YYYY');

          const fechaCapitalizada =
            fechaCruda.charAt(0).toUpperCase() + fechaCruda.slice(1);

          let textoBase = susp.todoElDia
            ? `${fechaCapitalizada} (Todo el día)`
            : `${fechaCapitalizada} de ${susp.horaInicio} a ${susp.horaFin}`;

          const empId = susp.empleadoId?.$oid || susp.empleadoId;

          if (empId) {
            const empleadoEncontrado = listaEmpleados.find(
              (emp) => emp.id === empId,
            );

            if (empleadoEncontrado) {
              textoBase += ` - (Solo ${empleadoEncontrado.nombre})`;
            } else {
              textoBase += ` - (Empleado específico)`;
            }
          }

          return {
            id: susp._id?.$oid || susp._id,
            texto: textoBase,
          };
        });

        setListaSuspensiones(mappedSuspensiones);
      }
    } catch (error) {
      setListaSuspensiones([]);
      toastError(
        typeof error === 'string'
          ? error
          : 'Error al cargar las suspensiones de este periodo.',
        'error-lista',
      );
    } finally {
      setIsListLoading(false);
    }
  };

  // <--------------- EFFECTS --------------->
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!isPageLoading && !serverError) {
      fetchSuspensionesList();
    }
  }, [mesFiltro, anioFiltro, isPageLoading]);

  // <--------------- FUNCIONES --------------->
  // POST suspension
  const handleAplicar = async () => {
    try {
      const payload = {
        fecha: fechaSeleccionada.format('YYYY-MM-DD'),
        todoElDia: tipoSuspension === 'todo_dia',
        horaInicio: tipoSuspension === 'todo_dia' ? '00:00' : horaInicio,
        horaFin: tipoSuspension === 'todo_dia' ? '23:59' : horaFin,
        empleadoId:
          empleadoSeleccionado === 'todos' ? null : empleadoSeleccionado,
      };

      // Se llama a la API
      const response = await createSuspension(payload);

      toastSuccess(
        response.msg || 'Suspensión registrada correctamente.',
        'suspension-save-toast',
      );

      // Se resetean los datos
      setTipoSuspension('horario');
      setHoraInicio('07:00');
      setHoraFin('12:00');
      setEmpleadoSeleccionado('todos');

      fetchSuspensionesList();
    } catch (error) {
      let mensajeError = 'Ocurrió un error al crear la suspensión.';

      if (typeof error === 'string') {
        mensajeError = error;
      } else if (typeof error === 'object' && error !== null) {
        const primerCampoError = Object.keys(error)[0];

        if (primerCampoError && error[primerCampoError]?.msg) {
          mensajeError = error[primerCampoError].msg;
        }
      }

      toastError(mensajeError, 'error-create-suspension');
    }
  };

  // DELETE suspension
  const handleEliminarSuspension = async (id) => {
    try {
      const response = await deleteSuspension(id);

      setListaSuspensiones((prev) => prev.filter((susp) => susp.id !== id));

      toastNeutral(
        response.msg || 'La suspensión ha sido eliminada.',
        'suspension-delete-toast',
      );
    } catch (error) {
      toastError(
        typeof error === 'string'
          ? error
          : 'Ocurrió un error al eliminar la suspensión.',
        'error-delete-suspension',
      );
    }
  };

  // <--------------- CONFIG DE UI --------------->

  // Estilos globales de los selects
  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: 'background.serviceChip',
        color: 'white',
        '& .MuiMenuItem-root:hover': {
          backgroundColor: 'rgba(255, 183, 77, 0.2)',
        },
        '& .Mui-selected': {
          backgroundColor: 'rgba(255, 183, 77, 0.4) !important',
        },
      },
    },
  };

  const selectEstilos = {
    backgroundColor: 'background.serviceChip',
    color: 'white',
    borderRadius: '8px',
    height: '45px',
    '& fieldset': { border: 'none' },
    '& .MuiSvgIcon-root': { color: 'primary.light' },
  };

  // <--------------- RENDER --------------->
  if (isPageLoading) {
    return <Loader height='100%' />;
  }

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
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        width: '100%',
        maxWidth: '900px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Title
        children='SUSPENSIÓN DE SERVICIOS'
        size={{ xs: '2rem', md: '2.6rem' }}
        color='white'
        align='center'
      />

      {/* Crear suspension */}
      <SuspensionForm
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        tipoSuspension={tipoSuspension}
        setTipoSuspension={setTipoSuspension}
        horaInicio={horaInicio}
        setHoraInicio={setHoraInicio}
        horaFin={horaFin}
        setHoraFin={setHoraFin}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        empleados={listaEmpleados}
        handleAplicar={handleAplicar}
        selectMenuProps={selectMenuProps}
        selectEstilos={selectEstilos}
      />

      {/* Lista */}
      <SuspensionList
        mesFiltro={mesFiltro}
        setMesFiltro={setMesFiltro}
        anioFiltro={anioFiltro}
        setAnioFiltro={setAnioFiltro}
        isListLoading={isListLoading}
        listaSuspensiones={listaSuspensiones}
        handleEliminarSuspension={handleEliminarSuspension}
        selectMenuProps={selectMenuProps}
        selectEstilos={selectEstilos}
      />
    </Box>
  );
};;

export default Suspensions;
