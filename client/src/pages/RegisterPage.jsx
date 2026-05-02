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

export default function RegisterPage() {
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [agree, setAgree]       = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agree) { setError('Harap setujui syarat & ketentuan terlebih dahulu.'); return }
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.user); navigate('/home')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.')
    } finally { setLoading(false) }
  }

  // ✅ Google juga bisa dipakai untuk register — backend handle upsert
  const handleGoogle = async (credentialResponse) => {
    setError('')
    try {
      const res = await api.post('/auth/google', { idToken: credentialResponse.credential })
      login(res.data.user); navigate('/home')
    } catch {
      setError('Login Google gagal. Coba lagi.')
    }
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 4 ? 1
    : form.password.length < 8 ? 2
    : form.password.length < 12 ? 3 : 4

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'][strength]
  const strengthColor = ['', '#EF4444', '#C9A84C', '#2D6A4F', '#1C3D2E'][strength]

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
        <div style={s.topNav}>
          <Link to="/" style={s.backBtn}>← Beranda</Link>
          <Link to="/login" style={s.switchBtn}>Masuk</Link>
        </div>
      </div>

      {/* ── Form body ── */}
      <div style={s.body}>

        {error && <div style={s.errorBox}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          {/* Nama */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Nama Lengkap</label>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0906E" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input name="name" type="text" placeholder="Nama Lengkap"
                value={form.name} onChange={handleChange} required
                style={s.input} className="kitab-input"/>
            </div>
          </div>

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
                placeholder="Minimal 8 karakter"
                value={form.password} onChange={handleChange} required
                style={{ ...s.input, paddingRight: '44px' }} className="kitab-input"/>
              <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                <EyeIcon show={showPass}/>
              </button>
            </div>
            {/* Strength bar */}
            {form.password.length > 0 && (
              <div style={s.strengthWrap}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    ...s.strengthBar,
                    background: i <= strength ? strengthColor : 'rgba(28,61,46,0.1)',
                  }}/>
                ))}
                <span style={{ ...s.strengthText, color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Agree */}
          <label style={s.checkLabel}>
            <input type="checkbox" checked={agree}
              onChange={e => setAgree(e.target.checked)}/>
            <span style={s.checkText}>
              Saya setuju
            </span>
          </label>

          <button type="submit" disabled={loading || !agree}
            style={{ ...s.btnPrimary, opacity: (!agree || loading) ? 0.55 : 1 }}
            className="kitab-btn">
            {loading ? 'Membuat akun...' : 'Daftar Sekarang →'}
          </button>
        </form>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.divLine}/><span style={s.divText}>atau daftar dengan</span><div style={s.divLine}/>
        </div>

        {/* ✅ GoogleLogin dari library */}
        <div style={s.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Login Google gagal.')}
            shape="rectangular"
            text="signup_with"
            locale="id"
            width="360"
          />
        </div>

        <p style={s.footer}>
          Sudah punya akun?{' '}
          <Link to="/login" style={s.link}>Masuk sekarang →</Link>
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
  input[type="checkbox"] { accent-color: #1C3D2E; width:16px; height:16px; cursor:pointer; flex-shrink:0; }
`

const s = {
  root: {
    minHeight: '100dvh', background: '#FDFAF5',
    fontFamily: "'Nunito', sans-serif",
    maxWidth: '430px', margin: '0 auto',
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
    textDecoration: 'none', background: 'rgba(240,230,211,0.88)',
    borderRadius: '20px', padding: '5px 12px', backdropFilter: 'blur(4px)',
  },
  switchBtn: {
    fontSize: '13px', fontWeight: '700', color: '#1C3D2E',
    textDecoration: 'none', padding: '5px 16px',
    border: '1.5px solid rgba(28,61,46,0.3)', borderRadius: '20px',
    background: 'rgba(240,230,211,0.88)', backdropFilter: 'blur(4px)',
  },
  body: { padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', background: '#F7F4EF', flex: 1 },
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
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
    padding: '4px', WebkitTapHighlightColor: 'transparent',
  },
  strengthWrap: {
    display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px',
  },
  strengthBar: {
    flex: 1, height: '3px', borderRadius: '2px', transition: 'background 0.3s',
  },
  strengthText: {
    fontSize: '11px', whiteSpace: 'nowrap', marginLeft: '4px', fontWeight: '600',
  },
  checkLabel: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    cursor: 'pointer', marginTop: '2px',
  },
  checkText: { fontSize: '12px', color: '#3A3A3A', lineHeight: 1.5 },
  termsLink: { color: '#1C3D2E', fontWeight: '700', cursor: 'pointer' },
  btnPrimary: {
    marginTop: '4px', padding: '15px', borderRadius: '12px', border: 'none',
    background: '#1C3D2E', color: '#fff', fontWeight: '700', fontSize: '16px',
    cursor: 'pointer', letterSpacing: '0.3px',
    boxShadow: '0 4px 16px rgba(28,61,46,0.3)',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 0.1s, opacity 0.2s',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 16px' },
  divLine: { flex: 1, height: '1px', background: 'rgba(28,61,46,0.12)' },
  divText: { fontSize: '12px', color: '#A0906E', whiteSpace: 'nowrap', fontWeight: '500' },
  googleWrap: { display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  footer: { textAlign: 'center', fontSize: '13px', color: '#8A7A65' },
  link: { color: '#1C3D2E', fontWeight: '700', textDecoration: 'none' },
}