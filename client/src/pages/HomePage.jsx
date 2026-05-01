import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'
import BottomNav from '../components/BottomNav'

const TYPE_CONFIG = {
  QURAN:   { label: 'Al-Quran',    bg: '#E8F0EC', color: '#1C3D2E' },
  HIKAM:   { label: 'Kitab Hikam', bg: '#F5ECD9', color: '#5C3A1E' },
  FIQIH:   { label: 'Fiqih',       bg: '#EAE8F5', color: '#3D2E6B' },
  HADITS:  { label: 'Hadits',      bg: '#E8EFF5', color: '#1E3A5C' },
  GENERAL: { label: 'Kitab',       bg: '#F0F0F0', color: '#333' },
}

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [kitabs, setKitabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/kitab').then(r => setKitabs(r.data.kitabs)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const rekomendasi = kitabs.slice(0, 3)
  const lanjutkan = kitabs.filter(k => k.completedCount > 0)

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <p style={s.salam}>Assalamu'alaikum,</p>
            <h1 style={s.name}>{user?.name?.split(' ').slice(0,2).join(' ')} 👋</h1>
            <p style={s.motto}>Semangat belajar hari ini!</p>
          </div>
          <div style={s.avatarWrap}>
            <div style={s.bell}>🔔</div>
            <div style={s.avatar} onClick={() => navigate('/akun')}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="" style={s.avatarImg}/>
                : <span style={s.avatarLetter}>{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
          </div>
        </div>

        {/* Streak card */}
        <div style={s.streakCard}>
          <div>
            <div style={s.streakLabel}>🔥 Streak Belajar</div>
            <div style={s.streakNum}>0 <span style={s.streakUnit}>hari</span></div>
            <div style={s.streakSub}>Pertahankan konsistensimu!</div>
          </div>
          <div style={s.streakChart}>
            {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((d, i) => (
              <div key={d} style={s.chartDay}>
                <div style={{ ...s.chartBar, height: `${20 + Math.random() * 30}px`, opacity: i < 3 ? 1 : 0.3 }}/>
                <span style={s.chartLabel}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.body}>
        {/* Kategori */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>Kategori</span>
          </div>
          <div style={s.kategoriRow}>
            {[
              { label: 'Semua Kitab', icon: '📚' },
              { label: 'Al-Quran',    icon: '🕌' },
              { label: 'Kitab Fiqih', icon: '⚖️' },
              { label: 'Kitab Hadits',icon: '📝' },
              { label: 'Lainnya',     icon: '•••' },
            ].map(k => (
              <div key={k.label} style={s.kategoriItem} onClick={() => navigate('/kitab')}>
                <div style={s.kategoriIcon}>{k.icon}</div>
                <span style={s.kategoriLabel}>{k.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lanjutkan Belajar */}
        {lanjutkan.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionHead}>
              <span style={s.sectionTitle}>Lanjutkan Belajar</span>
              <span style={s.sectionLink} onClick={() => navigate('/kitab')}>Lihat semua ›</span>
            </div>
            {lanjutkan.map(kitab => {
              const cfg = TYPE_CONFIG[kitab.type] || TYPE_CONFIG.GENERAL
              return (
                <div key={kitab.id} style={s.lanjutCard} onClick={() => navigate(`/kitab/${kitab.slug}`)} className="card-press">
                  <div style={{ ...s.lanjutCover, background: kitab.coverColor || '#1C3D2E' }}>
                    <span style={s.lanjutAr}>{kitab.arabicTitle}</span>
                  </div>
                  <div style={s.lanjutInfo}>
                    <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <h3 style={s.lanjutTitle}>{kitab.title}</h3>
                    <p style={s.lanjutSub}>{kitab.author}</p>
                    {kitab.lastRead && <p style={s.lanjutLast}>Terakhir dibaca: {kitab.lastRead}</p>}
                    <div style={s.progressBar}>
                      <div style={{ ...s.progressFill, width: `${kitab.progressPct}%`, background: kitab.coverColor || '#1C3D2E' }}/>
                    </div>
                    <div style={s.lanjutMeta}>
                      <span style={s.lanjutPct}>{kitab.progressPct}%</span>
                      <button style={{ ...s.lanjutBtn, background: kitab.coverColor || '#1C3D2E' }}>▶ Lanjutkan</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Rekomendasi Kitab */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>Rekomendasi Kitab</span>
            <span style={s.sectionLink} onClick={() => navigate('/kitab')}>Lihat semua ›</span>
          </div>
          {loading ? (
            <div style={s.rekRow}>
              {[1,2,3].map(i => <div key={i} style={s.rekSkeleton} className="skeleton"/>)}
            </div>
          ) : (
            <div style={s.rekRow}>
              {rekomendasi.map(kitab => {
                const cfg = TYPE_CONFIG[kitab.type] || TYPE_CONFIG.GENERAL
                return (
                  <div key={kitab.id} style={s.rekCard} onClick={() => navigate(`/kitab/${kitab.slug}`)} className="card-press">
                    <div style={{ ...s.rekCover, background: kitab.coverColor || '#1C3D2E' }}>
                      <span style={s.rekAr}>{kitab.arabicTitle}</span>
                    </div>
                    <span style={{ ...s.badge, background: cfg.bg, color: cfg.color, marginBottom: '4px' }}>{cfg.label}</span>
                    <p style={s.rekTitle}>{kitab.title}</p>
                    <p style={s.rekAuthor}>{kitab.author}</p>
                    <p style={s.rekCta}>Baca sekarang →</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ayat hari ini */}
        <div style={s.ayatCard}>
          <div style={s.ayatAr}>"وَقُل رَّبِّ زِدْنِي عِلْمًا"</div>
          <div style={s.ayatTr}>Ya Tuhanku, tambahkanlah ilmuku</div>
          <div style={s.ayatRef}>QS. Thaha: 114</div>
        </div>
      </div>

      <BottomNav active="home"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  html,body,#root { background:#F8F5EF; }
  .card-press:active { transform: scale(0.97) !important; }
  @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  .skeleton { animation: pulse 1.5s ease-in-out infinite; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  // Header
  header: { background:'linear-gradient(160deg,#0F2318,#1C3D2E)', padding:'20px 20px 24px' },
  headerTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' },
  salam: { fontSize:'13px', color:'rgba(245,239,228,0.65)', marginBottom:'2px' },
  name: { fontFamily:'Lora,serif', fontSize:'22px', fontWeight:'700', color:'#F5EFE4', marginBottom:'2px' },
  motto: { fontSize:'12px', color:'rgba(245,239,228,0.5)' },
  avatarWrap: { display:'flex', alignItems:'center', gap:'10px' },
  bell: { fontSize:'20px', cursor:'pointer' },
  avatar: { width:'40px', height:'40px', borderRadius:'50%', background:'#2D6A4F', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', border:'2px solid rgba(201,168,76,0.4)', cursor:'pointer' },
  avatarImg: { width:'100%', height:'100%', objectFit:'cover' },
  avatarLetter: { fontSize:'16px', fontWeight:'700', color:'#fff' },
  // Streak
  streakCard: { background:'rgba(255,255,255,0.08)', borderRadius:'16px', padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  streakLabel: { fontSize:'13px', fontWeight:'700', color:'rgba(245,239,228,0.8)', marginBottom:'4px' },
  streakNum: { fontFamily:'Lora,serif', fontSize:'32px', fontWeight:'700', color:'#F5EFE4', lineHeight:1 },
  streakUnit: { fontSize:'16px', fontWeight:'400' },
  streakSub: { fontSize:'11px', color:'rgba(245,239,228,0.5)', marginTop:'4px' },
  streakChart: { display:'flex', gap:'6px', alignItems:'flex-end' },
  chartDay: { display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' },
  chartBar: { width:'8px', background:'#C9A84C', borderRadius:'4px', transition:'height 0.3s' },
  chartLabel: { fontSize:'9px', color:'rgba(245,239,228,0.4)', fontWeight:'600' },
  // Body
  body: { padding:'20px 16px' },
  section: { marginBottom:'24px' },
  sectionHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' },
  sectionTitle: { fontSize:'16px', fontWeight:'700', color:'#1C3D2E', fontFamily:'Lora,serif' },
  sectionLink: { fontSize:'12px', color:'#2D6A4F', fontWeight:'700', cursor:'pointer' },
  // Kategori
  kategoriRow: { display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' },
  kategoriItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', cursor:'pointer', flexShrink:0 },
  kategoriIcon: { width:'52px', height:'52px', borderRadius:'14px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  kategoriLabel: { fontSize:'10px', fontWeight:'600', color:'#6B6B6B', textAlign:'center', whiteSpace:'nowrap' },
  // Badge
  badge: { fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', display:'inline-block', letterSpacing:'0.3px' },
  // Lanjutkan
  lanjutCard: { background:'#fff', borderRadius:'16px', padding:'14px', display:'flex', gap:'14px', cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', transition:'transform 0.15s' },
  lanjutCover: { width:'80px', height:'100px', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' },
  lanjutAr: { fontFamily:'serif', fontSize:'14px', color:'rgba(255,255,255,0.6)', textAlign:'center', padding:'4px' },
  lanjutInfo: { flex:1 },
  lanjutTitle: { fontFamily:'Lora,serif', fontSize:'16px', fontWeight:'700', color:'#1C3D2E', margin:'4px 0 2px' },
  lanjutSub: { fontSize:'11px', color:'#A0906E', fontStyle:'italic', marginBottom:'6px' },
  lanjutLast: { fontSize:'11px', color:'#8A7A65', marginBottom:'8px' },
  progressBar: { height:'4px', background:'#EDE7D9', borderRadius:'4px', overflow:'hidden', marginBottom:'6px' },
  progressFill: { height:'100%', borderRadius:'4px', transition:'width 0.5s' },
  lanjutMeta: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  lanjutPct: { fontSize:'12px', fontWeight:'700', color:'#8A7A65' },
  lanjutBtn: { fontSize:'11px', fontWeight:'700', color:'#fff', border:'none', borderRadius:'8px', padding:'6px 12px', cursor:'pointer' },
  // Rekomendasi
  rekRow: { display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'4px' },
  rekCard: { flexShrink:0, width:'130px', cursor:'pointer', display:'flex', flexDirection:'column', transition:'transform 0.15s' },
  rekCover: { width:'130px', height:'160px', borderRadius:'12px', marginBottom:'8px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.15)' },
  rekAr: { fontFamily:'serif', fontSize:'18px', color:'rgba(255,255,255,0.6)', textAlign:'center', padding:'8px' },
  rekTitle: { fontSize:'12px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px', lineHeight:1.3 },
  rekAuthor: { fontSize:'10px', color:'#A0906E', marginBottom:'4px', fontStyle:'italic' },
  rekCta: { fontSize:'10px', fontWeight:'700', color:'#2D6A4F' },
  rekSkeleton: { flexShrink:0, width:'130px', height:'220px', borderRadius:'12px', background:'#E8DFD0' },
  // Ayat
  ayatCard: { background:'linear-gradient(135deg,#1C3D2E,#2D6A4F)', borderRadius:'16px', padding:'20px', textAlign:'center', marginBottom:'8px' },
  ayatAr: { fontFamily:'serif', fontSize:'18px', color:'#C9A84C', letterSpacing:'1px', marginBottom:'8px' },
  ayatTr: { fontSize:'13px', color:'rgba(245,239,228,0.8)', marginBottom:'4px' },
  ayatRef: { fontSize:'11px', color:'rgba(245,239,228,0.5)', fontStyle:'italic' },
}