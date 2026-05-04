/**
 * Taruh file ini di: server/utils/keepalive.js
 * Lalu panggil di server/index.js
 * 
 * Fungsi: ping server sendiri setiap 14 menit
 * supaya Vercel tidak sleep (free tier sleep setelah 15 menit idle)
 */

const keepAlive = () => {
  const url = process.env.SERVER_URL || `https://https://bedah-kitab-app.vercel.app`
  
  setInterval(async () => {
    try {
      const res = await fetch(`${url}/api/health`)
      console.log(`[KeepAlive] ${new Date().toISOString()} - status: ${res.status}`)
    } catch (err) {
      console.error('[KeepAlive] Gagal ping:', err.message)
    }
  }, 14 * 60 * 1000) // 14 menit
}

module.exports = keepAlive