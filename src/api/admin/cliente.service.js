import axios from 'axios'
import { obtainToken } from '@/utils/obtain-token'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND
})

api.interceptors.request.use((config) => {
    const token = obtainToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default {
    getAll() {
        return api.get('/pos/cliente')
    }
}
