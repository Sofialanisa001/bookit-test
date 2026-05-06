import apiClient from './apiClient';

// GET suspensiones
export const getSuspensiones = async (mes, anio) => {
  try {
    let url = '/suspensiones';
    const queryParams = [];

    if (mes) queryParams.push(`mes=${mes}`);
    if (anio) queryParams.push(`anio=${anio}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener las suspensiones.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar las suspensiones.';
    }
  }
};

// POST crear suspension
export const createSuspension = async (payload) => {
  try {
    const { data } = await apiClient.post('/suspensiones', payload);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al crear la suspensión.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al crear la suspensión.';
    }
  }
};

// DELETE eliminar suspension
export const deleteSuspension = async (id) => {
  try {
    const { data } = await apiClient.delete(`/suspensiones/${id}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al eliminar la suspensión.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al eliminar la suspensión.';
    }
  }
};