import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/BottomNav'

const CACHE_TTL = 5 * 60 * 1000

function getCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch { return null }
}
function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

// ── View: daftar bab (untuk QURAN) ──────────────────────────────────────────
function BabListView({ kitabSlug, kitab, babs, barColor, isQuran, navigate }) {
  return (
    <div style={s.body}>
      <div style={s.sectionLabel}>
        {isQuran ? 'DAFTAR SURAH' : 'DAFTAR BAB'} — {babs.length} {isQuran ? 'Surah' : 'Bab'}
      </div>
      <div style={s.list}>
        {babs.map((bab, idx) => (
          <div key={bab.id} style={s.card}
            onClick={() => navigate(`/kitab/${kitabSlug}/${bab.slug}`)}
            className="row-card">
            <div style={{ ...s.numBox, background: barColor + '18', color: barColor }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div style={s.cardInfo}>
              <h3 style={s.cardTitle}>
                {bab.title}
                {bab.arabicTitle && <span style={s.cardAr}> · {bab.arabicTitle}</span>}
              </h3>
              <p style={s.cardMeta}>
                {bab.totalMateri} {isQuran ? 'Ayat' : 'Materi'}
                {bab.completedCount > 0 && (
                  <span style={s.doneText}> · {bab.completedCount} selesai</span>
                )}
              </p>
            </div>
            {bab.completedCount === bab.totalMateri && bab.totalMateri > 0 && (
              <span style={s.checkDone}>✓</span>
            )}
            <span style={{ ...s.arrow, color: barColor }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── View: daftar materi langsung (untuk HIKAM & kitab tanpa bab) ─────────────
function MateriListView({ materis, barColor, navigate }) {
  return (
    <div style={s.body}>
      <div style={s.sectionLabel}>
        DAFTAR MATERI — {materis.length} ITEM
      </div>
      <div style={s.list}>
        {materis.map((m, idx) => (
          <div key={m.id} style={s.card}
            onClick={() => navigate(`/materi/${m.id}`)}
            className="row-card">
            <div style={{
              ...s.numBox,
              background: m.isCompleted ? barColor : barColor + '18',
              color: m.isCompleted ? '#fff' : barColor,
              border: m.isCompleted ? 'none' : `1.5px solid ${barColor}40`,
            }}>
              {m.isCompleted ? '✓' : String(idx + 1).padStart(2, '0')}
            </div>
            <div style={s.cardInfo}>
              <h3 style={s.cardTitle}>{m.title}</h3>
              {m.content?.arabic && (
                <p style={s.arabicPreview} dir="rtl">
                  {m.content.arabic.slice(0, 60)}{m.content.arabic.length > 60 ? '...' : ''}
                </p>
              )}
            </div>
            <span style={{ ...s.arrow, color: barColor }}>›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function KitabPage() {
  const { kitabSlug } = useParams()
  const navigate = useNavigate()

  // Tentukan apakah pakai flat materi atau bab — cek dari cache dulu
  const cacheKey = `kitab_detail_${kitabSlug}`
  const cached = getCache(cacheKey)
  const isHikamMode = cached?.kitab?.type === 'HIKAM' || cached?.materis !== undefined

  const [data, setData] = useState(() => cached)
  const [loading, setLoading] = useState(() => !cached)

  useEffect(() => {
    // Fetch dulu info kitab untuk tau type-nya
    api.get(`/kitab/${kitabSlug}`)
      .then(async (res) => {
        const kitabType = res.data.kitab?.type

        // HIKAM → fetch flat materi
        if (kitabType !== 'QURAN' && kitabType !== undefined) {
          const materiRes = await api.get(`/kitab/${kitabSlug}/materis`)
          setData(materiRes.data)
          setCache(cacheKey, materiRes.data)
        } else {
          // QURAN / GENERAL → pakai response bab biasa
          setData(res.data)
          setCache(cacheKey, res.data)
        }
      })
      .catch(() => navigate('/kitab'))
      .finally(() => setLoading(false))
  }, [kitabSlug])

  if (loading && !data) return (
    <div style={s.loadScreen}><div style={s.spinner} className="spin"/></div>
  )
  if (!data) return null

  const kitab = data.kitab
  const barColor = kitab.coverColor || '#1C3D2E'
  const isQuran = kitab.type === 'QURAN'
  const showMaterisDirectly = !!data.materis // flat materi mode

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Header */}
      <div style={{ ...s.header, background: `linear-gradient(160deg, ${barColor}F0, ${barColor})` }}>
        <button onClick={() => navigate('/kitab')} style={s.backBtn}>← Kembali</button>
        <div style={s.headerContent}>
          {kitab.arabicTitle && <div style={s.arabicTitle}>{kitab.arabicTitle}</div>}
          <h1 style={s.title}>{kitab.title}</h1>
          <p style={s.author}>{kitab.author}</p>
        </div>
        {kitab.totalMateri > 0 && (
          <div style={s.progressCard}>
            <div style={s.progressTop}>
              <span style={s.progressLabel}>Progress</span>
              <span style={s.progressPct}>{kitab.completedCount}/{kitab.totalMateri} • {kitab.progressPct}%</span>
            </div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${kitab.progressPct}%` }}/>
            </div>
          </div>
        )}
        <div style={s.ornRow}>
          <div style={s.ornLine}/><div style={s.diamond}/><div style={s.ornLine}/>
        </div>
      </div>

      {/* Body — conditional render */}
      {showMaterisDirectly ? (
        <MateriListView
          materis={data.materis}
          barColor={barColor}
          navigate={navigate}
        />
      ) : (
        <BabListView
          kitabSlug={kitabSlug}
          kitab={kitab}
          babs={data.babs || []}
          barColor={barColor}
          isQuran={isQuran}
          navigate={navigate}
        />
      )}

      <BottomNav active="kitab"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  .row-card:active { background:#F0EBE0 !important; transform:scale(0.98) !important; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
`

const s = {
  root: { width:'100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  loadScreen: { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8F5EF' },
  spinner: { width:'32px', height:'32px', border:'3px solid #E8E0D0', borderTop:'3px solid #1C3D2E', borderRadius:'50%' },
  header: { padding:'20px 20px 0', color:'#F5EFE4' },
  backBtn: { background:'none', border:'none', color:'rgba(245,239,228,0.65)', fontSize:'13px', fontWeight:'700', cursor:'pointer', padding:'0', marginBottom:'20px', display:'block', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  headerContent: { marginBottom:'16px' },
  arabicTitle: { fontFamily:'serif', fontSize:'28px', color:'rgba(201,168,76,0.9)', letterSpacing:'2px', marginBottom:'6px' },
  title: { fontFamily:'Lora,serif', fontSize:'22px', fontWeight:'700', marginBottom:'4px' },
  author: { fontSize:'13px', opacity:0.6, fontStyle:'italic', marginBottom:'4px' },
  progressCard: { background:'rgba(255,255,255,0.1)', borderRadius:'12px', padding:'12px 14px', marginBottom:'16px' },
  progressTop: { display:'flex', justifyContent:'space-between', marginBottom:'8px' },
  progressLabel: { fontSize:'11px', fontWeight:'700', color:'rgba(245,239,228,0.6)', letterSpacing:'0.5px' },
  progressPct: { fontSize:'11px', fontWeight:'700', color:'#C9A84C' },
  progressBar: { height:'4px', background:'rgba(255,255,255,0.15)', borderRadius:'4px', overflow:'hidden' },
  progressFill: { height:'100%', background:'linear-gradient(90deg,#C9A84C,#E8C97A)', borderRadius:'4px', transition:'width 0.5s' },
  ornRow: { display:'flex', alignItems:'center', gap:'8px', paddingBottom:'1px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0 },
  body: { padding:'20px 16px' },
  sectionLabel: { fontSize:'10px', fontWeight:'700', color:'#A0906E', letterSpacing:'1.5px', marginBottom:'12px' },
  list: { display:'flex', flexDirection:'column', gap:'8px' },
  card: { background:'#fff', borderRadius:'14px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,0.05)', transition:'background 0.15s, transform 0.15s', border:'1px solid rgba(0,0,0,0.03)' },
  numBox: { width:'36px', height:'36px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', flexShrink:0, transition:'all 0.2s' },
  cardInfo: { flex:1, minWidth:0 },
  cardTitle: { fontSize:'14px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px' },
  cardAr: { fontFamily:'serif', fontWeight:'400', color:'#8A7A65', fontSize:'13px' },
  cardMeta: { fontSize:'12px', color:'#A0906E' },
  arabicPreview: { fontFamily:'serif', fontSize:'13px', color:'#A0906E', lineHeight:1.6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  doneText: { color:'#2D6A4F', fontWeight:'600' },
  checkDone: { fontSize:'13px', fontWeight:'700', color:'#2D6A4F', background:'#E8F0EC', width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  arrow: { fontSize:'22px', fontWeight:'300', flexShrink:0, opacity:0.4 },
}