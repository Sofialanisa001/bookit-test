import apiClient from './apiClient';

// GET servicios
export const getServicios = async () => {
  try {
    const { data } = await apiClient.get('/servicios');
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener los servicios';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar servicios.';
    }
  }
};

// GET servicio por ID 
export const getServicio = async (id) => {
  try {
    const { data } = await apiClient.get(`/servicios/${id}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener los datos del servicio.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el servicio.';
    }
  }
};

// POST crear servicio
export const createServicio = async (payload) => {
  try {
    const { data } = await apiClient.post('/servicios', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al crear el servicio.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al crear el servicio.';
    }
  }
};

// PATCH actualizar servicio
export const updateServicio = async (id, payload) => {
  try {
    const { data } = await apiClient.patch(`/servicios/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al actualizar el servicio.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al actualizar el servicio.';
    }
  }
};

// DELETE eliminar servicio
export const deleteServicio = async (id) => {
  try {
    const { data } = await apiClient.delete(`/servicios/${id}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al eliminar el servicio.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al eliminar el servicio.';
    }
  }
};