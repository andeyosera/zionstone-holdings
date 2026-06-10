import api from './api'

export interface User {
  id: string
  name: string
  email: string
  role: 'GUEST' | 'HOST' | 'ADMIN'
  avatarUrl: string | null
  phone: string | null
  isVerified: boolean
}

export const authService = {
  register: async (name: string, email: string, password: string, role?: string) => {
    const { data } = await api.post('/auth/register', { name, email, password, role })
    return data.data as { user: User; token: string }
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data.data as { user: User; token: string }
  },

  me: async () => {
    const { data } = await api.get('/auth/me')
    return data.data as User
  },
}