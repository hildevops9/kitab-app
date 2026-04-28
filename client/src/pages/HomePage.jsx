import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <span style={s.logoIcon}>📖</span>
            <span style={s.logoText}>Aplikasi Kitab</span>
          </div>
          <div style={s.headerRight}>
            <div style={s.avatar}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="" style={s.avatarImg} />
                : <span>{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>Keluar</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.arabicHero}>بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْم</div>
          <h1 style={s.heroTitle}>Selamat datang, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={s.heroSub}>Pilih kitab dan mulai perjalanan belajarmu hari ini</p>
        </div>
      </div>

      {/* Content placeholder */}
      <div style={s.content}>
        <h2 style={s.sectionTitle}>Kitab Tersedia</h2>
        <div style={s.placeholder}>
          <div style={s.placeholderIcon}>📚</div>
          <p style={s.placeholderText}>Konten kitab akan tersedia setelah admin menambahkan materi</p>
          <span style={s.badge}>Coming — Fase 6</span>
        </div>
      </div>

      {/* Bottom nav */}
      <nav style={s.bottomNav}>
        {[
          { icon: '🏠', label: 'Beranda', active: true },
          { icon: '🔖', label: 'Bookmark', active: false },
          { icon: '💬', label: 'Tanya', active: false },
          { icon: '👤', label: 'Profil', active: false },
        ].map((item) => (
          <div key={item.label} style={{ ...s.navItem, ...(item.active ? s.navItemActive : {}) }}>
            <span style={s.navIcon}>{item.icon}</span>
            <span style={s.navLabel}>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

const s = {
  root: { minHeight: '100dvh', background: '#F8F4ED', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px' },
  header: { background: '#fff', borderBottom: '1px solid #EDE7D9', position: 'sticky', top: 0, zIndex: 100 },
  headerInner: { maxWidth: '640px', margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { fontSize: '20px' },
  logoText: { fontFamily: 'Lora, serif', fontSize: '16px', fontWeight: '700', color: '#1C3D2E' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#2D6A4F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  logoutBtn: { fontSize: '13px', color: '#6B6B6B', background: 'none', border: '1px solid #D9D0C0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' },
  hero: { background: 'linear-gradient(135deg, #1C3D2E 0%, #2D6A4F 100%)', padding: '32px 20px 40px' },
  heroInner: { maxWidth: '640px', margin: '0 auto' },
  arabicHero: { fontFamily: 'serif', fontSize: '18px', color: '#C9A84C', marginBottom: '16px', letterSpacing: '1px' },
  heroTitle: { fontFamily: 'Lora, serif', fontSize: '24px', fontWeight: '700', color: '#F8F4ED', marginBottom: '8px' },
  heroSub: { fontSize: '14px', color: 'rgba(248,244,237,0.7)', lineHeight: 1.6 },
  content: { maxWidth: '640px', margin: '0 auto', padding: '28px 20px' },
  sectionTitle: { fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: '700', color: '#1C3D2E', marginBottom: '16px' },
  placeholder: { background: '#fff', border: '1.5px dashed #D9D0C0', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' },
  placeholderIcon: { fontSize: '40px', marginBottom: '12px' },
  placeholderText: { fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6, marginBottom: '16px' },
  badge: { display: 'inline-block', background: '#EDE7D9', color: '#1C3D2E', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #EDE7D9', display: 'flex', padding: '8px 0 12px', zIndex: 100 },
  navItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', opacity: 0.5, paddingTop: '4px' },
  navItemActive: { opacity: 1 },
  navIcon: { fontSize: '20px' },
  navLabel: { fontSize: '10px', fontWeight: '600', color: '#1C3D2E', letterSpacing: '0.3px' },
}
