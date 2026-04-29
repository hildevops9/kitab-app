import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import KitabPage from './pages/KitabPage'
import BabPage from './pages/BabPage'
import MateriPage from './pages/MateriPage'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute redirectTo="/home"><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute redirectTo="/home"><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute redirectTo="/home"><RegisterPage /></PublicRoute>} />

            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/kitab/:kitabSlug" element={<ProtectedRoute><KitabPage /></ProtectedRoute>} />
            <Route path="/kitab/:kitabSlug/:babSlug" element={<ProtectedRoute><BabPage /></ProtectedRoute>} />
            <Route path="/materi/:materiId" element={<ProtectedRoute><MateriPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}