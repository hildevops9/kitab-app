const prisma = require('../utils/prisma')

const getMateriById = async (req, res) => {
  try {
    const { materiId } = req.params
    const userId = req.user?.id

    const materi = await prisma.materi.findUnique({
      where: { id: materiId },
      include: {
        bab: {
          include: {
            kitab: { select: { id: true, slug: true, title: true, type: true, coverColor: true } },
            materis: { select: { id: true, title: true, orderNum: true }, orderBy: { orderNum: 'asc' } }
          }
        }
      }
    })

    if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan.' })

    let isCompleted = false, isBookmarked = false
    if (userId) {
      const [prog, bm] = await Promise.all([
        prisma.progress.findUnique({ where: { userId_materiId: { userId, materiId } } }),
        prisma.bookmark.findUnique({ where: { userId_materiId: { userId, materiId } } }),
      ])
      isCompleted = prog?.isCompleted ?? false
      isBookmarked = !!bm
    }

    const all = materi.bab.materis
    const idx = all.findIndex(m => m.id === materiId)
    const prev = idx > 0 ? all[idx - 1] : null
    const next = idx < all.length - 1 ? all[idx + 1] : null

    res.json({
      materi: { id: materi.id, title: materi.title, content: materi.content, orderNum: materi.orderNum,
        bab: { id: materi.bab.id, slug: materi.bab.slug, title: materi.bab.title, kitab: materi.bab.kitab }
      },
      isCompleted, isBookmarked, prev, next,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const toggleComplete = async (req, res) => {
  try {
    const { materiId } = req.params
    const userId = req.user.id
    const existing = await prisma.progress.findUnique({ where: { userId_materiId: { userId, materiId } } })
    let prog
    if (existing) {
      prog = await prisma.progress.update({
        where: { userId_materiId: { userId, materiId } },
        data: { isCompleted: !existing.isCompleted, completedAt: !existing.isCompleted ? new Date() : null }
      })
    } else {
      prog = await prisma.progress.create({ data: { userId, materiId, isCompleted: true, completedAt: new Date() } })
    }
    res.json({ isCompleted: prog.isCompleted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const toggleBookmark = async (req, res) => {
  try {
    const { materiId } = req.params
    const userId = req.user.id
    const existing = await prisma.bookmark.findUnique({ where: { userId_materiId: { userId, materiId } } })
    if (existing) {
      await prisma.bookmark.delete({ where: { userId_materiId: { userId, materiId } } })
      return res.json({ isBookmarked: false })
    }
    await prisma.bookmark.create({ data: { userId, materiId } })
    res.json({ isBookmarked: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        materi: {
          select: { id: true, title: true, content: true,
            bab: { select: { id: true, slug: true, title: true,
              kitab: { select: { id: true, slug: true, title: true, coverColor: true, type: true } }
            }}
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ bookmarks: bookmarks.map(b => ({ id: b.id, createdAt: b.createdAt, materi: b.materi })) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

module.exports = { getMateriById, toggleComplete, toggleBookmark, getBookmarks }
