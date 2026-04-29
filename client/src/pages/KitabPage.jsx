import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function KitabPage() {
  const { kitabSlug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/kitab/${kitabSlug}`)
      .then(res => setData(res.data.kitab))
      .catch(() => navigate('/home'))
      .finally(() => setLoading(false))
  }, [kitabSlug])

  if (loading) return <div style={s.center}><p style={s.loadText}>Memuat...</p></div>
  if (!data) return null

  const isQuran = data.type === 'QURAN'
  const barColor = data.coverColor || '#1C3D2E'

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={{ ...s.header, background: `linear-gradient(160deg, ${barColor}ee, ${barColor})` }}>
        <button onClick={() => navigate('/home')} style={s.backBtn}>← Kembali</button>
        <div style={s.headerContent}>
          <div style={s.arabicTitle}>{data.arabicTitle}</div>
          <h1 style={s.title}>{data.title}</h1>
          <p style={s.author}>{data.author}</p>
        </div>
        <div style={s.ornDivider}>
          <div style={s.ornLine}/><div style={s.diamond}/><div style={s.ornLine}/>
        </div>
      </div>

      {/* ── Bab list ── */}
      <div style={s.body}>
        <div style={s.sectionLabel}>{isQuran ? 'DAFTAR SURAH' : 'DAFTAR BAB'}</div>
        <div style={s.babList}>
          {data.babs.map((bab, idx) => (
            <button key={bab.id} style={s.babCard} className="bab-card"
              onClick={() => navigate(`/kitab/${kitabSlug}/${bab.slug}`)}>
              <div style={{ ...s.babNum, background: barColor + '22', color: barColor }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div style={s.babInfo}>
                <div style={s.babTitle}>
                  {bab.title}
                  {bab.arabicTitle && <span style={s.babAr}> · {bab.arabicTitle}</span>}
                </div>
                <div style={s.babMeta}>{bab._count.materis} {isQuran ? 'Ayat' : 'Materi'}</div>
              </div>
              <div style={{ ...s.babArrow, color: barColor }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { background:#F5EFE4; }
  .bab-card:hover, .bab-card:active { background: #f0e8d8 !important; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F5EFE4', fontFamily:"'Nunito',sans-serif", maxWidth:'480px', margin:'0 auto' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100dvh' },
  loadText: { color:'#8A7A65', fontSize:'14px' },
  header: { padding:'20px 20px 0', color:'#F5EFE4' },
  backBtn: { fontSize:'13px', fontWeight:'700', color:'rgba(245,239,228,0.7)', background:'transparent', border:'none', cursor:'pointer', padding:'0', marginBottom:'20px', WebkitTapHighlightColor:'transparent' },
  headerContent: { marginBottom:'20px' },
  arabicTitle: { fontFamily:'serif', fontSize:'32px', color:'rgba(201,168,76,0.9)', letterSpacing:'2px', marginBottom:'8px' },
  title: { fontFamily:'Lora,serif', fontSize:'24px', fontWeight:'700', marginBottom:'4px' },
  author: { fontSize:'13px', opacity:0.6, fontStyle:'italic' },
  ornDivider: { display:'flex', alignItems:'center', gap:'8px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0 },
  body: { padding:'24px 20px 40px' },
  sectionLabel: { fontSize:'10px', fontWeight:'700', color:'#C9A84C', letterSpacing:'2px', marginBottom:'14px' },
  babList: { display:'flex', flexDirection:'column', gap:'8px' },
  babCard: { width:'100%', display:'flex', alignItems:'center', gap:'14px', background:'#fff', borderRadius:'12px', border:'none', padding:'14px 16px', cursor:'pointer', textAlign:'left', boxShadow:'0 1px 8px rgba(28,61,46,0.06)', transition:'background 0.15s', WebkitTapHighlightColor:'transparent' },
  babNum: { width:'36px', height:'36px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', flexShrink:0 },
  babInfo: { flex:1 },
  babTitle: { fontSize:'14px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px' },
  babAr: { fontFamily:'serif', fontWeight:'400', color:'#8A7A65', fontSize:'13px' },
  babMeta: { fontSize:'12px', color:'#A0906E' },
  babArrow: { fontSize:'22px', fontWeight:'300', flexShrink:0 },
}