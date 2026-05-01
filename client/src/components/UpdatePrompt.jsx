// client/src/components/UpdatePrompt.jsx
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div style={s.banner}>
      <span style={s.text}>✨ Versi baru tersedia!</span>
      <button onClick={() => updateServiceWorker(true)} style={s.btn}>
        Perbarui Sekarang
      </button>
    </div>
  )
}

const s = {
  banner: {
    position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 9999,
    background: '#1C3D2E', borderRadius: '14px',
    padding: '14px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
  text: { fontSize: '14px', fontWeight: '600', color: '#F2E8D5' },
  btn: {
    fontSize: '13px', fontWeight: '700',
    background: '#C9A84C', color: '#1C3D2E',
    border: 'none', borderRadius: '8px',
    padding: '8px 14px', cursor: 'pointer',
  },
}