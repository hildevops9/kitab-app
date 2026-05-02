import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleGoogle = async (credentialResponse) => {
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
      login(res.data.user)
      navigate('/home')
    } catch {
      setError('Login gagal. Pastikan kamu menggunakan akun Google yang valid.')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Hero image */}
      <div style={s.heroWrap}>
        <img
          src="https://res.cloudinary.com/dikusbh82/image/upload/v1777625177/1.1_d68obs.png"
          alt="ornamen islami"
          style={s.heroImg}
        />
        <div style={s.topNav}>
          <Link to="/" style={s.backBtn}>← Beranda</Link>
        </div>
      </div>

      {/* Body */}
      <div style={s.body}>

        {/* Title */}
        <div style={s.titleWrap}>
          <h1 style={s.title}>Masuk ke Akun</h1>
          <p style={s.subtitle}>Gunakan akun Google kamu untuk masuk</p>
        </div>

        {error && <div style={s.errorBox}>⚠ {error}</div>}

        {/* Google button — satu-satunya cara masuk */}
        <div style={s.googleSection}>
          {loading ? (
            <div style={s.loadingBox}>
              <div style={s.spinner} className="spin-anim"/>
              <span style={s.loadingText}>Menghubungkan...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError('Login Google gagal. Coba lagi.')}
              shape="rectangular"
              text="signin_with"
              locale="id"
              width="360"
              useOneTap
            />
          )}
        </div>

        {/* Info box */}
        <div style={s.infoBox}>
          <div style={s.infoIcon}>🔒</div>
          <div>
            <p style={s.infoTitle}>Login aman dengan Google</p>
            <p style={s.infoDesc}>Kami tidak menyimpan password kamu. Login hanya melalui akun Google yang sudah kamu miliki.</p>
          </div>
        </div>

        <p style={s.footer}>
          Belum punya akun Google?{' '}
          <a href="https://accounts.google.com/signup" target="_blank" rel="noopener noreferrer" style={s.link}>
            Buat akun gratis →
          </a>
        </p>
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #FDFAF5; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-anim { animation: spin 0.8s linear infinite; }
`

const s = {
  root: {
    width: '100%', minHeight: '100dvh', background: '#FDFAF5',
    fontFamily: "'Nunito', sans-serif",
    display: 'flex', flexDirection: 'column',
  },
  heroWrap: { position: 'relative', width: '100%', overflow: 'hidden' },
  heroImg: { width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center' },
  topNav: {
    position: 'absolute', top: 16, left: 0, right: 0,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px', zIndex: 2,
  },
  backBtn: {
    fontSize: '13px', fontWeight: '700', color: '#1C3D2E',
    textDecoration: 'none', background: 'rgba(253,250,245,0.9)',
    borderRadius: '20px', padding: '5px 12px', backdropFilter: 'blur(4px)',
  },
  body: {
    flex: 1, padding: '32px 24px 48px',
    display: 'flex', flexDirection: 'column',
    background: '#FDFAF5',
  },
  titleWrap: { marginBottom: '32px' },
  title: {
    fontFamily: 'Lora, serif', fontSize: '26px', fontWeight: '700',
    color: '#1C3D2E', marginBottom: '6px',
  },
  subtitle: { fontSize: '14px', color: '#8A7A65', lineHeight: 1.5 },
  errorBox: {
    background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
    padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
    fontSize: '13px', fontWeight: '600',
  },
  googleSection: {
    display: 'flex', justifyContent: 'center',
    marginBottom: '28px',
  },
  loadingBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 24px', borderRadius: '12px',
    border: '1.5px solid rgba(28,61,46,0.15)',
    background: '#fff', color: '#1C3D2E',
  },
  spinner: {
    width: '20px', height: '20px',
    border: '2.5px solid #E8E0D0',
    borderTop: '2.5px solid #1C3D2E',
    borderRadius: '50%', flexShrink: 0,
  },
  loadingText: { fontSize: '14px', fontWeight: '600', color: '#1C3D2E' },
  infoBox: {
    display: 'flex', gap: '14px', alignItems: 'flex-start',
    background: 'rgba(28,61,46,0.04)',
    border: '1px solid rgba(28,61,46,0.08)',
    borderRadius: '14px', padding: '16px',
    marginBottom: '28px',
  },
  infoIcon: { fontSize: '22px', flexShrink: 0, marginTop: '1px' },
  infoTitle: { fontSize: '13px', fontWeight: '700', color: '#1C3D2E', marginBottom: '4px' },
  infoDesc: { fontSize: '12px', color: '#8A7A65', lineHeight: 1.6 },
  footer: { textAlign: 'center', fontSize: '13px', color: '#8A7A65', marginTop: 'auto' },
  link: { color: '#1C3D2E', fontWeight: '700', textDecoration: 'none' },
}