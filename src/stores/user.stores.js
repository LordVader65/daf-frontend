import { defineStore } from 'pinia'
import { loginRequest } from '../api/admin/auth.service.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    role: null
  }),

  actions: {
    async login(user, password) {
      console.log('🔐 User Store - Login attempt:', { user, password })

      try {
        const { data } = await loginRequest(user, password)
        console.log('✅ User Store - Login successful:', data)

        this.token = data.token
        this.role = data.role

        localStorage.setItem(
          'user',
          JSON.stringify({
            token: data.token,
            role: data.role
          })
        )
        
        console.log('💾 User Store - Data saved to localStorage')
      } catch (error) {
        console.log('❌ User Store - Login failed:', error)
        throw error
      }
    },

    loadFromStorage() {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.token = parsed.token
        this.role = parsed.role
      }
    },

    logout() {
      this.token = null
      this.role = null
      localStorage.removeItem('user')
    }
  }
})