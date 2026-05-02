import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const EyeIcon = ({ show }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0906E" strokeWidth="2">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
)

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

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

  // ✅ Fix: GoogleLogin onSuccess sudah benar — kirim credential ke backend
  const handleGoogle = async (credentialResponse) => {
    setError('')
    try {
      const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
      login(res.data.user); navigate('/home')
    } catch {
      setError('Login Google gagal. Coba lagi.')
    }
  }

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── Header image dari Cloudinary ── */}
      <div style={s.heroWrap}>
        <img
          src="https://res.cloudinary.com/dikusbh82/image/upload/v1777625177/1.1_d68obs.png"
          alt="ornamen islami"
          style={s.heroImg}
        />
        {/* Back + Switch nav di atas gambar */}
        <div style={s.topNav}>
          <Link to="/" style={s.backBtn}>← Beranda</Link>
          <Link to="/register" style={s.switchBtn}>Daftar</Link>
        </div>
      </div>

      {/* ── Form body ── */}
      <div style={s.body}>

        {error && <div style={s.errorBox}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          {/* Email */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Email</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0906E" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input name="email" type="email" placeholder="email@contoh.com"
                value={form.email} onChange={handleChange} required
                style={s.input} className="kitab-input"/>
            </div>
          </div>

          {/* Password */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Kata Sandi</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0906E" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input name="password" type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password} onChange={handleChange} required
                style={{ ...s.input, paddingRight: '44px' }} className="kitab-input"/>
              <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                <EyeIcon show={showPass}/>
              </button>
            </div>
          </div>

          {/* Remember + Lupa */}
          <div style={s.rememberRow}>
            <label style={s.checkLabel}>
              <input type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)}/>
              <span style={s.checkText}>Ingat saya</span>
            </label>
            {/* TODO: buat ForgotPasswordPage nanti */}
            <span style={s.forgotLink}
              onClick={() => alert('Fitur lupa kata sandi akan segera hadir.')}>
              Lupa kata sandi?
            </span>
          </div>

          <button type="submit" disabled={loading} style={s.btnPrimary} className="kitab-btn">
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.divLine}/><span style={s.divText}>atau masuk dengan</span><div style={s.divLine}/>
        </div>

        {/* ✅ GoogleLogin dari library — ini yang benar */}
        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Login Google gagal.')}
            shape="rectangular"
            text="signin_with"
            locale="id"
            width="360"
          />
        </div>

        <p style={s.footer}>
          Belum punya akun?{' '}
          <Link to="/register" style={s.link}>Daftar sekarang →</Link>
        </p>
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #FDFAF5; }

  .kitab-input { transition: border-color 0.2s, box-shadow 0.2s !important; }
  .kitab-input:focus {
    border-color: #1C3D2E !important;
    box-shadow: 0 0 0 3px rgba(28,61,46,0.12) !important;
    outline: none !important;
    background: #fff !important;
  }
  .kitab-btn:active { transform: scale(0.99); }
  input[type="checkbox"] { accent-color: #1C3D2E; width:16px; height:16px; cursor:pointer; }
`

const s = {
  root: {
    minHeight: '100dvh', background: '#FDFAF5',
    fontFamily: "'Nunito', sans-serif",
    maxWidth: '430px', margin: '0 auto',
    display: 'flex', flexDirection: 'column',
  },
  // Hero image
  heroWrap: { position: 'relative', width: '100%' },
  heroImg: { width: '100%', display: 'block', objectFit: 'cover' },
  topNav: {
    position: 'absolute', top: 16, left: 0, right: 0,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px', zIndex: 2,
  },
  backBtn: {
    fontSize: '13px', fontWeight: '700',
    color: '#1C3D2E', textDecoration: 'none',
    background: 'rgba(240,230,211,0.85)', borderRadius: '20px',
    padding: '5px 12px', backdropFilter: 'blur(4px)',
  },
  switchBtn: {
    fontSize: '13px', fontWeight: '700', color: '#1C3D2E',
    textDecoration: 'none', padding: '5px 16px',
    border: '1.5px solid rgba(28,61,46,0.3)', borderRadius: '20px',
    background: 'rgba(240,230,211,0.85)', backdropFilter: 'blur(4px)',
  },
  // Body
  body: { padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: '0', background: '#FDFAF5', flex: 1 },
  form: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#1C3D2E' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute', left: '14px', zIndex: 1,
    display: 'flex', alignItems: 'center', pointerEvents: 'none',
  },
  input: {
    width: '100%', padding: '14px 14px 14px 42px',
    borderRadius: '12px', border: '1.5px solid rgba(28,61,46,0.15)',
    fontSize: '15px', background: 'rgba(255,255,255,0.85)',
    color: '#1A1A1A', outline: 'none', WebkitAppearance: 'none',
  },
  eyeBtn: {
    position: 'absolute', right: '14px', background: 'transparent',
    border: 'none', cursor: 'pointer', display: 'flex',
    alignItems: 'center', padding: '4px',
    WebkitTapHighlightColor: 'transparent',
  },
  rememberRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: '2px',
  },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  checkText: { fontSize: '13px', color: '#3A3A3A', fontWeight: '500' },
  forgotLink: {
    fontSize: '13px', color: '#1C3D2E', fontWeight: '600', cursor: 'pointer',
  },
  btnPrimary: {
    marginTop: '4px', padding: '15px', borderRadius: '12px', border: 'none',
    background: '#1C3D2E', color: '#fff', fontWeight: '700', fontSize: '16px',
    cursor: 'pointer', letterSpacing: '0.3px',
    boxShadow: '0 4px 16px rgba(28,61,46,0.3)',
    WebkitTapHighlightColor: 'transparent',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 16px',
  },
  divLine: { flex: 1, height: '1px', background: 'rgba(28,61,46,0.12)' },
  divText: { fontSize: '12px', color: '#A0906E', whiteSpace: 'nowrap', fontWeight: '500' },
  googleWrap: { display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  footer: { textAlign: 'center', fontSize: '13px', color: '#8A7A65' },
  link: { color: '#1C3D2E', fontWeight: '700', textDecoration: 'none' },
}