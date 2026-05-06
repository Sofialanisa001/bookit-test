import apiClient from './apiClient';

// GET perfil del usuario
export const getPerfil = async () => {
  try {
    const { data } = await apiClient.get('/usuarios/perfil');
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener el perfil.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el perfil.';
    }
  }
};

// PATCH actualizar perfil del usuario
export const updatePerfil = async (payload) => {
  try {
    const { data } = await apiClient.patch('/usuarios/perfil', payload);
    return data;
  } catch (error) {
    if (error.response) {
      if (typeof error.response.data?.msg === 'object') {
        throw error.response.data.msg; 
      }
      throw error.response.data?.msg || 'Error al actualizar el perfil.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al actualizar el perfil.';
    }
  }
};