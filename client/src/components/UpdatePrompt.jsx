import { useEffect, useState } from 'react'

export default function UpdatePrompt() {
  const [show, setShow] = useState(false)
  const [worker, setWorker] = useState(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then((reg) => {
      // Cek kalau ada SW baru yang nunggu
      if (reg.waiting) {
        setWorker(reg.waiting)
        setShow(true)
      }

      // Dengarkan kalau ada update masuk
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWorker(newWorker)
            setShow(true)
          }
        })
      })
    })

    // Kalau SW skip waiting, reload halaman
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  const handleUpdate = () => {
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' })
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={s.banner}>
      <span style={s.text}>✨ Versi baru tersedia!</span>
      <button onClick={handleUpdate} style={s.btn}>
        Perbarui
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
    maxWidth: '398px', margin: '0 auto',
  },
  text: { fontSize: '14px', fontWeight: '600', color: '#F2E8D5' },
  btn: {
    fontSize: '13px', fontWeight: '700',
    background: '#C9A84C', color: '#1C3D2E',
    border: 'none', borderRadius: '8px',
    padding: '8px 14px', cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
}