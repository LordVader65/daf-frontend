import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', {
    state: () => ({
        token: null,
        clientData: null
    }),

    actions: {
        loadFromStorage() {
            const stored = localStorage.getItem('client')
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    this.token = parsed.token
                    this.clientData = parsed
                } catch (e) {
                    console.error('Error parsing client data from storage', e)
                    localStorage.removeItem('client')
                }
            }
        },

        setSession(data) {
            this.token = data.token
            this.clientData = data
            localStorage.setItem('client', JSON.stringify(data))
        },

        logout() {
            this.token = null
            this.clientData = null
            localStorage.removeItem('client')
            // Opcional: Redirigir o limpiar carrito
        }
    }
})
