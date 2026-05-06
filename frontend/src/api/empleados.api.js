import apiClient from './apiClient';

// GET empleados
export const getEmpleadosAdmin = async () => {
  try {
    const { data } = await apiClient.get('/empleados/admin');
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener los empleados.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar los empleados.';
    }
  }
};

// GET empleado por ID
export const getEmpleado = async (id) => {
  try {
    const { data } = await apiClient.get(`/empleados/admin/${id}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener la ficha del empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar la ficha del empleado.';
    }
  }
};

// GET estado del empleado
export const getEmpleadoStatus = async (id) => {
  try {
    const { data } = await apiClient.get(`/empleados/admin/${id}/status`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener el estado del empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el estado del empleado.';
    }
  }
};

// GET empleados por servicio
export const getEmpleadosPublicos = async (servicioId) => {
  try {
    const url = servicioId
      ? `/empleados?servicioId=${servicioId}`
      : '/empleados';
    const { data } = await apiClient.get(url);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener los empleados.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar los empleados.';
    }
  }
};

// POST crear empleado
export const createEmpleado = async (payload) => {
  try {
    const { data } = await apiClient.post('/empleados', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al crear el empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al crear el empleado.';
    }
  }
};

// POST activar empleado
export const activateEmpleado = async (id) => {
  try {
    const { data } = await apiClient.post(`/empleados/admin/${id}/activate`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al activar el empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al activar el empleado.';
    }
  }
};

// POST desactivar empleado
export const deactivateEmpleado = async (id) => {
  try {
    const { data } = await apiClient.post(`/empleados/admin/${id}/deactivate`);
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al desactivar el empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al desactivar el empleado.';
    }
  }
};

// PATCH actualizar empleado
export const updateEmpleado = async (id, payload) => {
  try {
    const { data } = await apiClient.patch(`/empleados/admin/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al actualizar el empleado.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al actualizar el empleado.';
    }
  }
};