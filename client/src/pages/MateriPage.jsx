import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

const CACHE_TTL = 10 * 60 * 1000 // 10 menit — konten jarang berubah

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key) // sessionStorage: per session, lebih cepat dari localStorage
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch { return null }
}
function setCache(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

async function fetchMateri(materiId) {
  const cacheKey = `materi_${materiId}`
  const cached = getCache(cacheKey)
  if (cached) return cached
  const res = await api.get(`/materi/${materiId}`)
  setCache(cacheKey, res.data)
  return res.data
}

function QuranContent({ content }) {
  return (
    <div style={r.wrap}>
      <div style={r.arabicCard}>
        <p style={r.arabic}>{content.arabic}</p>
        {content.latin && <p style={r.latin}>{content.latin}</p>}
      </div>
      {content.terjemahan && (
        <div style={r.section}>
          <div style={r.sectionHead}>
            <div style={{ ...r.dot, background:'#1C3D2E' }}/>
            <span style={r.sectionLabel}>Terjemahan</span>
          </div>
          <p style={r.sectionText}>{content.terjemahan}</p>
        </div>
      )}
    </div>
  )
}

function HikamContent({ content }) {
  return (
    <div style={r.wrap}>
      <div style={r.hikamNumBadge}>Hikam ke-{content.number}</div>
      <div style={r.arabicCardHikam}>
        <p style={r.arabicHikam}>{content.arabic}</p>
      </div>
      {content.terjemahan && (
        <div style={r.section}>
          <div style={r.sectionHead}>
            <div style={{ ...r.dot, background:'#5C3A1E' }}/>
            <span style={r.sectionLabel}>Terjemahan</span>
          </div>
          <p style={r.sectionTextItalic}>{content.terjemahan}</p>
        </div>
      )}
      {content.penjelasan && (
        <div style={r.section}>
          <div style={r.sectionHead}>
            <div style={{ ...r.dot, background:'#C9A84C' }}/>
            <span style={r.sectionLabel}>Penjelasan</span>
          </div>
          <p style={r.sectionText}>{content.penjelasan}</p>
        </div>
      )}
      {content.referensi && (
        <a href={content.referensi.url} target="_blank" rel="noopener noreferrer" style={r.referensiLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          {content.referensi.label}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:'auto', opacity:0.5 }}>
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      )}
    </div>
  )
}

export default function MateriPage() {
  const { materiId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(() => getCache(`materi_${materiId}`))
  const [loading, setLoading] = useState(() => !getCache(`materi_${materiId}`))
  const [completing, setCompleting] = useState(false)
  const prefetchedRef = useRef(new Set())

  useEffect(() => {
    setLoading(!getCache(`materi_${materiId}`))
    fetchMateri(materiId)
      .then(d => setData(d))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false))
  }, [materiId])

  // Prefetch prev/next setelah data loaded
  useEffect(() => {
    if (!data) return
    const { prev, next } = data
    ;[prev, next].forEach(item => {
      if (item && !prefetchedRef.current.has(item.id)) {
        prefetchedRef.current.add(item.id)
        fetchMateri(item.id).catch(() => {}) // silent prefetch
      }
    })
  }, [data])

  const handleComplete = async () => {
    if (completing) return
    setCompleting(true)
    try {
      const res = await api.post(`/materi/${materiId}/complete`)
      const updated = { ...data, isCompleted: res.data.isCompleted }
      setData(updated)
      setCache(`materi_${materiId}`, updated) // sync cache agar tidak stale saat balik
      // Invalidate cache bab agar progress terupdate
      const babKey = `bab_${data?.materi?.bab?.kitab?.slug}_${data?.materi?.bab?.slug}`
      sessionStorage.removeItem(babKey)
    } catch (e) { console.error(e) }
    finally { setCompleting(false) }
  }

  const handleBookmark = async () => {
    try {
      const res = await api.post(`/materi/${materiId}/bookmark`)
      setData(prev => ({ ...prev, isBookmarked: res.data.isBookmarked }))
    } catch (e) { console.error(e) }
  }

  const goTo = (id) => {
    if (!id) return
    const cached = getCache(`materi_${id}`)
    if (cached) {
      setData(cached)
      navigate(`/materi/${id}`, { replace: false })
    } else {
      navigate(`/materi/${id}`)
    }
  }

  if (loading && !data) return (
    <div style={s.loadScreen}><div style={s.spinner} className="spin"/></div>
  )
  if (!data) return null

  const { materi, isCompleted, isBookmarked, prev, next } = data
  const kitab = materi.bab.kitab
  const barColor = kitab.coverColor || '#1C3D2E'
  const content = materi.content

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      <div style={s.topBar}>
        <button onClick={() => kitab.type === 'HIKAM'
          ? navigate(`/kitab/${kitab.slug}`)
          : navigate(`/kitab/${kitab.slug}/${materi.bab.slug}`)
        } style={s.backBtn}>
          ← {kitab.type === 'HIKAM' ? kitab.title : materi.bab.title}
        </button>
        <div style={s.topRight}>
          <button onClick={handleBookmark} style={s.iconBtn}>
            {isBookmarked ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill={barColor} stroke={barColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div style={{ ...s.titleSection, borderBottom: `3px solid ${barColor}20` }}>
        <p style={{ ...s.kitabBreadcrumb, color: barColor }}>
          {kitab.title}{kitab.type !== 'HIKAM' && ` · ${materi.bab.title}`}
        </p>
        <h1 style={s.title}>{materi.title}</h1>
        {isCompleted && (
          <div style={{ ...s.completedBadge, color: barColor, borderColor: barColor + '40', background: barColor + '10' }}>
            ✓ Sudah dipelajari
          </div>
        )}
      </div>

      <div style={s.contentArea}>
        {content?.type === 'quran' && <QuranContent content={content}/>}
        {content?.type === 'hikam' && <HikamContent content={content}/>}
        {!content?.type && (
          <div style={s.rawContent}><p>{JSON.stringify(content)}</p></div>
        )}
      </div>

      <div style={s.bottomBar}>
        <div style={s.navRow}>
          <button onClick={() => goTo(prev?.id)} disabled={!prev}
            style={{ ...s.navBtn, opacity: prev ? 1 : 0.3, border: `1.5px solid ${barColor}30` }}>
            ← Sebelumnya
          </button>
          <button onClick={() => goTo(next?.id)} disabled={!next}
            style={{ ...s.navBtnNext, opacity: next ? 1 : 0.3, background: next ? barColor : '#ccc' }}>
            Selanjutnya →
          </button>
        </div>
        <button onClick={handleComplete} disabled={completing}
          style={{
            ...s.completeBtn,
            background: isCompleted ? barColor + '15' : barColor,
            color: isCompleted ? barColor : '#fff',
            border: isCompleted ? `1.5px solid ${barColor}40` : 'none',
          }}>
          {completing ? 'Menyimpan...' : isCompleted ? '✓ Sudah Dipelajari' : 'Tandai Selesai'}
        </button>
      </div>
    </div>
  )
}

