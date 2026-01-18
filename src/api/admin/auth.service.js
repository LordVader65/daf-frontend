import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, // http://localhost:3000/api/
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 Auth Service - VITE_BACKEND:', import.meta.env.VITE_BACKEND);
console.log('🔧 Auth Service - Base URL:', api.defaults.baseURL);

/**
 * LOGIN E-COMMERCE (ADMIN / CLIENTES)
 * Backend: POST /api/ecom/auth/login
 */
export const loginRequest = (user, password) => {
  console.log('🔧 Auth Service - Login Request:', { user, password });
  console.log(
    '🔧 Auth Service - Full URL:',
    api.defaults.baseURL + 'ecom/auth/login'
  );

  return api
    .post('ecom/auth/login', {
      email: user,
      password,
    })
    .then((response) => {
      console.log('✅ Auth Service - Success:', response.data);
      return response;
    })
    .catch((error) => {
      console.log('❌ Auth Service - Error:', error);

      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'No se puede conectar al servidor. Verifica que el backend esté corriendo.'
        );
      }

      if (error.code === 'ENOTFOUND') {
        throw new Error(
          'Servidor no encontrado. Verifica la URL del backend.'
        );
      }

      if (error.response) {
        console.log('❌ Auth Service - Error Response:', error.response.data);
        console.log('❌ Auth Service - Error Status:', error.response.status);
        throw error;
      }

      if (error.request) {
        throw new Error(
          'No se recibió respuesta del servidor. Verifica la conexión.'
        );
      }

      throw error;
    });
};
