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
          babs: {
            include: {
              materis: { select: { id: true } }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      // Kumpulkan SEMUA materiId sekaligus — 1 query, bukan N query
      const allMateriIds = kitabs.flatMap(k => k.babs.flatMap(b => b.materis.map(m => m.id)))

      // Fetch progress semua materi sekaligus — 1 query
      let progressMap = new Map()
      let lastProgressMap = new Map()
      if (userId && allMateriIds.length > 0) {
        const allProgress = await prisma.progress.findMany({
          where: { userId, materiId: { in: allMateriIds }, isCompleted: true },
          select: { materiId: true, completedAt: true },
          orderBy: { completedAt: 'desc' }
        })
        allProgress.forEach(p => {
          progressMap.set(p.materiId, true)
        })

        // Last read per kitab
        const allProgressWithMateri = await prisma.progress.findMany({
          where: { userId, materiId: { in: allMateriIds }, isCompleted: true },
          orderBy: { completedAt: 'desc' },
          include: { materi: { select: { title: true, bab: { select: { title: true } } } } }
        })
        // Group by kitab
        kitabs.forEach(k => {
          const kitabMateriIds = new Set(k.babs.flatMap(b => b.materis.map(m => m.id)))
          const last = allProgressWithMateri.find(p => kitabMateriIds.has(p.materiId))
          if (last) {
            lastProgressMap.set(k.id, k.type === 'HIKAM'
              ? last.materi.title
              : `${last.materi.bab.title} : ${last.materi.title}`
            )
          }
        })
      }

      return kitabs.map(k => {
        const kitabMateriIds = k.babs.flatMap(b => b.materis.map(m => m.id))
        const totalMateri = kitabMateriIds.length
        const completedCount = kitabMateriIds.filter(id => progressMap.has(id)).length
        const lastRead = lastProgressMap.get(k.id) || null

        return {
          id: k.id, slug: k.slug, title: k.title,
          arabicTitle: k.arabicTitle, author: k.author,
          description: k.description, coverColor: k.coverColor,
          type: k.type, totalBab: k._count.babs,
          totalMateri, completedCount, lastRead,
          progressPct: totalMateri > 0 ? Math.round((completedCount / totalMateri) * 100) : 0,
        }
      })
    }, 120)

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
            include: { materis: { select: { id: true } } },
            orderBy: { orderNum: 'asc' }
          }
        }
      })

      if (!kitab || !kitab.isPublished) return null

      // Semua materiId kitab ini — 1 query
      const allMateriIds = kitab.babs.flatMap(b => b.materis.map(m => m.id))

      let progressSet = new Set()
      if (userId && allMateriIds.length > 0) {
        const allProgress = await prisma.progress.findMany({
          where: { userId, materiId: { in: allMateriIds }, isCompleted: true },
          select: { materiId: true }
        })
        progressSet = new Set(allProgress.map(p => p.materiId))
      }

      let completedTotal = 0
      const babsWithProgress = kitab.babs.map(bab => {
        const babMateriIds = bab.materis.map(m => m.id)
        const completedBab = babMateriIds.filter(id => progressSet.has(id)).length
        completedTotal += completedBab
        return {
          id: bab.id, slug: bab.slug, title: bab.title,
          arabicTitle: bab.arabicTitle, orderNum: bab.orderNum,
          totalMateri: babMateriIds.length, completedCount: completedBab,
        }
      })

      const totalMateri = allMateriIds.length
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


const getKitabMateris = async (req, res) => {
  try {
    const { slug } = req.params
    const userId = req.user?.id

    const kitab = await prisma.kitab.findUnique({
      where: { slug },
      include: {
        babs: {
          orderBy: { orderNum: 'asc' },
          include: {
            materis: {
              orderBy: { orderNum: 'asc' },
              select: { id: true, title: true, orderNum: true, content: true }
            }
          }
        }
      }
    })

    if (!kitab || !kitab.isPublished)
      return res.status(404).json({ message: 'Kitab tidak ditemukan.' })

    // Flatten semua materi dari semua bab
    const allMateris = kitab.babs.flatMap(b => b.materis)
    const allMateriIds = allMateris.map(m => m.id)

    let progressSet = new Set()
    if (userId && allMateriIds.length > 0) {
      const progress = await prisma.progress.findMany({
        where: { userId, materiId: { in: allMateriIds }, isCompleted: true },
        select: { materiId: true }
      })
      progressSet = new Set(progress.map(p => p.materiId))
    }

    const completedCount = allMateriIds.filter(id => progressSet.has(id)).length

    res.json({
      kitab: {
        id: kitab.id, slug: kitab.slug, title: kitab.title,
        arabicTitle: kitab.arabicTitle, author: kitab.author,
        coverColor: kitab.coverColor, type: kitab.type,
        totalMateri: allMateriIds.length, completedCount,
        progressPct: allMateriIds.length > 0 ? Math.round((completedCount / allMateriIds.length) * 100) : 0,
      },
      materis: allMateris.map(m => ({ ...m, isCompleted: progressSet.has(m.id) }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getAllKitab, getKitabBySlug, getKitabMateris }