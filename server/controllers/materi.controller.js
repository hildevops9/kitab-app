const prisma = require('../utils/prisma')

// GET /api/materi/:id — isi materi lengkap
const getMateri = async (req, res) => {
  try {
    const materi = await prisma.materi.findUnique({
      where: { id: req.params.id },
      include: {
        bab: {
          select: {
            id: true, title: true, slug: true, orderNum: true,
            kitab: { select: { id: true, title: true, slug: true, type: true } },
          },
        },
      },
    })
    if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan.' })

    // Ambil prev/next materi dalam bab yang sama
    const [prev, next] = await Promise.all([
      prisma.materi.findFirst({
        where: { babId: materi.babId, orderNum: { lt: materi.orderNum } },
        orderBy: { orderNum: 'desc' },
        select: { id: true, title: true, orderNum: true },
      }),
      prisma.materi.findFirst({
        where: { babId: materi.babId, orderNum: { gt: materi.orderNum } },
        orderBy: { orderNum: 'asc' },
        select: { id: true, title: true, orderNum: true },
      }),
    ])

    // Progress user (kalau sudah login)
    let userProgress = null
    if (req.user) {
      userProgress = await prisma.progress.findUnique({
        where: { userId_materiId: { userId: req.user.id, materiId: materi.id } },
      })
    }

    res.json({ materi, prev, next, isCompleted: userProgress?.isCompleted ?? false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

// POST /api/materi/:id/complete — tandai selesai
const markComplete = async (req, res) => {
  try {
    const progress = await prisma.progress.upsert({
      where: { userId_materiId: { userId: req.user.id, materiId: req.params.id } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId: req.user.id, materiId: req.params.id, isCompleted: true, completedAt: new Date() },
    })
    res.json({ message: 'Materi ditandai selesai.', progress })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getMateri, markComplete }