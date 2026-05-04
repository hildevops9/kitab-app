const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const kitabRoutes = require('./routes/kitab.routes')
const babRoutes = require('./routes/bab.routes')
const materiRoutes = require('./routes/materi.routes')
const questionRoutes = require('./routes/question.routes')
const progressRoutes = require('./routes/progress.routes')
const keepAlive      = require('./utils/keepAlive')
const prisma         = require('./utils/prisma') 
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/kitab', kitabRoutes)
app.use('/api/bab', babRoutes)
app.use('/api/materi', materiRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/progress', progressRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server berjalan.' })
})
app.get('/api/warmup', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'warm', ts: Date.now() })
  } catch {
    res.json({ status: 'warm-failed', ts: Date.now() })
  }
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan.' })
})
// Kalau jalan di lokal (bukan di Vercel), app.listen bakal dieksekusi
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
     // Aktifkan keep-alive hanya di production
  if (process.env.NODE_ENV === 'production') keepAlive()
  })
}

// Wajib buat Vercel Serverless
module.exports = app