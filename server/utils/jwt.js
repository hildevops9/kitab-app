const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = '7d'

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })

const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET)

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,        // tidak bisa diakses JS browser
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  })
}

module.exports = { signToken, verifyToken, setTokenCookie }