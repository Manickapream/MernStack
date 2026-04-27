import axios from 'axios'

// In production (Render), use the full backend URL from env variable
// In development, Vite proxy handles /api/ requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const role = sessionStorage.getItem('user_role')
  if (role) {
    config.headers['X-User-Role'] = role
  }
  return config
})

export default api
