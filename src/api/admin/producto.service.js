import axios from 'axios'
import { obtainToken } from '@/utils/obtain-token'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND, // ej: http://localhost:3000/api
})

api.interceptors.request.use(config => {
    const token = obtainToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const ProductoService = {
    // Listar productos activos para combo
    getAll() {
        return api.get('/pos/producto')
    },

    // Obtener un producto por código (precio, etc.)
    getByCodigo(codigo) {
        return api.get(`/pos/producto/${codigo}`)
    }
}
