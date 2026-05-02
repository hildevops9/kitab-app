import { Navigate } from 'react-router-dom'

// Pendaftaran manual dinonaktifkan — semua auth via Google
// Redirect ke login page
export default function RegisterPage() {
  return <Navigate to="/login" replace />
}