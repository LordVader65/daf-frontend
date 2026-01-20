import axios from 'axios'
import { obtainToken } from '@/utils/obtain-token'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND
})

api.interceptors.request.use(config => {
    const token = obtainToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const FacturaService = {
    getAll() {
        return api.get('/pos/factura')
    },

    getByCodigo(codigo) {
        return api.get(`/pos/factura/${codigo}`)
    },

    create() {
        return api.post('/pos/factura')
    },

    aprobar(codigo) {
        return api.put(`/pos/factura/${codigo}/aprobar`)
    },

    anular(codigo) {
        return api.put(`/pos/factura/${codigo}/anular`)
    },
    addDetalle(data) {
        return api.post('/pos/factura/detalle', data)
    },
    deleteDetalle(pxfaCodigo) {
        return api.delete(`/pos/factura/detalle/${pxfaCodigo}`)
    },
    updateDetalle(pxfaCodigo, data) {
        return api.put(`/pos/factura/detalle/${pxfaCodigo}`, data)
    },
}

export default FacturaService
