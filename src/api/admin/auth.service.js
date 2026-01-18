import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND}pos`,

  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

export const loginRequest = (user, password) => {

  return api.post('/login', {
    user,
    password
  }).then(response => {
    return response
  }).catch(error => {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo.')
    }

    if (error.code === 'ENOTFOUND') {
      throw new Error('Servidor no encontrado. Verifica la URL del backend.')
    }

    if (error.response) {
      throw error
    }

    if (error.request) {
      throw new Error('No se recibió respuesta del servidor. Verifica la conexión.')
    }
    throw error
  })
}