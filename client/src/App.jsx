import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import UpdatePrompt from './components/UpdatePrompt'
// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import KitabListPage from './pages/KitabListPage'
import KitabPage from './pages/KitabPage'
import BabPage from './pages/BabPage'
import MateriPage from './pages/MateriPage'
import BookmarkPage from './pages/BookmarkPage'
import { CatatanPage } from './pages/CatatanPage'
import AkunPage from './pages/AkunPage'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute redirectTo="/home"><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute redirectTo="/home"><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            {/* Protected */}
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/kitab" element={<ProtectedRoute><KitabListPage /></ProtectedRoute>} />
            <Route path="/kitab/:kitabSlug" element={<ProtectedRoute><KitabPage /></ProtectedRoute>} />
            <Route path="/kitab/:kitabSlug/:babSlug" element={<ProtectedRoute><BabPage /></ProtectedRoute>} />
            <Route path="/materi/:materiId" element={<ProtectedRoute><MateriPage /></ProtectedRoute>} />
            <Route path="/bookmark" element={<ProtectedRoute><BookmarkPage /></ProtectedRoute>} />
            <Route path="/catatan" element={<ProtectedRoute><CatatanPage /></ProtectedRoute>} />
            <Route path="/akun" element={<ProtectedRoute><AkunPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <UpdatePrompt />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}