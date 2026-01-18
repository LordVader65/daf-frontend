import axios from 'axios'
import { obtainToken } from '@/utils/obtain-token'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND, // http://localhost:3000/api
})

api.interceptors.request.use(config => {
    const token = obtainToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const ProveedorService = {
    getAll() {
        return api.get('/pos/proveedor')
    },

    getById(id) {
        return api.get(`/pos/proveedor/${id}`)
    },

    create(data) {
        return api.post('/pos/proveedor', data)
    },

    update(id, data) {
        return api.put(`/pos/proveedor/${id}`, data)
    },

    remove(id) {
        return api.delete(`/pos/proveedor/${id}`)
    }
}
