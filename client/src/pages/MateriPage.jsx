import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

// ── Renderer: Al-Quran ──────────────────────────────────────────────────────
const QuranContent = ({ content }) => (
  <div style={r.quranWrap}>
    <div style={r.surahLabel}>
      Surah {content.surahName} ({content.surahNumber})
    </div>
    {content.ayat?.map((a) => (
      <div key={a.number} style={r.ayatBlock}>
        <div style={r.ayatNum}>{a.number}</div>
        <div style={r.arabicText}>{a.arabic}</div>
        <div style={r.translation}>{a.translation}</div>
      </div>
    ))}
  </div>
)

// ── Renderer: Al-Hikam ──────────────────────────────────────────────────────
const HikamContent = ({ content }) => (
  <div style={r.hikamWrap}>
    <div style={r.hikamNum}>Hikam ke-{content.number}</div>
    <div style={r.hikamArabic}>{content.arabic}</div>
    <div style={r.hikamDivider}>
      <div style={r.dLine}/><div style={r.dDiamond}/><div style={r.dLine}/>
    </div>
    <div style={r.hikamTransLabel}>Terjemahan</div>
    <p style={r.hikamTrans}>{content.translation}</p>
    {content.explanation && (
      <>
        <div style={r.hikamDivider}>
          <div style={r.dLine}/><div style={r.dDiamond}/><div style={r.dLine}/>
        </div>
        <div style={r.hikamTransLabel}>Penjelasan</div>
        <p style={r.hikamExplain}>{content.explanation}</p>
      </>
    )}
  </div>
)

