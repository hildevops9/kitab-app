import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('kitab_user')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        localStorage.setItem('kitab_user', JSON.stringify(res.data.user))
      })
      .catch(() => {
        setUser(null)
        localStorage.removeItem('kitab_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('kitab_user', JSON.stringify(userData))
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    // Bersihkan semua cache saat logout
    Object.keys(localStorage)
      .filter(k => k.startsWith('kitab_'))
      .forEach(k => localStorage.removeItem(k))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
