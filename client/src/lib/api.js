import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCheck = err.config?.url?.includes('/auth/me')
    const pubPages = ['/', '/login', '/register']
    const isOnPubPage = pubPages.includes(window.location.pathname)
    const isGuest = localStorage.getItem('guest') === 'true'

    if (err.response?.status === 401 && !isAuthCheck && !isOnPubPage && !isGuest) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api