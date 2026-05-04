import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Baca cache dulu — render langsung tanpa loading
    try {
      const cached = sessionStorage.getItem('kitab_user')
      return cached ? JSON.parse(cached) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifikasi sesi ke server di background
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        sessionStorage.setItem('kitab_user', JSON.stringify(res.data.user))
      })
      .catch(() => {
        setUser(null)
        sessionStorage.removeItem('kitab_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('kitab_user', JSON.stringify(userData))
  }
  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    sessionStorage.removeItem('kitab_user')
    sessionStorage.removeItem('kitab_list')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
} 
 
export const useAuth = () => useContext(AuthContext)