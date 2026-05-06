import apiClient from './apiClient';

// Helper para mandar los parametros a los GETs
const buildUrl = (base, mes, anio) => {
  const queryParams = [];
  if (mes) queryParams.push(`mes=${mes}`);
  if (anio) queryParams.push(`año=${anio}`);

  return queryParams.length > 0 ? `${base}?${queryParams.join('&')}` : base;
};

// GET reporte de citas semanales
export const getReporteCitas = async (mes, anio) => {
  try {
    const { data } = await apiClient.get(
      buildUrl('/reportes/citas', mes, anio),
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.msg || 'Error al obtener el reporte de citas.';
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el reporte.';
    }
  }
};

// GET reporte de ingresos
export const getReporteIngresos = async (mes, anio) => {
  try {
    const { data } = await apiClient.get(
      buildUrl('/reportes/ingresos', mes, anio),
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.msg || 'Error al obtener el reporte de ingresos.'
      );
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el reporte.';
    }
  }
};

// GET reporte de servicios populares
export const getReporteServicios = async (mes, anio) => {
  try {
    const { data } = await apiClient.get(
      buildUrl('/reportes/servicios', mes, anio),
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.msg || 'Error al obtener el reporte de servicios.'
      );
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el reporte.';
    }
  }
};

// GET reporte de productividad
export const getReporteProductividad = async (mes, anio) => {
  try {
    const { data } = await apiClient.get(
      buildUrl('/reportes/productividad', mes, anio),
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.msg ||
        'Error al obtener el reporte de productividad.'
      );
    } else if (error.request) {
      throw 'No hay conexión con el servidor.';
    } else {
      throw 'Error inesperado al cargar el reporte.';
    }
  }
};
