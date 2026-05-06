import apiClient from './apiClient';

// GET disponibilidad de horarios
export const getDisponibilidad = async (fecha, empleadoId, servicioId) => {
  try {
    const url = `/citas/disponibilidad?fecha=${fecha}&empleadoId=${empleadoId}&servicioId=${servicioId}`;
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al calcular la disponibilidad.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al consultar horarios.';
    }
  }
};

// GET citas del cliente
export const getMisCitas = async () => {
  try {
    const { data } = await apiClient.get('/citas/mis-citas');
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener tus citas.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar las citas.';
    }
  }
};

// GET citas de todos los empleados por fecha
export const getCitasAdmin = async (fecha) => {
  try {
    const url = fecha ? `/citas?fecha=${fecha}` : '/citas';
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener las citas del calendario.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el calendario.';
    }
  }
};

// POST crear cita
export const createCita = async (payload) => {
  try {
    const { data } = await apiClient.post('/citas', payload);
    return data;
  } catch (error) {
    if (error.response) {
      if (typeof error.response.data?.msg === 'object') {
        throw error.response.data.msg; 
      }
      throw error.response.data?.msg || 'Error al agendar la cita.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al crear la cita.';
    }
  }
};

// PATCH actualizar estatus de la cita
export const updateCitaStatus = async (id, status) => {
  try {
    const { data } = await apiClient.patch(`/citas/${id}/status`, { status });
    return data;
  } catch (error) {
    if (error.response) {
      if (typeof error.response.data?.msg === 'object') {
        throw error.response.data.msg; 
      }
      throw error.response.data?.msg || 'Error al actualizar la cita.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al actualizar la cita.';
    }
  }
};