import { create } from 'zustand'
import type { User } from '../services/auth.service'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('zionstone_token'),
  isLoading: false,

  setAuth: (user, token) => {
    localStorage.setItem('zionstone_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('zionstone_token')
    set({ user: null, token: null })
  },

  setLoading: (isLoading) => set({ isLoading }),
}))