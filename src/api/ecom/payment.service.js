import axios from 'axios'
import { useClientStore } from '../../stores/client.store'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND}ecom/pagos`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
    const clientStore = useClientStore()
    if (!clientStore.token) {
        clientStore.loadFromStorage()
    }

    if (clientStore.token) {
        config.headers.Authorization = `Bearer ${clientStore.token}`
    }
    return config
})

export const checkout = (card_number) => {
    return api.post('/checkout', { card_number })
}

export const validateCard = (card_number) => {
    return api.post('/validate', { card_number })
}
