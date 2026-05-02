import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { key: 'home',     label: 'Beranda',  path: '/home',     icon: HomeIcon },
  { key: 'kitab',    label: 'Kitab',    path: '/kitab',    icon: KitabIcon },
  { key: 'bookmark', label: 'Bookmark', path: '/bookmark', icon: BookmarkIcon },
  { key: 'catatan',  label: 'Catatan',  path: '/catatan',  icon: CatatanIcon },
  { key: 'akun',     label: 'Akun',     path: '/akun',     icon: AkunIcon },
]

function HomeIcon({ active, color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function KitabIcon({ active, color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}

function BookmarkIcon({ active, color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function CatatanIcon({ active, color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

function AkunIcon({ active, color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? color : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function BottomNav({ active }) {
  const navigate = useNavigate()
  const location = useLocation()
  const current = active || tabs.find(t => location.pathname.startsWith(t.path))?.key || 'home'

  return (
    <nav style={s.nav}>
      {tabs.map(tab => {
        const isActive = tab.key === current
        const color = '#1C3D2E'
        const Icon = tab.icon
        return (
          <button key={tab.key} onClick={() => navigate(tab.path)} style={s.tab}>
            <div style={{ ...s.iconWrap, ...(isActive ? s.iconWrapActive : {}) }}>
              <Icon active={isActive} color={color} />
            </div>
            <span style={{ ...s.label, ...(isActive ? { color, fontWeight: '700' } : {}) }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

const s = {
  nav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    width: '100%', background: '#fff', borderTop: '1px solid #F0EBE0',
    display: 'flex', alignItems: 'stretch',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  tab: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '3px', padding: '8px 4px 6px',
    background: 'none', border: 'none', cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  iconWrap: { width: '36px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' },
  iconWrapActive: { background: 'rgba(28,61,46,0.08)' },
  label: { fontSize: '10px', color: '#9CA3AF', fontFamily: "'Nunito', sans-serif", fontWeight: '600' },
}