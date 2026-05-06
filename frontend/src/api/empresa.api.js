import apiClient from './apiClient';

// GET empresa
export const getEmpresa = async () => {
  try {
    const { data } = await apiClient.get('/empresa');
    return data;
  } catch (error) {
    // No se encontraron datos de la empresa
    if (error.response) {
      throw (
        error.response.data?.msg || 'Error al obtener los datos de la empresa.'
      );
    }

    // No hay conexion con el servidor
    else if (error.request) {
      throw 'No hay respuesta del servidor. Verifica tu conexión a internet.';
    }

    // Error de react o axios
    else {
      throw 'Ocurrió un error inesperado al consultar la información.';
    }
  }
};

// PATCH actualizar empresa
export const updateEmpresa = async (payload) => {
  try {
    const { data } = await apiClient.patch('/empresa', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al actualizar la empresa.';
    } else if (error.request) {
      throw 'El servidor no responde. No se pudieron guardar los cambios.';
    } else {
      throw 'Error de configuración al intentar actualizar.';
    }
  }
};
