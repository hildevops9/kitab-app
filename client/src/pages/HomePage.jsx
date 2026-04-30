import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const typeConfig = {
  QURAN:   { icon: '🕌', badge: 'Al-Quran',  badgeColor: '#1C3D2E' },
  HIKAM:   { icon: '📜', badge: 'Kitab Hikam', badgeColor: '#5C3A1E' },
  GENERAL: { icon: '📖', badge: 'Kitab',       badgeColor: '#2D4A6E' },
}

export default function HomePage() {
  const [kitabs, setKitabs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/kitab')
      .then(res => setKitabs(res.data.kitabs))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <div style={s.headerAr}>الكِتَابُ</div>
            <div style={s.headerSub}>Aplikasi Kitab Islam</div>
          </div>
          <button onClick={logout} style={s.logoutBtn}>Keluar</button>
        </div>
        <div style={s.greeting}>
          Assalamu'alaikum, <span style={s.greetingName}>{user?.name?.split(' ')[0]}</span> 👋
        </div>
        <div style={s.headerOrnament}>
          <div style={s.ornLine}/>
          <div style={s.diamond}/>
          <div style={s.ornLine}/>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={s.body}>
        <div style={s.sectionLabel}>PILIH KITAB</div>
        <h2 style={s.sectionTitle}>Mulai Belajar</h2>
        <p style={s.sectionDesc}>Pilih kitab yang ingin kamu pelajari hari ini.</p>

        {loading ? (
          <div style={s.loadingWrap}>
            {[1,2].map(i => <div key={i} style={s.skeleton} className="skeleton"/>)}
          </div>
        ) : (
          <div style={s.kitabList}>
            {kitabs.map(kitab => {
              const cfg = typeConfig[kitab.type] || typeConfig.GENERAL
              return (
                <button key={kitab.id} style={s.kitabCard}
                  className="kitab-card"
                  onClick={() => navigate(`/kitab/${kitab.slug}`)}>
                  {/* Colored top bar */}
                  <div style={{ ...s.cardBar, background: kitab.coverColor || '#1C3D2E' }}>
                    <span style={s.cardBarAr}>{kitab.arabicTitle}</span>
                    <span style={s.cardIcon}>{cfg.icon}</span>
                  </div>
                  <div style={s.cardBody}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                      <span style={{ ...s.badge, background: (kitab.coverColor||'#1C3D2E')+'22', color: kitab.coverColor||'#1C3D2E' }}>
                        {cfg.badge}
                      </span>
                      <span style={s.babCount}>{kitab._count.babs} Bab</span>
                    </div>
                    <h3 style={s.cardTitle}>{kitab.title}</h3>
                    <p style={s.cardAuthor}>— {kitab.author}</p>
                    <p style={s.cardDesc}>{kitab.description}</p>
                    <div style={s.cardCta}>
                      Baca sekarang <span>→</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Bottom ayat */}
        <div style={s.bottomVerse}>
          <div style={s.ornRow}>
            <div style={s.ornLine}/>
            <div style={s.diamond}/>
            <div style={s.ornLine}/>
          </div>
          <p style={s.verseAr}>"وَقُل رَّبِّ زِدْنِي عِلْمًا"</p>
          <p style={s.verseTr}>Ya Tuhanku, tambahkanlah ilmuku — QS. Thaha: 114</p>
        </div>
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #F5EFE4; }

  .kitab-card:hover, .kitab-card:active {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 40px rgba(28,61,46,0.15) !important;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .skeleton { animation: pulse 1.5s ease-in-out infinite; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F5EFE4', fontFamily:"'Nunito', sans-serif", maxWidth:'480px', margin:'0 auto' },
  // Header
  header: { background:'linear-gradient(160deg, #0F2318 0%, #1C3D2E 100%)', padding:'20px 20px 0', },
  headerTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' },
  headerAr: { fontFamily:'serif', fontSize:'28px', color:'#C9A84C', letterSpacing:'2px' },
  headerSub: { fontSize:'11px', color:'rgba(245,239,228,0.5)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:'2px' },
  logoutBtn: { fontSize:'12px', fontWeight:'700', color:'rgba(245,239,228,0.5)', background:'transparent', border:'1px solid rgba(245,239,228,0.15)', borderRadius:'20px', padding:'6px 14px', cursor:'pointer', WebkitTapHighlightColor:'transparent' },
  greeting: { fontSize:'15px', color:'rgba(245,239,228,0.8)', marginBottom:'20px' },
  greetingName: { color:'#C9A84C', fontWeight:'700' },
  headerOrnament: { display:'flex', alignItems:'center', gap:'8px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' },
  ornRow: { display:'flex', alignItems:'center', gap:'8px', width:'100%' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0, opacity:0.7 },
  // Body
  body: { padding:'28px 20px 40px' },
  sectionLabel: { fontSize:'10px', fontWeight:'700', color:'#C9A84C', letterSpacing:'2px', marginBottom:'6px' },
  sectionTitle: { fontFamily:'Lora, serif', fontSize:'24px', fontWeight:'700', color:'#1C3D2E', marginBottom:'6px' },
  sectionDesc: { fontSize:'14px', color:'#8A7A65', marginBottom:'24px' },
  // Kitab cards
  kitabList: { display:'flex', flexDirection:'column', gap:'16px', marginBottom:'40px' },
  kitabCard: {
    width:'100%', background:'#fff', borderRadius:'16px', border:'none',
    boxShadow:'0 2px 20px rgba(28,61,46,0.08)', cursor:'pointer',
    textAlign:'left', overflow:'hidden', padding:'0',
    transition:'transform 0.2s, box-shadow 0.2s',
    WebkitTapHighlightColor:'transparent',
  },
  cardBar: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'16px 20px',
  },
  cardBarAr: { fontFamily:'serif', fontSize:'20px', color:'rgba(255,255,255,0.8)', letterSpacing:'1px' },
  cardIcon: { fontSize:'28px' },
  cardBody: { padding:'16px 20px 20px' },
  badge: { fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px', letterSpacing:'0.5px' },
  babCount: { fontSize:'12px', color:'#A0906E' },
  cardTitle: { fontFamily:'Lora, serif', fontSize:'20px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px' },
  cardAuthor: { fontSize:'12px', color:'#A0906E', marginBottom:'8px', fontStyle:'italic' },
  cardDesc: { fontSize:'13px', color:'#6B6B6B', lineHeight:1.6, marginBottom:'16px' },
  cardCta: { fontSize:'13px', fontWeight:'700', color:'#2D6A4F', display:'flex', alignItems:'center', gap:'4px' },
  // Loading
  loadingWrap: { display:'flex', flexDirection:'column', gap:'16px' },
  skeleton: { height:'200px', borderRadius:'16px', background:'#E8DFD0' },
  // Bottom verse
  bottomVerse: { display:'flex', flexDirection:'column', alignItems:'center', gap:'10px' },
  verseAr: { fontFamily:'serif', fontSize:'18px', color:'#C9A84C', letterSpacing:'1px', textAlign:'center' },
  verseTr: { fontSize:'11px', color:'#A0906E', textAlign:'center', lineHeight:1.6 },
}