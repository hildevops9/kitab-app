const prisma = require('../utils/prisma')
const { withCache, invalidate } = require('../utils/cache')

const getAllKitab = async (req, res) => {
  try {
    const { type } = req.query
    const userId = req.user?.id
    const cacheKey = `kitabs:${type || 'SEMUA'}:${userId || 'guest'}`

    const result = await withCache(cacheKey, async () => {
      const where = { isPublished: true }
      if (type && type !== 'SEMUA') where.type = type

      const kitabs = await prisma.kitab.findMany({
        where,
        include: {
          _count: { select: { babs: true } },
          babs: { include: { _count: { select: { materis: true } } } }
        },
        orderBy: { createdAt: 'asc' }
      })

      return await Promise.all(kitabs.map(async (k) => {
        const totalMateri = k.babs.reduce((s, b) => s + b._count.materis, 0)
        let completedCount = 0
        let lastRead = null

        if (userId) {
          const materiIds = []
          for (const bab of k.babs) {
            const materis = await prisma.materi.findMany({ where: { babId: bab.id }, select: { id: true } })
            materiIds.push(...materis.map(m => m.id))
          }
          completedCount = await prisma.progress.count({
            where: { userId, materiId: { in: materiIds }, isCompleted: true }
          })
          const lastProgress = await prisma.progress.findFirst({
            where: { userId, materiId: { in: materiIds }, isCompleted: true },
            orderBy: { completedAt: 'desc' },
            include: { materi: { include: { bab: true } } }
          })
          if (lastProgress) {
            lastRead = `${lastProgress.materi.bab.title} : ${lastProgress.materi.title}`
          }
        }

        return {
          id: k.id, slug: k.slug, title: k.title,
          arabicTitle: k.arabicTitle, author: k.author,
          description: k.description, coverColor: k.coverColor,
          type: k.type, totalBab: k._count.babs,
          totalMateri, completedCount, lastRead,
          progressPct: totalMateri > 0 ? Math.round((completedCount / totalMateri) * 100) : 0,
        }
      }))
    }, 120) // cache 2 menit

    res.json({ kitabs: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const getKitabBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const userId = req.user?.id
    const cacheKey = `kitab:${slug}:${userId || 'guest'}`

    const data = await withCache(cacheKey, async () => {
      const kitab = await prisma.kitab.findUnique({
        where: { slug },
        include: {
          babs: {
            include: { _count: { select: { materis: true } } },
            orderBy: { orderNum: 'asc' }
          }
        }
      })

      if (!kitab || !kitab.isPublished) return null

      let completedTotal = 0
      const babsWithProgress = await Promise.all(kitab.babs.map(async (bab) => {
        const materis = await prisma.materi.findMany({ where: { babId: bab.id }, select: { id: true } })
        const materiIds = materis.map(m => m.id)
        let completedBab = 0
        if (userId && materiIds.length > 0) {
          completedBab = await prisma.progress.count({
            where: { userId, materiId: { in: materiIds }, isCompleted: true }
          })
        }
        completedTotal += completedBab
        return {
          id: bab.id, slug: bab.slug, title: bab.title,
          arabicTitle: bab.arabicTitle, orderNum: bab.orderNum,
          totalMateri: bab._count.materis, completedCount: completedBab,
        }
      }))

      const totalMateri = babsWithProgress.reduce((s, b) => s + b.totalMateri, 0)

      return {
        kitab: {
          id: kitab.id, slug: kitab.slug, title: kitab.title,
          arabicTitle: kitab.arabicTitle, author: kitab.author,
          description: kitab.description, coverColor: kitab.coverColor, type: kitab.type,
          totalMateri, completedCount: completedTotal,
          progressPct: totalMateri > 0 ? Math.round((completedTotal / totalMateri) * 100) : 0,
        },
        babs: babsWithProgress,
      }
    }, 120)

    if (!data) return res.status(404).json({ message: 'Kitab tidak ditemukan.' })
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getAllKitab, getKitabBySlug }