import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PublicRoute({ children, redirectTo = '/home' }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
      <p style={{ color: '#888', fontSize: '14px' }}>Memuat...</p>
    </div>
  )

  if (user) return <Navigate to={redirectTo} replace />
  return children
}