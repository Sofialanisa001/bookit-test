import axios from 'axios';
import { triggerLogout } from '@/utils/authEvents';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL del backend
  withCredentials: true, // Permite coookies para el refreshToken
  headers: {
    'Content-Type': 'application/json', // Todo lo que se envie sera JSON
  },
});

// Agrega el accessToken a cada peticion automaticamente
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Maneja errores globales del servidor
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config;

    // Si el token expiro, intentamos el refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        // Solicita renovar el token
        await apiClient.post('/auth/refresh');

        // Se reintenta la peticion original
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si falla el refresh, se envia al login
        triggerLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
