import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ── Geometric pattern SVG ───────────────────────────────────────────────────
const GeometricPattern = ({ opacity = 0.06, color = '#C9A84C' }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', opacity }}>
    <polygon points="60,4 116,32 116,88 60,116 4,88 4,32" stroke={color} strokeWidth="1.5" fill="none" />
    <polygon points="60,18 102,40 102,80 60,102 18,80 18,40" stroke={color} strokeWidth="1" fill="none" />
    <polygon points="60,32 88,48 88,72 60,88 32,72 32,48" stroke={color} strokeWidth="1" fill="none" />
    <line x1="60" y1="4" x2="60" y2="116" stroke={color} strokeWidth="0.5" />
    <line x1="4" y1="32" x2="116" y2="88" stroke={color} strokeWidth="0.5" />
    <line x1="4" y1="88" x2="116" y2="32" stroke={color} strokeWidth="0.5" />
    <circle cx="60" cy="60" r="8" stroke={color} strokeWidth="1" fill="none" />
  </svg>
)

// ── Animated counter hook ──────────────────────────────────────────────────
function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

// ── Feature card data ──────────────────────────────────────────────────────
const features = [
  {
    icon: '📖',
    ar: 'الكتاب',
    title: 'Kitab Digital',
    desc: 'Akses kitab klasik Islam dalam format digital yang rapi, mudah dibaca di mana saja.',
  },
  {
    icon: '🔖',
    ar: 'الباب',
    title: 'Bab & Materi',
    desc: 'Materi tersusun per bab secara sistematis, lengkap dengan teks Arab dan penjelasan.',
  },
  {
    icon: '💬',
    ar: 'السؤال',
    title: 'Tanya Ustadz',
    desc: 'Ajukan pertanyaan, dijawab AI terlebih dahulu. Bisa eskalasi langsung ke ustadz.',
  },
  {
    icon: '📊',
    ar: 'التقدم',
    title: 'Lacak Progress',
    desc: 'Pantau materi yang sudah dibaca, simpan bookmark, dan lanjutkan dari terakhir baca.',
  },
]

