import { defineStore } from 'pinia'
import { loginRequest } from '../api/admin/auth.service.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    role: null
  }),

  actions: {
    async login(user, password) {
      const { data } = await loginRequest(user, password)

      this.token = data.token
      this.role = data.role

      sessionStorage.setItem(
        'user',
        JSON.stringify({
          token: data.token,
          role: data.role
        })
      )
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