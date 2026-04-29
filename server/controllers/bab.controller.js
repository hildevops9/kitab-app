const prisma = require('../utils/prisma')

// GET /api/bab/:kitabSlug/:babSlug — detail bab + list materi
const getBab = async (req, res) => {
  try {
    const { kitabSlug, babSlug } = req.params

    const kitab = await prisma.kitab.findUnique({
      where: { slug: kitabSlug, isPublished: true },
      select: { id: true, title: true, type: true },
    })
    if (!kitab) return res.status(404).json({ message: 'Kitab tidak ditemukan.' })

    const bab = await prisma.bab.findUnique({
      where: { kitabId_slug: { kitabId: kitab.id, slug: babSlug } },
      include: {
        materis: {
          orderBy: { orderNum: 'asc' },
          select: {
            id: true, title: true, orderNum: true,
          },
        },
      },
    })
    if (!bab) return res.status(404).json({ message: 'Bab tidak ditemukan.' })

    res.json({ kitab, bab })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getBab }