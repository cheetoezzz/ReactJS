import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export function loginRequest(email, password) {
  return api.post('/api/login', { email, password }).then((r) => r.data)
}
