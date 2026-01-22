import axios from 'axios'
import { useClientStore } from '../../stores/client.store'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND}ecom`, // Ajustado a 'ecom' para coincidir con rutas backend
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


export const getCart = (page = 1) => {
    return api.get(`/carrito?page=${page}`)
}

export const addToCart = (prd_codigo, cantidad) => {
    return api.post('/carrito/detalle', { prd_codigo, cantidad }) // POST /api/ecom/carrito/detalle
}

export const updateItemQuantity = (prd_codigo, cantidad) => {
    return api.put('/carrito/detalle', { prd_codigo, cantidad }) // PUT /api/ecom/carrito/detalle
}

export const removeCartItem = (prd_codigo) => {
    return api.delete(`/carrito/detalle/${prd_codigo}`) // DELETE /api/ecom/carrito/detalle/:id
}

