const prisma = require('../utils/prisma')

// GET /api/kitab — semua kitab yang published
const getAllKitab = async (req, res) => {
  try {
    const kitabs = await prisma.kitab.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, slug: true, type: true,
        title: true, arabicTitle: true,
        author: true, description: true,
        coverColor: true, coverUrl: true,
        _count: { select: { babs: true } },
      },
    })
    res.json({ kitabs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

// GET /api/kitab/:slug — detail kitab + daftar bab
const getKitabBySlug = async (req, res) => {
  try {
    const kitab = await prisma.kitab.findUnique({
      where: { slug: req.params.slug, isPublished: true },
      include: {
        babs: {
          orderBy: { orderNum: 'asc' },
          select: {
            id: true, slug: true, title: true,
            arabicTitle: true, orderNum: true,
            _count: { select: { materis: true } },
          },
        },
      },
    })
    if (!kitab) return res.status(404).json({ message: 'Kitab tidak ditemukan.' })
    res.json({ kitab })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getAllKitab, getKitabBySlug }