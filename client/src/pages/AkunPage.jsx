import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import BottomNav from '../components/BottomNav'

export default function AkunPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={s.root} className="page-root">
      <style>{css}</style>

      {/* Profile header */}
      <div style={s.header} className="header-safe">
        <div style={s.avatarWrap}>
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="" style={s.avatarImg}/>
            : <div style={s.avatarPlaceholder}>{user?.name?.[0]?.toUpperCase()}</div>
          }
        </div>
        <h2 style={s.name}>{user?.name}</h2>
        <p style={s.email}>{user?.email}</p>
        <span style={s.roleBadge}>{user?.role === 'ADMIN' ? '👑 Admin' : user?.role === 'USTADZ' ? '🎓 Ustadz' : '📖 Santri'}</span>
      </div>

      <div style={s.body}>
        {/* Menu */}
        {[
          { icon:'📊', label:'Statistik Belajar', sub:'Lihat progress belajarmu' },
          { icon:'🔔', label:'Notifikasi', sub:'Atur pengingat belajar' },
          { icon:'🔒', label:'Privasi & Keamanan', sub:'Kelola akun dan password' },
          { icon:'❓', label:'Bantuan', sub:'FAQ dan hubungi kami' },
          { icon:'ℹ️', label:'Tentang Aplikasi', sub:'Versi 1.0.0' },
        ].map(item => (
          <div key={item.label} style={s.menuItem} className="menu-item">
            <div style={s.menuIcon}>{item.icon}</div>
            <div style={s.menuInfo}>
              <p style={s.menuLabel}>{item.label}</p>
              <p style={s.menuSub}>{item.sub}</p>
            </div>
            <span style={s.menuArrow}>›</span>
          </div>
        ))}

        <button onClick={handleLogout} style={s.logoutBtn}>
          Keluar dari Akun
        </button>
      </div>

      <BottomNav active="akun"/>
    </div>
  )
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body,#root { background:#F8F5EF; }
  .menu-item:active { background:#F0EBE0 !important; }
`

const s = {
  root: { width: '100%', minHeight:'100dvh', background:'#F8F5EF', fontFamily:"'Nunito',sans-serif", paddingBottom:'80px' },
  header: { background:'linear-gradient(160deg,#0F2318,#1C3D2E)', padding:'32px 20px 28px', textAlign:'center' },
  avatarWrap: { display:'flex', justifyContent:'center', marginBottom:'12px' },
  avatarImg: { width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(201,168,76,0.4)' },
  avatarPlaceholder: { width:'80px', height:'80px', borderRadius:'50%', background:'#2D6A4F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:'700', color:'#fff', border:'3px solid rgba(201,168,76,0.4)' },
  name: { fontFamily:'Lora,serif', fontSize:'20px', fontWeight:'700', color:'#F5EFE4', marginBottom:'4px' },
  email: { fontSize:'13px', color:'rgba(245,239,228,0.6)', marginBottom:'10px' },
  roleBadge: { fontSize:'12px', fontWeight:'700', color:'#C9A84C', background:'rgba(201,168,76,0.15)', padding:'4px 14px', borderRadius:'20px', border:'1px solid rgba(201,168,76,0.3)' },
  body: { padding:'16px', display:'flex', flexDirection:'column', gap:'8px' },
  menuItem: { background:'#fff', borderRadius:'14px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', transition:'background 0.15s' },
  menuIcon: { width:'40px', height:'40px', borderRadius:'10px', background:'#F8F5EF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 },
  menuInfo: { flex:1 },
  menuLabel: { fontSize:'14px', fontWeight:'700', color:'#1C3D2E', marginBottom:'2px' },
  menuSub: { fontSize:'12px', color:'#A0906E' },
  menuArrow: { fontSize:'20px', color:'#C9C0B0' },
  logoutBtn: { marginTop:'8px', width:'100%', padding:'15px', borderRadius:'12px', border:'1.5px solid #DC2626', background:'transparent', color:'#DC2626', fontWeight:'700', fontSize:'15px', cursor:'pointer', fontFamily:"'Nunito',sans-serif" },
}