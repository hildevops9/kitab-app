import BottomNav from '../components/BottomNav'

export function CatatanPage() {
  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>
      <div style={s.header}><h1 style={s.title}>Catatan</h1></div>
      <div style={s.body}>
        <div style={s.empty}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>📝</div>
          <h3 style={s.emptyTitle}>Belum ada catatan</h3>
          <p style={s.emptySub}>Fitur catatan akan segera hadir. Kamu bisa membuat catatan saat membaca materi.</p>
        </div>
      </div>
      <BottomNav active="catatan"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
`

const s = {
  root: { width: '100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  header: { background:'#fff', padding:'24px 20px 16px', borderBottom:'1px solid #F0EBE0' },
  title: { fontFamily:'Lora,serif', fontSize:'24px', fontWeight:'700', color:'#1C3D2E' },
  body: { padding:'16px' },
  empty: { textAlign:'center', padding:'80px 24px' },
  emptyTitle: { fontFamily:'Lora,serif', fontSize:'18px', color:'#1C3D2E', marginBottom:'8px' },
  emptySub: { fontSize:'13px', color:'#8A7A65', lineHeight:1.6 },
}