import axios from 'axios'

const api = axios.create({
  // baseURL-nya dibikin relative gini aja biar mancing vercel.json beraksi
  baseURL: '/api', 
  withCredentials: true,
})

// Redirect ke /login kalau 401, KECUALI:
// 1. Request dari /auth/me (cek sesi awal — boleh gagal, ditangani AuthContext)
// 2. Sudah di halaman publik (/, /login, /register)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCheck = err.config?.url?.includes('/auth/me')
    const pubPages = ['/', '/login', '/register']
    const isOnPubPage = pubPages.includes(window.location.pathname)

    if (err.response?.status === 401 && !isAuthCheck && !isOnPubPage) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api