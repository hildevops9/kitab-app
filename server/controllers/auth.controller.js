const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const prisma = require('../utils/prisma')
const { signToken, setTokenCookie } = require('../utils/jwt')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' })
    if (password.length < 8)
      return res.status(400).json({ message: 'Password minimal 8 karakter.' })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email sudah terdaftar.' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, passwordHash } })
    const token = signToken({ id: user.id, role: user.role })
    setTokenCookie(res, token)
    res.status(201).json({
      message: 'Registrasi berhasil.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email dan password wajib diisi.' })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash)
      return res.status(401).json({ message: 'Email atau password salah.' })
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(401).json({ message: 'Email atau password salah.' })
    const token = signToken({ id: user.id, role: user.role })
    setTokenCookie(res, token)
    res.json({
      message: 'Login berhasil.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return res.status(400).json({ message: 'Google ID token diperlukan.' })

    // 1. Verifikasi token ke Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const { sub: googleId, email, name, picture } = ticket.getPayload()

    // 2. Cari user berdasarkan googleId dulu
    let user = await prisma.user.findUnique({ where: { googleId } })

    if (user) {
      // Sudah pernah login Google → update nama & avatar saja
      user = await prisma.user.update({
        where: { googleId },
        data: { name, avatarUrl: picture },
      })
    } else {
      // 3. Belum ada googleId → cek apakah email sudah terdaftar (akun email/password)
      const existingByEmail = await prisma.user.findUnique({ where: { email } })

      if (existingByEmail) {
        // Akun email sudah ada → link googleId ke akun tersebut
        user = await prisma.user.update({
          where: { email },
          data: { googleId, avatarUrl: existingByEmail.avatarUrl ?? picture },
        })
      } else {
        // Benar-benar user baru → buat akun baru
        user = await prisma.user.create({
          data: { googleId, email, name, avatarUrl: picture },
        })
      }
    }

    const token = signToken({ id: user.id, role: user.role })
    setTokenCookie(res, token)
    res.json({
      message: 'Login Google berhasil.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    })
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: 'Token Google tidak valid.' })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    })
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.json({ message: 'Logout berhasil.' })
}

module.exports = { register, login, googleAuth, getMe, logout }