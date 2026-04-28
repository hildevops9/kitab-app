const { verifyToken } = require('../utils/jwt')
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
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return res.status(403).json({ message: 'Akses ditolak.' })
  next()
}
module.exports = { protect, restrictTo }
