import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});
// Interceptor de Petición: Se ejecuta antes de cada llamada a la API.
// Su trabajo es tomar el token del localStorage y añadirlo a las cabeceras.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Si el token existe, lo añadimos a la cabecera 'Authorization'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
