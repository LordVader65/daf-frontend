import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

console.log('🔧 Auth Service - VITE_BACKEND:', import.meta.env.VITE_BACKEND)
console.log('🔧 Auth Service - Base URL:', api.defaults.baseURL)

export const loginRequest = (user, password) => {
  console.log('🔧 Auth Service - Login Request:', { user, password })
  console.log('🔧 Auth Service - Full URL:', api.defaults.baseURL + '/login')
  
  return api.post('/login', {
    user,
    password
  }).then(response => {
    console.log('✅ Auth Service - Success:', response.data)
    return response
  }).catch(error => {
    console.log('❌ Auth Service - Error:', error)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Auth Service - Connection refused - Backend not running')
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo.')
    }
    
    if (error.code === 'ENOTFOUND') {
      console.log('❌ Auth Service - Host not found')
      throw new Error('Servidor no encontrado. Verifica la URL del backend.')
    }
    
    if (error.response) {
      console.log('❌ Auth Service - Error Response:', error.response.data)
      console.log('❌ Auth Service - Error Status:', error.response.status)
      throw error
    }
    
    if (error.request) {
      console.log('❌ Auth Service - No response received')
      throw new Error('No se recibió respuesta del servidor. Verifica la conexión.')
    }
    
    console.log('❌ Auth Service - Unknown error')
    throw error
  })
}