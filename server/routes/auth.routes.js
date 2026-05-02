const express = require('express')
const router = express.Router()
const { googleAuth, getMe, logout } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')

// Hanya Google OAuth — register & login manual dinonaktifkan
router.post('/google', googleAuth)
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

// Kalau ada yang coba akses register/login manual → tolak
router.post('/register', (req, res) => {
  res.status(403).json({ message: 'Pendaftaran manual tidak tersedia. Gunakan Google Sign-In.' })
})
router.post('/login', (req, res) => {
  res.status(403).json({ message: 'Login manual tidak tersedia. Gunakan Google Sign-In.' })
})

module.exports = router