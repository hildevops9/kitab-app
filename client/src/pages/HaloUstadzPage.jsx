import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

// 🔗 Ganti URL ini dengan link Google Form kamu
const GOOGLE_FORM_URL = 'https://forms.gle/sp3bgYG5dsszDSFL8'

export default function HaloUstadzPage() {
  const navigate = useNavigate()

  const handleTanyaLangsung = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Header */}
      <div style={s.header} className="header-safe">
        <div style={s.headerAr}>السُّؤَالُ</div>
        <h1 style={s.headerTitle}>Halo Ustadz</h1>
        <p style={s.headerSub}>Ada yang ingin kamu tanyakan?</p>
      </div>

      <div style={s.body}>

        {/* Ornamen divider */}
        <div style={s.ornRow}>
          <div style={s.ornLine}/>
          <div style={s.diamond}/>
          <div style={s.ornLine}/>
        </div>

        <p style={s.introText}>
          Pilih cara kamu ingin bertanya. Semua pertanyaan akan dijawab dengan sepenuh hati oleh tim ustadz kami.
        </p>

        {/* Card 1 — AI (Coming Soon) */}
        <div style={s.cardDisabled}>
          <div style={s.cardTop}>
            <div style={s.iconWrap}>
              <span style={s.icon}>🤖</span>
            </div>
            <div style={s.comingSoonBadge}>Segera Hadir</div>
          </div>
          <h2 style={s.cardTitle}>Tanya dengan AI</h2>
          <p style={s.cardDesc}>
            Ajukan pertanyaan seputar kitab dan Islam kepada AI yang dilatih khusus. Tersedia 24/7, jawaban instan.
          </p>
          <div style={s.featureList}>
            {['Jawaban instan', 'Referensi dari kitab', 'Tersedia 24/7'].map(f => (
              <div key={f} style={s.featureItem}>
                <span style={s.featureDot}>·</span>
                <span style={s.featureText}>{f}</span>
              </div>
            ))}
          </div>
          <button style={s.btnDisabled} disabled>
            🔒 Segera Hadir
          </button>
        </div>

        {/* Card 2 — Tanya Langsung (Active) */}
        <div style={s.cardActive} className="card-press" onClick={handleTanyaLangsung}>
          <div style={s.cardTop}>
            <div style={{ ...s.iconWrap, background: 'rgba(28,61,46,0.08)' }}>
              <span style={s.icon}>👨‍🏫</span>
            </div>
            <div style={s.activeBadge}>Tersedia</div>
          </div>
          <h2 style={{ ...s.cardTitle, color: '#1C3D2E' }}>Tanya Langsung ke Ustadz</h2>
          <p style={s.cardDesc}>
            Kirim pertanyaanmu langsung ke ustadz Ali Abdul Khalik melalui formulir. Akan dijawab dalam pengajian berikutnya atau bisa via call.
          </p>
          <div style={s.featureList}>
            {['Dijawab ustadz berpengalaman', 'Gratis'].map(f => (
              <div key={f} style={s.featureItem}>
                <span style={{ ...s.featureDot, color: '#2D6A4F' }}>✓</span>
                <span style={{ ...s.featureText, color: '#3A3A3A' }}>{f}</span>
              </div>
            ))}
          </div>
          <button style={s.btnActive}>
            Kirim Pertanyaan →
          </button>
        </div>

        {/* Catatan kecil */}
        <div style={s.note}>
          <span style={s.noteIcon}>📝</span>
          <p style={s.noteText}>
            Pertanyaan yang baik: spesifik, disertai konteks, dan terkait ilmu agama Islam.
          </p>
        </div>

      </div>

      <BottomNav active="ustadz" />
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  .card-press { cursor:pointer; transition:transform 0.15s, box-shadow 0.15s; }
  .card-press:active { transform:scale(0.98) !important; }
`

const s = {
  root: { minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  // Header
  header: {
    background: 'linear-gradient(160deg,#0F2318,#1C3D2E)',
    padding: '28px 20px 24px',
    textAlign: 'center',
  },
  headerAr: { fontFamily:'serif', fontSize:'22px', color:'rgba(201,168,76,0.7)', letterSpacing:'2px', marginBottom:'8px' },
  headerTitle: { fontFamily:'Lora,serif', fontSize:'26px', fontWeight:'700', color:'#F5EFE4', marginBottom:'6px' },
  headerSub: { fontSize:'13px', color:'rgba(245,239,228,0.6)' },
  // Body
  body: { padding:'20px 16px' },
  ornRow: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' },
  ornLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.35),transparent)' },
  diamond: { width:'6px', height:'6px', background:'#C9A84C', transform:'rotate(45deg)', flexShrink:0 },
  introText: { fontSize:'14px', color:'#8A7A65', lineHeight:1.7, marginBottom:'20px', textAlign:'center' },
  // Cards
  cardDisabled: {
    background:'#fff', borderRadius:'18px', padding:'20px',
    marginBottom:'14px', opacity:0.6,
    border:'1.5px solid rgba(0,0,0,0.06)',
    boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
  },
  cardActive: {
    background:'#fff', borderRadius:'18px', padding:'20px',
    marginBottom:'20px',
    border:'1.5px solid rgba(28,61,46,0.15)',
    boxShadow:'0 4px 20px rgba(28,61,46,0.1)',
  },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' },
  iconWrap: {
    width:'48px', height:'48px', borderRadius:'14px',
    background:'rgba(0,0,0,0.04)',
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  icon: { fontSize:'24px' },
  comingSoonBadge: {
    fontSize:'11px', fontWeight:'700', color:'#A0906E',
    background:'#F5ECD9', padding:'4px 10px', borderRadius:'20px',
  },
  activeBadge: {
    fontSize:'11px', fontWeight:'700', color:'#2D6A4F',
    background:'#E8F0EC', padding:'4px 10px', borderRadius:'20px',
  },
  cardTitle: { fontSize:'18px', fontWeight:'700', color:'#6B6B6B', marginBottom:'8px', fontFamily:"'Nunito',sans-serif" },
  cardDesc: { fontSize:'13px', color:'#8A7A65', lineHeight:1.7, marginBottom:'14px' },
  featureList: { display:'flex', flexDirection:'column', gap:'5px', marginBottom:'18px' },
  featureItem: { display:'flex', alignItems:'center', gap:'8px' },
  featureDot: { fontSize:'14px', color:'#C9A84C', fontWeight:'700', flexShrink:0 },
  featureText: { fontSize:'12px', color:'#8A7A65' },
  btnDisabled: {
    width:'100%', padding:'13px', borderRadius:'10px',
    border:'1.5px solid #E5DDD0', background:'#F8F5EF',
    color:'#A0906E', fontWeight:'700', fontSize:'14px',
    cursor:'not-allowed', fontFamily:"'Nunito',sans-serif",
  },
  btnActive: {
    width:'100%', padding:'14px', borderRadius:'10px',
    border:'none', background:'#1C3D2E',
    color:'#fff', fontWeight:'700', fontSize:'14px',
    cursor:'pointer', fontFamily:"'Nunito',sans-serif",
    boxShadow:'0 4px 16px rgba(28,61,46,0.25)',
  },
  // Note
  note: {
    display:'flex', gap:'10px', alignItems:'flex-start',
    background:'rgba(201,168,76,0.06)',
    border:'1px solid rgba(201,168,76,0.2)',
    borderRadius:'12px', padding:'14px',
  },
  noteIcon: { fontSize:'16px', flexShrink:0, marginTop:'1px' },
  noteText: { fontSize:'12px', color:'#8A7A65', lineHeight:1.6 },
}