import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (credentialResponse) => {
    setError('')
    try {
      const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
      login(res.data.user)
      navigate('/')
    } catch {
      setError('Login Google gagal.')
    }
  }

  return (
    <div style={s.root}>
      {/* Left panel — decorative */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.arabicText}>بِسْمِ اللَّهِ</div>
          <h1 style={s.appName}>Aplikasi Kitab</h1>
          <p style={s.appDesc}>Platform belajar kitab klasik Islam secara modern dan terstruktur</p>
          <div style={s.dots}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ ...s.dot, opacity: 0.2 + (i % 4) * 0.2 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.title}>Masuk Akun</h2>
            <p style={s.subtitle}>Lanjutkan perjalanan belajarmu</p>
          </div>

          {error && (
            <div style={s.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input
                name="email" type="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={handleChange}
                required
                style={s.input}
                onFocus={e => e.target.style.borderColor = '#2D6A4F'}
                onBlur={e => e.target.style.borderColor = '#D9D0C0'}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                name="password" type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={s.input}
                onFocus={e => e.target.style.borderColor = '#2D6A4F'}
                onBlur={e => e.target.style.borderColor = '#D9D0C0'}
              />
            </div>

            <button type="submit" disabled={loading} style={s.btnPrimary}>
              {loading ? 'Memuat...' : 'Masuk →'}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>atau masuk dengan</span>
            <div style={s.divLine} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError('Login Google gagal.')}
              shape="rectangular"
              text="signin_with"
              locale="id"
              width="320"
            />
          </div>

          <p style={s.footer}>
            Belum punya akun?{' '}
            <Link to="/register" style={s.link}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const s = {
  root: {
    display: 'flex',
    minHeight: '100dvh',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  left: {
    display: 'none',
    flex: 1,
    background: 'linear-gradient(160deg, #1C3D2E 0%, #2D6A4F 60%, #1C3D2E 100%)',
    position: 'relative',
    overflow: 'hidden',
    '@media (min-width: 768px)': { display: 'flex' },
  },
  leftInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 50px',
    position: 'relative',
    zIndex: 1,
  },
  arabicText: {
    fontFamily: 'serif',
    fontSize: '42px',
    color: '#C9A84C',
    marginBottom: '24px',
    letterSpacing: '2px',
  },
  appName: {
    fontFamily: 'Lora, serif',
    fontSize: '36px',
    fontWeight: '700',
    color: '#F8F4ED',
    marginBottom: '16px',
    lineHeight: 1.2,
  },
  appDesc: {
    fontSize: '15px',
    color: 'rgba(248,244,237,0.7)',
    lineHeight: 1.7,
    maxWidth: '300px',
  },
  dots: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '48px',
    maxWidth: '160px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#C9A84C',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: '#F8F4ED',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  cardHeader: {
    marginBottom: '32px',
  },
  title: {
    fontFamily: 'Lora, serif',
    fontSize: '28px',
    fontWeight: '700',
    color: '#1C3D2E',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B6B6B',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1C3D2E',
    letterSpacing: '0.3px',
  },
  input: {
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1.5px solid #D9D0C0',
    fontSize: '16px',
    background: '#fff',
    color: '#1A1A1A',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  btnPrimary: {
    marginTop: '4px',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #1C3D2E, #2D6A4F)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  divLine: {
    flex: 1,
    height: '1px',
    background: '#D9D0C0',
  },
  divText: {
    fontSize: '12px',
    color: '#9E9E9E',
    whiteSpace: 'nowrap',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6B6B6B',
    marginTop: '24px',
  },
  link: {
    color: '#2D6A4F',
    fontWeight: '600',
    textDecoration: 'none',
  },
}