// ── Main component ──────────────────────────────────────────────────────────
export default function MateriPage() {
  const { materiId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.get(`/materi/${materiId}`)
      .then(res => setData(res.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false))
  }, [materiId])

  const handleComplete = async () => {
    if (data?.isCompleted || completing) return
    setCompleting(true)
    try {
      await api.post(`/materi/${materiId}/complete`)
      setData(prev => ({ ...prev, isCompleted: true }))
    } catch(e) { console.error(e) }
    finally { setCompleting(false) }
  }

  if (loading) return <div style={s.center}><p style={s.loadText}>Memuat...</p></div>
  if (!data) return null

  const { materi, prev, next, isCompleted } = data
  const { bab } = materi
  const kitab = bab.kitab
  const barColor = kitab.type === 'HIKAM' ? '#5C3A1E' : '#1C3D2E'
  const content = materi.content

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={{ ...s.header, background: `linear-gradient(160deg, ${barColor}f0, ${barColor})` }}>
        <div style={s.headerNav}>
          <button onClick={() => navigate(`/kitab/${kitab.slug}/${bab.slug}`)} style={s.backBtn}>
            ← {bab.title}
          </button>
          <span style={s.kitabLabel}>{kitab.title}</span>
        </div>
        <h1 style={s.title}>{materi.title}</h1>
        {isCompleted && <div style={s.completedBadge}>✓ Selesai dibaca</div>}
      </div>

      {/* ── Content ── */}
      <div style={s.body}>
        {content.type === 'quran' && <QuranContent content={content} />}
        {content.type === 'hikam' && <HikamContent content={content} />}
      </div>

      {/* ── Actions ── */}
      <div style={s.actions}>
        {!isCompleted ? (
          <button onClick={handleComplete} disabled={completing} style={s.completeBtn}>
            {completing ? 'Menyimpan...' : '✓ Tandai Selesai'}
          </button>
        ) : (
          <div style={s.completedBox}>✓ Sudah kamu baca</div>
        )}

        {/* Prev / Next navigation */}
        <div style={s.navBtns}>
          {prev ? (
            <button onClick={() => navigate(`/materi/${prev.id}`)} style={s.navBtn}>
              ← Sebelumnya
            </button>
          ) : <div/>}
          {next && (
            <button onClick={() => navigate(`/materi/${next.id}`)} style={s.navBtnNext}>
              Selanjutnya →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Renderer styles ─────────────────────────────────────────────────────────
const r = {
  // Quran
  quranWrap: { display:'flex', flexDirection:'column', gap:'0' },
  surahLabel: { fontSize:'12px', fontWeight:'700', color:'#C9A84C', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'20px' },
  ayatBlock: { borderBottom:'1px solid rgba(201,168,76,0.12)', paddingBottom:'20px', marginBottom:'20px' },
  ayatNum: { display:'inline-flex', width:'28px', height:'28px', borderRadius:'50%', border:'1.5px solid rgba(201,168,76,0.4)', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', color:'#C9A84C', marginBottom:'12px' },
  arabicText: { fontFamily:'serif', fontSize:'28px', lineHeight:1.9, color:'#1C3D2E', textAlign:'right', direction:'rtl', marginBottom:'12px' },
  translation: { fontSize:'14px', color:'#5A5A5A', lineHeight:1.8 },
  // Hikam
  hikamWrap: {},
  hikamNum: { fontSize:'11px', fontWeight:'700', color:'#C9A84C', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'16px' },
  hikamArabic: { fontFamily:'serif', fontSize:'26px', lineHeight:2, color:'#1C3D2E', textAlign:'right', direction:'rtl', marginBottom:'20px', padding:'20px', background:'rgba(201,168,76,0.06)', borderRadius:'12px', borderRight:'3px solid #C9A84C' },
  hikamDivider: { display:'flex', alignItems:'center', gap:'8px', margin:'20px 0' },
  dLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)' },
  dDiamond: { width:'5px', height:'5px', background:'#C9A84C', transform:'rotate(45deg)', opacity:0.6 },
  hikamTransLabel: { fontSize:'11px', fontWeight:'700', color:'#C9A84C', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'10px' },
  hikamTrans: { fontSize:'15px', color:'#3A3A3A', lineHeight:1.9, fontStyle:'italic' },
  hikamExplain: { fontSize:'14px', color:'#5A5A5A', lineHeight:1.9 },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html,body { background:#F5EFE4; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F5EFE4', fontFamily:"'Nunito',sans-serif", maxWidth:'480px', margin:'0 auto', paddingBottom:'40px' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100dvh' },
  loadText: { color:'#8A7A65', fontSize:'14px' },
  header: { padding:'20px 20px 24px' },
  headerNav: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  backBtn: { fontSize:'13px', fontWeight:'700', color:'rgba(245,239,228,0.7)', background:'transparent', border:'none', cursor:'pointer', padding:'0', WebkitTapHighlightColor:'transparent' },
  kitabLabel: { fontSize:'11px', color:'rgba(245,239,228,0.5)', letterSpacing:'1px', textTransform:'uppercase' },
  title: { fontFamily:'Lora,serif', fontSize:'20px', fontWeight:'700', color:'#F5EFE4' },
  completedBadge: { marginTop:'10px', display:'inline-block', fontSize:'11px', fontWeight:'700', color:'#C9A84C', border:'1px solid rgba(201,168,76,0.3)', borderRadius:'20px', padding:'4px 12px' },
  body: { padding:'24px 20px' },
  actions: { padding:'0 20px 24px' },
  completeBtn: { width:'100%', padding:'15px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#1C3D2E,#2D6A4F)', color:'#F5EFE4', fontWeight:'700', fontSize:'15px', cursor:'pointer', marginBottom:'16px', boxShadow:'0 6px 20px rgba(28,61,46,0.25)', WebkitTapHighlightColor:'transparent' },
  completedBox: { width:'100%', padding:'14px', borderRadius:'12px', border:'1.5px solid rgba(201,168,76,0.3)', background:'rgba(201,168,76,0.08)', color:'#C9A84C', fontWeight:'700', fontSize:'14px', textAlign:'center', marginBottom:'16px' },
  navBtns: { display:'flex', justifyContent:'space-between', gap:'10px' },
  navBtn: { flex:1, padding:'12px', borderRadius:'10px', border:'1.5px solid #DDD5C5', background:'#fff', color:'#5A5A5A', fontWeight:'600', fontSize:'13px', cursor:'pointer', WebkitTapHighlightColor:'transparent' },
  navBtnNext: { flex:1, padding:'12px', borderRadius:'10px', border:'none', background:'#1C3D2E', color:'#F5EFE4', fontWeight:'700', fontSize:'13px', cursor:'pointer', WebkitTapHighlightColor:'transparent' },
}