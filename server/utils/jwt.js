const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = '7d'

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })

const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET)

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,     // Tetap true untuk keamanan
    // Wajib TRUE di Vercel karena Vercel otomatis HTTPS. 
    // Jika localhost lo belum HTTPS, ganti sementara ke false atau pakai logic NODE_ENV
    secure: true,       
    // Wajib 'none' agar cookie bisa dikirim antara domain client dan api yang berbeda
    sameSite: 'none',   
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  })
}

module.exports = { signToken, verifyToken, setTokenCookie }