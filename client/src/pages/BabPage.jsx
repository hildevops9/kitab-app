import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function BabPage() {
  const { kitabSlug, babSlug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/bab/${kitabSlug}/${babSlug}`)
      .then(res => setData(res.data))
      .catch(() => navigate(`/kitab/${kitabSlug}`))
      .finally(() => setLoading(false))
  }, [kitabSlug, babSlug])

  if (loading) return <div style={s.center}><p style={s.loadText}>Memuat...</p></div>
  if (!data) return null

  const { kitab, bab } = data
  const barColor = kitab.type === 'HIKAM' ? '#5C3A1E' : '#1C3D2E'
  const isQuran = kitab.type === 'QURAN'

  return (
    <div style={s.root}>
      <style>{css}</style>

      <div style={{ ...s.header, background:`linear-gradient(160deg,${barColor}f0,${barColor})` }}>
        <button onClick={() => navigate(`/kitab/${kitabSlug}`)} style={s.backBtn}>
          ← {kitab.title}
        </button>
        <div style={s.arabicTitle}>{bab.arabicTitle}</div>
        <h1 style={s.title}>{bab.title}</h1>
        <p style={s.meta}>{bab.materis.length} {isQuran ? 'Materi' : 'Materi'}</p>
        <div style={s.ornDivider}>
          <div style={s.ornLine}/><div style={s.diamond}/><div style={s.ornLine}/>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.sectionLabel}>{isQuran ? 'MATERI' : 'MATERI BAB INI'}</div>
        <div style={s.materiList}>
          {bab.materis.map((m, idx) => (
            <button key={m.id} style={s.materiCard} className="materi-card"
              onClick={() => navigate(`/materi/${m.id}`)}>
              <div style={{ ...s.materiNum, background: barColor+'22', color: barColor }}>
                {String(idx+1).padStart(2,'0')}
              </div>
              <div style={s.materiInfo}>
                <div style={s.materiTitle}>{m.title}</div>
              </div>
              <div style={{ ...s.arrow, color: barColor }}>›</div>
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
  .materi-card:hover, .materi-card:active { background: #f0e8d8 !important; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F5EFE4', fontFamily:"'Nunito',sans-serif", maxWidth:'480px', margin:'0 auto' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100dvh' },
  loadText: { color:'#8A7A65', fontSize:'14px' },
  header: { padding:'20px 20px 0', color:'#F5EFE4' },
  backBtn: { fontSize:'13px', fontWeight:'700', color:'rgba(245,239,228,0.7)', background:'transparent', border:'none', cursor:'pointer', marginBottom:'20px', padding:'0', WebkitTapHighlightColor:'transparent' },
  arabicTitle: { fontFamily:'serif', fontSize:'28px', color:'rgba(201,168,76,0.9)', letterSpacing:'2px', marginBottom:'6px' },
  title: { fontFamily:'Lora,serif', fontSize:'22px', fontWeight:'700', marginBottom:'4px' },
  meta: { fontSize:'13px', opacity:0.6, marginBottom:'20px' },
  ornDivider: { display:'flex', alignItems:'center', gap:'8px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0 },
  body: { padding:'24px 20px 40px' },
  sectionLabel: { fontSize:'10px', fontWeight:'700', color:'#C9A84C', letterSpacing:'2px', marginBottom:'14px' },
  materiList: { display:'flex', flexDirection:'column', gap:'8px' },
  materiCard: { width:'100%', display:'flex', alignItems:'center', gap:'14px', background:'#fff', borderRadius:'12px', border:'none', padding:'14px 16px', cursor:'pointer', textAlign:'left', boxShadow:'0 1px 8px rgba(28,61,46,0.06)', transition:'background 0.15s', WebkitTapHighlightColor:'transparent' },
  materiNum: { width:'36px', height:'36px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', flexShrink:0 },
  materiInfo: { flex:1 },
  materiTitle: { fontSize:'14px', fontWeight:'600', color:'#1C3D2E' },
  arrow: { fontSize:'22px', fontWeight:'300', flexShrink:0 },
}