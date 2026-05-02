import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/BottomNav'

const TYPE_CONFIG = {
  QURAN:   { label: 'Al-Quran',    bg: '#E8F0EC', color: '#1C3D2E' },
  HIKAM:   { label: 'Kitab Hikam', bg: '#F5ECD9', color: '#5C3A1E' },
  FIQIH:   { label: 'Fiqih',       bg: '#EAE8F5', color: '#3D2E6B' },
  HADITS:  { label: 'Hadits',      bg: '#E8EFF5', color: '#1E3A5C' },
  GENERAL: { label: 'Kitab',       bg: '#F0F0F0', color: '#333' },
}

const FILTERS = [
  { key: 'SEMUA',  label: 'Semua' },
  { key: 'QURAN',  label: 'Al-Quran' },
  { key: 'FIQIH',  label: 'Fiqih' },
  { key: 'HADITS', label: 'Hadits' },
  { key: 'HIKAM',  label: 'Hikam' },
]

export default function KitabListPage() {
  const navigate = useNavigate()
  const [kitabs, setKitabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('SEMUA')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/kitab').then(r => setKitabs(r.data.kitabs)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = kitabs.filter(k => {
    const matchFilter = filter === 'SEMUA' || k.type === filter
    const matchSearch = !search || k.title.toLowerCase().includes(search.toLowerCase()) || k.author.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleKitabClick = (kitab) => {
    if (kitab.totalMateri === 0) return // coming soon, tidak bisa diklik
    navigate(`/kitab/${kitab.slug}`)
  }

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Kitab</h1>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Cari kitab, penulis, atau topik..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div style={s.filterRow}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ ...s.filterBtn, ...(filter === f.key ? s.filterBtnActive : {}) }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={s.body}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={s.skeleton} className="skeleton"/>)
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
            <p style={{ color:'#8A7A65', fontSize:'14px' }}>Tidak ada kitab ditemukan</p>
          </div>
        ) : filtered.map(kitab => {
          const cfg = TYPE_CONFIG[kitab.type] || TYPE_CONFIG.GENERAL
          const isComingSoon = kitab.totalMateri === 0

          return (
            <div key={kitab.id}
              style={{ ...s.kitabCard, ...(isComingSoon ? s.kitabCardDimmed : {}) }}
              onClick={() => handleKitabClick(kitab)}
              className={isComingSoon ? '' : 'card-press'}>

              {/* Cover */}
              <div style={{ ...s.cover, background: kitab.coverColor || '#1C3D2E', opacity: isComingSoon ? 0.6 : 1 }}>
                <span style={s.coverAr}>{kitab.arabicTitle}</span>
              </div>

              {/* Info */}
              <div style={s.info}>
                <div style={s.topRow}>
                  <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  {isComingSoon && (
                    <span style={s.comingSoonBadge}>🕐 Coming Soon</span>
                  )}
                </div>
                <h3 style={s.kitabTitle}>{kitab.title}</h3>
                <p style={s.kitabAuthor}>{kitab.author}</p>

                {isComingSoon ? (
                  <p style={s.comingSoonText}>Konten sedang disiapkan. Nantikan segera!</p>
                ) : kitab.lastRead ? (
                  <p style={s.lastRead}>Terakhir dibaca: {kitab.lastRead}</p>
                ) : (
                  <p style={s.lastRead}>Belum dibaca · {kitab.totalBab} bab tersedia</p>
                )}

                {!isComingSoon && kitab.completedCount > 0 && (
                  <div style={s.progressWrap}>
                    <div style={s.progressBar}>
                      <div style={{ ...s.progressFill, width: `${kitab.progressPct}%`, background: kitab.coverColor || '#1C3D2E' }}/>
                    </div>
                    <span style={s.progressPct}>{kitab.progressPct}%</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav active="kitab"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  .card-press:active { transform:scale(0.98) !important; }
  .search-input:focus { outline:none; }
  @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
  .skeleton { animation:pulse 1.5s ease-in-out infinite; }
`

const s = {
  root: { width: '100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  header: { background:'#fff', padding:'20px 16px 0', borderBottom:'1px solid #F0EBE0' },
  title: { fontFamily:'Lora,serif', fontSize:'24px', fontWeight:'700', color:'#1C3D2E', marginBottom:'14px' },
  searchWrap: { display:'flex', alignItems:'center', gap:'8px', background:'#F8F5EF', borderRadius:'12px', padding:'10px 14px', marginBottom:'14px' },
  searchIcon: { fontSize:'16px', flexShrink:0 },
  searchInput: { flex:1, background:'none', border:'none', fontSize:'14px', color:'#1A1A1A', fontFamily:"'Nunito',sans-serif" },
  filterRow: { display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'12px' },
  filterBtn: { flexShrink:0, padding:'7px 16px', borderRadius:'20px', border:'1.5px solid #E5DDD0', background:'#fff', fontSize:'13px', fontWeight:'600', color:'#6B6B6B', cursor:'pointer', fontFamily:"'Nunito',sans-serif", WebkitTapHighlightColor:'transparent' },
  filterBtnActive: { background:'#1C3D2E', borderColor:'#1C3D2E', color:'#fff' },
  body: { padding:'12px 16px', display:'flex', flexDirection:'column', gap:'10px' },
  kitabCard: { background:'#fff', borderRadius:'16px', display:'flex', gap:'14px', padding:'14px', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', transition:'transform 0.15s', alignItems:'flex-start' },
  kitabCardDimmed: { cursor:'default', opacity:0.85 },
  cover: { width:'72px', height:'96px', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' },
  coverAr: { fontFamily:'serif', fontSize:'13px', color:'rgba(255,255,255,0.55)', textAlign:'center', padding:'4px' },
  info: { flex:1, minWidth:0 },
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px', flexWrap:'wrap', gap:'4px' },
  badge: { fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px' },
  comingSoonBadge: { fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:'#FFF3E0', color:'#E65100' },
  kitabTitle: { fontFamily:'Lora,serif', fontSize:'15px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px' },
  kitabAuthor: { fontSize:'11px', color:'#A0906E', fontStyle:'italic', marginBottom:'4px' },
  lastRead: { fontSize:'11px', color:'#8A7A65', marginBottom:'6px' },
  comingSoonText: { fontSize:'11px', color:'#A0906E', fontStyle:'italic', marginBottom:'6px', lineHeight:1.5 },
  progressWrap: { display:'flex', alignItems:'center', gap:'8px' },
  progressBar: { flex:1, height:'3px', background:'#EDE7D9', borderRadius:'4px', overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:'4px' },
  progressPct: { fontSize:'11px', fontWeight:'700', color:'#8A7A65', flexShrink:0 },
  skeleton: { height:'100px', borderRadius:'16px', background:'#E8DFD0' },
  empty: { textAlign:'center', padding:'60px 20px' },
}