import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
})

export const loginRequest = (user, password) => {
  return api.post('/login', {
    user,
    password
  })
}