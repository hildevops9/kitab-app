import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/BottomNav'

export default function BabPage() {
  const { kitabSlug, babSlug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/bab/${kitabSlug}/${babSlug}`)
      .then(res => setData(res.data))
      .catch(() => navigate(`/kitab/${kitabSlug}`))
      .finally(() => setLoading(false))
  }, [kitabSlug, babSlug])

  if (loading) return (
    <div style={s.loadScreen}><div style={s.spinner} className="spin"/></div>
  )

  if (!data) return null

  const { kitab, bab, materis, completedCount } = data
  const barColor = kitab.coverColor || '#1C3D2E'
  const isQuran = kitab.type === 'QURAN'
  const pct = materis.length > 0 ? Math.round((completedCount / materis.length) * 100) : 0

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Header */}
      <div style={{ ...s.header, background: `linear-gradient(160deg,${barColor}F0,${barColor})` }}>
        <button onClick={() => navigate(`/kitab/${kitabSlug}`)} style={s.backBtn}>
          ← {kitab.title}
        </button>
        {bab.arabicTitle && <div style={s.arabicTitle}>{bab.arabicTitle}</div>}
        <h1 style={s.title}>{bab.title}</h1>
        <p style={s.meta}>{materis.length} {isQuran ? 'Ayat' : 'Materi'}</p>

        {/* Progress */}
        <div style={s.progressRow}>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${pct}%` }}/>
          </div>
          <span style={s.progressText}>{completedCount}/{materis.length}</span>
        </div>

        <div style={s.ornRow}>
          <div style={s.ornLine}/><div style={s.diamond}/><div style={s.ornLine}/>
        </div>
      </div>

      {/* Materi list */}
      <div style={s.body}>
        <div style={s.sectionLabel}>
          {isQuran ? 'AYAT' : 'MATERI'} — {materis.length} ITEM
        </div>
        <div style={s.materiList}>
          {materis.map((m, idx) => (
            <div key={m.id} style={s.materiCard}
              onClick={() => navigate(`/materi/${m.id}`)}
              className="materi-card">
              <div style={{
                ...s.numCircle,
                background: m.isCompleted ? barColor : barColor + '18',
                color: m.isCompleted ? '#fff' : barColor,
                border: m.isCompleted ? 'none' : `1.5px solid ${barColor}40`,
              }}>
                {m.isCompleted ? '✓' : String(idx + 1).padStart(2, '0')}
              </div>
              <div style={s.materiInfo}>
                <h3 style={s.materiTitle}>{m.title}</h3>
                {m.content?.arabic && (
                  <p style={s.arabicPreview} dir="rtl">
                    {m.content.arabic.slice(0, 50)}{m.content.arabic.length > 50 ? '...' : ''}
                  </p>
                )}
              </div>
              <span style={{ ...s.arrow, color: barColor }}>›</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="kitab"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  .materi-card:active { background:#F0EBE0 !important; transform:scale(0.98) !important; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .spin { animation:spin 0.8s linear infinite; }
`

const s = {
  root: { width: '100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  loadScreen: { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F5EF' },
  spinner: { width:'32px', height:'32px', border:'3px solid #E8E0D0', borderTop:'3px solid #1C3D2E', borderRadius:'50%' },
  header: { padding:'20px 20px 0', color:'#F5EFE4' },
  backBtn: { background:'none', border:'none', color:'rgba(245,239,228,0.65)', fontSize:'13px', fontWeight:'700', cursor:'pointer', padding:'0', marginBottom:'16px', display:'block', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  arabicTitle: { fontFamily:'serif', fontSize:'26px', color:'rgba(201,168,76,0.9)', letterSpacing:'2px', marginBottom:'6px' },
  title: { fontFamily:'Lora,serif', fontSize:'22px', fontWeight:'700', marginBottom:'4px' },
  meta: { fontSize:'13px', opacity:0.6, marginBottom:'14px' },
  progressRow: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' },
  progressBar: { flex:1, height:'4px', background:'rgba(255,255,255,0.15)', borderRadius:'4px', overflow:'hidden' },
  progressFill: { height:'100%', background:'linear-gradient(90deg,#C9A84C,#E8C97A)', borderRadius:'4px', transition:'width 0.5s' },
  progressText: { fontSize:'11px', fontWeight:'700', color:'#C9A84C', flexShrink:0 },
  ornRow: { display:'flex', alignItems:'center', gap:'8px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0 },
  body: { padding:'20px 16px' },
  sectionLabel: { fontSize:'10px', fontWeight:'700', color:'#A0906E', letterSpacing:'1.5px', marginBottom:'12px' },
  materiList: { display:'flex', flexDirection:'column', gap:'8px' },
  materiCard: { background:'#fff', borderRadius:'14px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.05)', transition:'background 0.15s, transform 0.15s' },
  numCircle: { width:'36px', height:'36px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', flexShrink:0, transition:'all 0.2s' },
  materiInfo: { flex:1, minWidth:0 },
  materiTitle: { fontSize:'14px', fontWeight:'700', color:'#1C3D2E', marginBottom:'3px' },
  arabicPreview: { fontFamily:'serif', fontSize:'13px', color:'#A0906E', lineHeight:1.6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  arrow: { fontSize:'22px', fontWeight:'300', flexShrink:0, opacity:0.5 },
}