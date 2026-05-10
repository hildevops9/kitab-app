const { verifyToken } = require('../utils/jwt')

// Wajib login
const protect = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Silakan login terlebih dahulu.' })
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Sesi tidak valid atau sudah berakhir.' })
  }
}

// Opsional — guest boleh lewat, kalau ada token tetap di-parse
const optionalProtect = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) { req.user = null; return next() }
  try { req.user = verifyToken(token) } catch { req.user = null }
  next()
}

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return res.status(403).json({ message: 'Akses ditolak.' })
  next()
}

module.exports = { protect, optionalProtect, restrictTo }