const r = {
  wrap: { display:'flex', flexDirection:'column', gap:'14px' },
  arabicCard: { background:'#fff', borderRadius:'16px', padding:'24px 20px', border:'1px solid rgba(201,168,76,0.15)' },
  arabic: { fontFamily:'serif', fontSize:'28px', lineHeight:2, color:'#1C3D2E', textAlign:'right', direction:'rtl', marginBottom:'14px' },
  latin: { fontSize:'13px', color:'#8A7A65', lineHeight:1.8, fontStyle:'italic', textAlign:'center' },
  arabicCardHikam: { background:'rgba(201,168,76,0.06)', borderRadius:'14px', padding:'20px', borderRight:'3px solid #C9A84C' },
  arabicHikam: { fontFamily:'serif', fontSize:'24px', lineHeight:2, color:'#1C3D2E', textAlign:'right', direction:'rtl' },
  hikamNumBadge: { fontSize:'11px', fontWeight:'700', color:'#C9A84C', letterSpacing:'1.5px', textTransform:'uppercase' },
  section: { background:'#fff', borderRadius:'14px', padding:'16px 18px' },
  sectionHead: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' },
  dot: { width:'8px', height:'8px', borderRadius:'50%', flexShrink:0 },
  sectionLabel: { fontSize:'11px', fontWeight:'700', color:'#A0906E', letterSpacing:'1px', textTransform:'uppercase' },
  sectionText: { fontSize:'15px', color:'#3A3A3A', lineHeight:1.9 },
  sectionTextItalic: { fontSize:'15px', color:'#3A3A3A', lineHeight:1.9, fontStyle:'italic' },
  referensiLink: { display:'flex', alignItems:'center', gap:'8px', background:'rgba(201,168,76,0.08)', border:'1.5px solid rgba(201,168,76,0.35)', borderRadius:'12px', padding:'13px 16px', fontSize:'14px', fontWeight:'600', color:'#7A5C1E', textDecoration:'none' },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .spin { animation:spin 0.8s linear infinite; }
`

const s = {
  root: { width:'100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", display:'flex', flexDirection:'column' },
  loadScreen: { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F5EF' },
  spinner: { width:'32px', height:'32px', border:'3px solid #E8E0D0', borderTop:'3px solid #1C3D2E', borderRadius:'50%' },
  topBar: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', background:'#F8F5EF', position:'sticky', top:0, zIndex:10, borderBottom:'1px solid rgba(0,0,0,0.05)' },
  backBtn: { background:'none', border:'none', color:'#6B6B6B', fontSize:'13px', fontWeight:'600', cursor:'pointer', padding:0, fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  topRight: { display:'flex', gap:'8px' },
  iconBtn: { background:'none', border:'none', cursor:'pointer', padding:'4px', display:'flex', alignItems:'center', WebkitTapHighlightColor:'transparent' },
  titleSection: { padding:'16px 20px 18px', background:'#fff', marginBottom:'2px' },
  kitabBreadcrumb: { fontSize:'11px', fontWeight:'700', letterSpacing:'0.5px', marginBottom:'6px' },
  title: { fontFamily:'Lora,serif', fontSize:'20px', fontWeight:'700', color:'#1C3D2E', lineHeight:1.3, marginBottom:'8px' },
  completedBadge: { display:'inline-block', fontSize:'11px', fontWeight:'700', padding:'4px 12px', borderRadius:'20px', border:'1px solid' },
  contentArea: { flex:1, padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' },
  rawContent: { background:'#fff', borderRadius:'14px', padding:'16px', fontSize:'14px', color:'#3A3A3A', lineHeight:1.8 },
  bottomBar: { padding:'14px 20px 28px', background:'#fff', borderTop:'1px solid rgba(0,0,0,0.06)', position:'sticky', bottom:0, display:'flex', flexDirection:'column', gap:'10px' },
  navRow: { display:'flex', gap:'8px' },
  navBtn: { flex:1, padding:'11px', borderRadius:'10px', background:'#fff', color:'#5A5A5A', fontWeight:'600', fontSize:'13px', cursor:'pointer', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  navBtnNext: { flex:1, padding:'11px', borderRadius:'10px', border:'none', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  completeBtn: { width:'100%', padding:'15px', borderRadius:'12px', fontWeight:'700', fontSize:'15px', cursor:'pointer', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent', transition:'all 0.2s' },
}