// ── Main component ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={s.root} className="page-root">
      {/* ── Navbar ── */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <div style={s.navInner}>
          <div style={s.navBrand}>
            <span style={s.navAr}>الكتاب</span>
            <span style={s.navName}>Kitab App</span>
          </div>
          <div style={s.navLinks}>
            <Link to="/login" style={s.navLogin}>Masuk</Link>
            <Link to="/register" style={s.navRegister}>Daftar Gratis</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        {/* decorative patterns */}
        <div style={{ position: 'absolute', top: 40, left: 40 }}><GeometricPattern opacity={0.12} /></div>
        <div style={{ position: 'absolute', top: 80, right: 60, transform: 'rotate(30deg)' }}><GeometricPattern opacity={0.08} /></div>
        <div style={{ position: 'absolute', bottom: 60, left: '15%', transform: 'rotate(15deg)' }}><GeometricPattern opacity={0.06} /></div>
        <div style={{ position: 'absolute', bottom: 40, right: '10%', transform: 'rotate(-20deg)' }}><GeometricPattern opacity={0.10} /></div>

        {/* bismillah pill */}
        <div style={s.bismillahPill}>
          <span style={s.bismillahAr}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
        </div>

        <h1 style={s.heroTitle}>
          Belajar Kitab Klasik<br />
          <span style={s.heroGold}>Islam, Lebih Mudah.</span>
        </h1>

        <p style={s.heroDesc}>
          Platform digital untuk membaca, memahami, dan mendalami kitab-kitab Islam klasik —
          dilengkapi fitur tanya ustadz, bookmark, dan progress belajar.
        </p>

        <div style={s.heroCta}>
          <Link to="/register" style={s.ctaPrimary}>Mulai Belajar Gratis →</Link>
          <Link to="/login" style={s.ctaSecondary}>Sudah punya akun</Link>
        </div>

        {/* scroll indicator */}
        <div style={s.scrollHint}>
          <div style={s.scrollDot} />
          <span style={s.scrollText}>Scroll untuk lihat fitur</span>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div ref={statsRef} style={s.statsStrip}>
        {[
          { num: '1', suffix: ' Kitab', label: 'Tersedia Sekarang' },
          { num: '100', suffix: '+', label: 'Materi & Bab' },
          { num: '24', suffix: '/7', label: 'Akses Kapan Saja' },
        ].map((st, i) => (
          <div key={i} style={s.statItem}>
            <div style={s.statNum}>
              <span style={{ color: '#C9A84C' }}>{statsInView ? st.num : '0'}</span>
              <span style={{ color: '#F8F4ED', fontSize: '20px' }}>{st.suffix}</span>
            </div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section style={s.features}>
        <div style={s.sectionLabel}>FITUR UTAMA</div>
        <h2 style={s.sectionTitle}>
          Semua yang kamu butuhkan<br />
          <span style={{ color: '#2D6A4F' }}>untuk belajar kitab</span>
        </h2>

        <div style={s.featGrid}>
          {features.map((f, i) => (
            <div key={i} style={s.featCard} className="feat-card">
              <div style={s.featAr}>{f.ar}</div>
              <div style={s.featIcon}>{f.icon}</div>
              <h3 style={s.featTitle}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
              <div style={s.featLine} />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={s.howSection}>
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <GeometricPattern opacity={1} color="#1C3D2E" />
        </div>

        <div style={s.howInner}>
          <div style={s.howLeft}>
            <div style={s.sectionLabel} >CARA KERJA</div>
            <h2 style={{ ...s.sectionTitle, textAlign: 'left', color: '#F8F4ED' }}>
              Tiga langkah<br />
              <span style={{ color: '#C9A84C' }}>untuk memulai</span>
            </h2>
            <p style={{ color: 'rgba(248,244,237,0.65)', fontSize: '15px', lineHeight: 1.8, marginTop: '16px', maxWidth: '320px' }}>
              Mulai perjalanan belajarmu dalam hitungan menit. Tanpa biaya, tanpa kerumitan.
            </p>
          </div>

          <div style={s.howSteps}>
            {[
              { n: '01', title: 'Daftar akun', desc: 'Buat akun gratis atau masuk dengan Google.' },
              { n: '02', title: 'Pilih kitab', desc: 'Pilih kitab yang ingin dipelajari, lalu pilih bab.' },
              { n: '03', title: 'Mulai belajar', desc: 'Baca materi, simpan bookmark, dan tanya ustadz jika ada yang belum jelas.' },
            ].map((step, i) => (
              <div key={i} style={s.stepRow}>
                <div style={s.stepNum}>{step.n}</div>
                <div>
                  <div style={s.stepTitle}>{step.title}</div>
                  <div style={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={s.ctaBanner}>
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-120px)', opacity: 0.07 }}>
          <GeometricPattern opacity={1} />
        </div>
        <div style={s.ctaBannerAr}>اِقْرَأْ</div>
        <h2 style={s.ctaBannerTitle}>Mulai hari ini,<br />gratis selamanya.</h2>
        <p style={s.ctaBannerDesc}>
          Bergabung dan mulai perjalanan belajar kitab klasik Islam.
        </p>
        <Link to="/register" style={s.ctaBannerBtn}>Daftar Sekarang →</Link>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerBrand}>
          <span style={{ ...s.navAr, fontSize: '20px' }}>الكتاب</span>
          <span style={{ ...s.navName, color: '#6B6B6B' }}>Kitab App</span>
        </div>
        <p style={s.footerText}>
          © {new Date().getFullYear()} Kitab App · Dibuat dengan ❤️ untuk umat
        </p>
      </footer>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F4ED; }

        .feat-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 60px rgba(28,61,46,0.12) !important;
          border-color: #C9A84C !important;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  root: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: '#F8F4ED',
    overflowX: 'hidden',
  },

  // Navbar
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: '20px 40px',
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    background: 'rgba(248,244,237,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(201,168,76,0.15)',
    padding: '14px 40px',
    boxShadow: '0 4px 30px rgba(28,61,46,0.06)',
  },
  navInner: {
    maxWidth: '1100px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navAr: {
    fontFamily: 'serif', fontSize: '22px', color: '#C9A84C', letterSpacing: '1px',
  },
  navName: {
    fontFamily: 'Lora, serif', fontSize: '17px', fontWeight: '700', color: '#1C3D2E',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogin: {
    fontSize: '14px', fontWeight: '600', color: '#1C3D2E',
    textDecoration: 'none', padding: '8px 18px',
    borderRadius: '8px', transition: 'background 0.2s',
  },
  navRegister: {
    fontSize: '14px', fontWeight: '600', color: '#F8F4ED',
    textDecoration: 'none', padding: '9px 20px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #1C3D2E, #2D6A4F)',
    boxShadow: '0 4px 16px rgba(28,61,46,0.25)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  // Hero
  hero: {
    minHeight: '100dvh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    padding: '100px 24px 80px',
    position: 'relative',
    background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(45,106,79,0.08) 0%, transparent 70%), #F8F4ED',
  },
  bismillahPill: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '100px',
    padding: '10px 24px',
    marginBottom: '40px',
    animation: 'shimmer 3s ease-in-out infinite',
  },
  bismillahAr: {
    fontFamily: 'serif', fontSize: '18px', color: '#C9A84C', letterSpacing: '2px',
  },
  heroTitle: {
    fontFamily: 'Lora, serif', fontSize: 'clamp(36px, 6vw, 68px)',
    fontWeight: '700', color: '#1C3D2E', lineHeight: 1.15,
    marginBottom: '24px', letterSpacing: '-1px',
    animation: 'fadeUp 0.8s ease forwards',
  },
  heroGold: { color: '#C9A84C', fontStyle: 'italic' },
  heroDesc: {
    fontSize: 'clamp(15px, 2vw, 18px)', color: '#555',
    lineHeight: 1.8, maxWidth: '560px', marginBottom: '48px',
    animation: 'fadeUp 0.8s 0.15s ease forwards', opacity: 0,
  },
  heroCta: {
    display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center',
    animation: 'fadeUp 0.8s 0.3s ease forwards', opacity: 0,
  },
  ctaPrimary: {
    padding: '16px 36px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #1C3D2E, #2D6A4F)',
    color: '#F8F4ED', fontWeight: '700', fontSize: '16px',
    textDecoration: 'none',
    boxShadow: '0 8px 32px rgba(28,61,46,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    letterSpacing: '0.3px',
  },
  ctaSecondary: {
    padding: '16px 28px', borderRadius: '12px',
    border: '1.5px solid rgba(28,61,46,0.2)',
    color: '#1C3D2E', fontWeight: '600', fontSize: '15px',
    textDecoration: 'none', background: 'transparent',
    transition: 'border-color 0.2s, background 0.2s',
  },
  scrollHint: {
    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  scrollDot: {
    width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C',
    animation: 'scrollBounce 1.5s ease-in-out infinite',
  },
  scrollText: { fontSize: '11px', color: '#9E9E9E', letterSpacing: '1px', textTransform: 'uppercase' },

  // Stats
  statsStrip: {
    background: 'linear-gradient(135deg, #1C3D2E 0%, #2D6A4F 100%)',
    padding: '48px 40px',
    display: 'flex', justifyContent: 'center',
    gap: 'clamp(32px, 8vw, 120px)',
    flexWrap: 'wrap',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  statNum: { fontFamily: 'Lora, serif', fontSize: '42px', fontWeight: '700', display: 'flex', alignItems: 'baseline', gap: '2px' },
  statLabel: { fontSize: '13px', color: 'rgba(248,244,237,0.6)', letterSpacing: '0.5px' },

  // Features
  features: {
    padding: 'clamp(60px, 8vw, 100px) 24px',
    maxWidth: '1100px', margin: '0 auto',
    textAlign: 'center',
  },
  sectionLabel: {
    display: 'inline-block',
    fontSize: '11px', fontWeight: '700', letterSpacing: '2px',
    color: '#C9A84C', marginBottom: '16px',
    padding: '6px 14px',
    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px',
  },
  sectionTitle: {
    fontFamily: 'Lora, serif', fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: '700', color: '#1C3D2E', lineHeight: 1.25,
    marginBottom: '48px',
  },
  featGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  featCard: {
    background: '#fff',
    borderRadius: '20px', border: '1.5px solid rgba(217,208,192,0.6)',
    padding: '32px 28px',
    textAlign: 'left', position: 'relative', overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
    cursor: 'default',
  },
  featAr: {
    position: 'absolute', top: '16px', right: '20px',
    fontFamily: 'serif', fontSize: '13px', color: '#C9A84C',
    opacity: 0.5, letterSpacing: '1px',
  },
  featIcon: { fontSize: '32px', marginBottom: '16px' },
  featTitle: {
    fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: '700',
    color: '#1C3D2E', marginBottom: '10px',
  },
  featDesc: { fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7 },
  featLine: {
    position: 'absolute', bottom: 0, left: 0,
    height: '3px', width: '40px',
    background: 'linear-gradient(90deg, #C9A84C, transparent)',
    borderRadius: '0 2px 0 0',
  },

  // How it works
  howSection: {
    background: 'linear-gradient(160deg, #1C3D2E 0%, #0F2318 100%)',
    padding: 'clamp(60px, 8vw, 100px) 40px',
    position: 'relative', overflow: 'hidden',
  },
  howInner: {
    maxWidth: '1000px', margin: '0 auto',
    display: 'flex', gap: '80px',
    flexWrap: 'wrap', alignItems: 'center',
  },
  howLeft: { flex: '1', minWidth: '240px' },
  howSteps: { flex: '1.2', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '32px' },
  stepRow: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  stepNum: {
    fontFamily: 'Lora, serif', fontSize: '28px', fontWeight: '700',
    color: 'rgba(201,168,76,0.3)', minWidth: '40px', lineHeight: 1,
  },
  stepTitle: {
    fontFamily: 'Lora, serif', fontSize: '18px', fontWeight: '700',
    color: '#F8F4ED', marginBottom: '6px',
  },
  stepDesc: { fontSize: '14px', color: 'rgba(248,244,237,0.6)', lineHeight: 1.7 },

  // CTA banner
  ctaBanner: {
    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%), #F8F4ED',
    padding: 'clamp(60px, 8vw, 100px) 24px',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  ctaBannerAr: {
    fontFamily: 'serif', fontSize: '80px', color: '#C9A84C', opacity: 0.1,
    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
    letterSpacing: '4px', pointerEvents: 'none', userSelect: 'none',
  },
  ctaBannerTitle: {
    fontFamily: 'Lora, serif', fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: '700', color: '#1C3D2E', lineHeight: 1.2,
    marginBottom: '20px', position: 'relative',
  },
  ctaBannerDesc: {
    fontSize: '16px', color: '#6B6B6B', lineHeight: 1.7,
    marginBottom: '40px', position: 'relative',
  },
  ctaBannerBtn: {
    display: 'inline-block',
    padding: '18px 48px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #1C3D2E, #2D6A4F)',
    color: '#F8F4ED', fontWeight: '700', fontSize: '16px',
    textDecoration: 'none', letterSpacing: '0.3px',
    boxShadow: '0 12px 40px rgba(28,61,46,0.25)',
    position: 'relative',
  },

  // Footer
  footer: {
    background: '#1C3D2E', padding: '32px 40px',
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'space-between', gap: '16px',
  },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  footerText: { fontSize: '13px', color: 'rgba(248,244,237,0.4)' },
}