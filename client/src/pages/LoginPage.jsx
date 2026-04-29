import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const IslamicPattern = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none"
    style={{ position:'absolute', top:-20, right:-20, opacity:0.12, pointerEvents:'none' }}>
    {/* Outer star 12-point */}
    <g transform="translate(90,90)">
      {Array.from({length:12}).map((_,i) => (
        <polygon key={i}
          points="0,-72 6,-50 20,-62"
          transform={`rotate(${i*30})`}
          fill="#1C3D2E" stroke="#1C3D2E" strokeWidth="0.5"
        />
      ))}
      {/* Inner rings */}
      <circle r="55" stroke="#1C3D2E" strokeWidth="1" fill="none"/>
      <circle r="42" stroke="#C9A84C" strokeWidth="0.8" fill="none"/>
      <circle r="28" stroke="#1C3D2E" strokeWidth="1" fill="none"/>
      {/* Inner star 8-point */}
      {Array.from({length:8}).map((_,i) => (
        <polygon key={i}
          points="0,-28 4,-16 14,-22"
          transform={`rotate(${i*45})`}
          fill="#C9A84C" opacity="0.6"
        />
      ))}
      {/* Geometric lines */}
      {Array.from({length:12}).map((_,i) => (
        <line key={i} x1="0" y1="0" x2="0" y2="-55"
          transform={`rotate(${i*30})`}
          stroke="#1C3D2E" strokeWidth="0.4" opacity="0.5"
        />
      ))}
      <circle r="10" fill="#C9A84C" opacity="0.3"/>
    </g>
  </svg>
)

const IslamicPatternBL = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none"
    style={{ position:'absolute', bottom:-10, left:-10, opacity:0.07, pointerEvents:'none' }}>
    <g transform="translate(60,60)">
      {Array.from({length:8}).map((_,i) => (
        <polygon key={i} points="0,-55 5,-35 18,-48"
          transform={`rotate(${i*45})`} fill="#1C3D2E"/>
      ))}
      <circle r="40" stroke="#C9A84C" strokeWidth="1" fill="none"/>
      <circle r="25" stroke="#1C3D2E" strokeWidth="0.8" fill="none"/>
    </g>
  </svg>
)

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user); navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.')
    } finally { setLoading(false) }
  }

  const handleGoogle = async (credentialResponse) => {
    setError('')
    try {
      const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
      login(res.data.user); navigate('/home')
    } catch { setError('Login Google gagal.') }
  }

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Decorative patterns */}
      <IslamicPattern />
      <IslamicPatternBL />

      {/* Back nav */}
      <div style={s.topNav}>
        <Link to="/" style={s.backBtn}>← Kembali ke Beranda</Link>
        <Link to="/register" style={s.switchBtn}>Daftar</Link>
      </div>

      {/* Content */}
      <div style={s.content}>
        <div style={s.header}>
          <h1 style={s.title}>Masuk Akun</h1>
          <p style={s.subtitle}>Lanjutkan perjalanan belajarmu</p>
        </div>

        {error && (
          <div style={s.errorBox}>⚠ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              name="email" type="email"
              placeholder="email@contoh.com"
              value={form.email} onChange={handleChange} required
              style={s.input} className="auth-input"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              name="password" type="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange} required
              style={s.input} className="auth-input"
            />
          </div>
          <button type="submit" disabled={loading}
            style={{...s.btnPrimary, opacity: loading ? 0.7 : 1}}
            className="btn-primary">
            {loading ? 'Memuat...' : 'Masuk →'}
          </button>
        </form>

        <div style={s.divider}>
          <div style={s.divLine}/>
          <span style={s.divText}>atau masuk dengan</span>
          <div style={s.divLine}/>
        </div>

        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Login Google gagal.')}
            shape="rectangular" text="signin_with" locale="id"
            width={document.body.clientWidth > 480 ? 432 : document.body.clientWidth - 48}
          />
        </div>

        <p style={s.footer}>
          Belum punya akun?{' '}
          <Link to="/register" style={s.link}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { background:#F5EFE4; min-height:100dvh; }

  .auth-input:focus {
    border-color: #1C3D2E !important;
    box-shadow: 0 0 0 3px rgba(28,61,46,0.1) !important;
    outline: none !important;
  }
  .btn-primary:active { transform: scale(0.98); }
`

const s = {
  root: {
    minHeight: '100dvh',
    background: '#F5EFE4',
    fontFamily: "'Nunito', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '480px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    padding: '0 24px 40px',
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '8px',
    position: 'relative',
    zIndex: 2,
  },
  backBtn: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1C3D2E',
    textDecoration: 'none',
    opacity: 0.7,
  },
  switchBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1C3D2E',
    textDecoration: 'none',
    padding: '6px 16px',
    border: '1.5px solid rgba(28,61,46,0.25)',
    borderRadius: '20px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '32px',
    position: 'relative',
    zIndex: 2,
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontFamily: 'Lora, serif',
    fontSize: '34px',
    fontWeight: '700',
    color: '#1C3D2E',
    lineHeight: 1.2,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#8A7A65',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '28px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1C3D2E',
  },
  input: {
    padding: '15px 16px',
    borderRadius: '12px',
    border: '1.5px solid rgba(28,61,46,0.2)',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.7)',
    color: '#1A1A1A',
    outline: 'none',
    width: '100%',
    WebkitAppearance: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btnPrimary: {
    marginTop: '8px',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: '#1C3D2E',
    color: '#F5EFE4',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 0.1s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  divLine: { flex: 1, height: '1px', background: 'rgba(28,61,46,0.15)' },
  divText: {
    fontSize: '12px',
    color: '#A0906E',
    whiteSpace: 'nowrap',
    fontWeight: '600',
  },
  googleWrap: {
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#8A7A65',
  },
  link: {
    color: '#1C3D2E',
    fontWeight: '700',
    textDecoration: 'none',
  },
}