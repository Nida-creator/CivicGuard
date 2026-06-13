import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export const analyzeContent = async ({ content, mode, language }) => {
  const response = await api.post('/api/analyze', { content, mode, language })
  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
