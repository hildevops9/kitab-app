const prisma = require('../utils/prisma')

const getMateriByBab = async (req, res) => {
  try {
    const { kitabSlug, babSlug } = req.params
    const userId = req.user?.id

    const kitab = await prisma.kitab.findUnique({ where: { slug: kitabSlug } })
    if (!kitab || !kitab.isPublished)
      return res.status(404).json({ message: 'Kitab tidak ditemukan.' })

    const bab = await prisma.bab.findUnique({
      where: { kitabId_slug: { kitabId: kitab.id, slug: babSlug } },
      include: {
        materis: { orderBy: { orderNum: 'asc' }, select: { id: true, title: true, orderNum: true, content: true } }
      }
    })

    if (!bab) return res.status(404).json({ message: 'Bab tidak ditemukan.' })

    let completedIds = new Set()
    if (userId) {
      const progress = await prisma.progress.findMany({
        where: { userId, materiId: { in: bab.materis.map(m => m.id) }, isCompleted: true },
        select: { materiId: true }
      })
      completedIds = new Set(progress.map(p => p.materiId))
    }

    res.json({
      kitab: { id: kitab.id, slug: kitab.slug, title: kitab.title, type: kitab.type, coverColor: kitab.coverColor },
      bab: { id: bab.id, slug: bab.slug, title: bab.title, arabicTitle: bab.arabicTitle },
      materis: bab.materis.map(m => ({ ...m, isCompleted: completedIds.has(m.id) })),
      completedCount: completedIds.size,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getMateriByBab }
