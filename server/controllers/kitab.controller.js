const prisma = require('../utils/prisma')
const { withCache, invalidate, invalidatePrefix } = require('../utils/cache')

// Cache keys
const CACHE_KITABS       = 'kitabs:published'
const CACHE_KITABS_ALL   = 'kitabs:all'
const cacheKitabId = (id) => `kitab:${id}`

// GET /api/kitab — list semua kitab yang published
const getKitabs = async (req, res) => {
  try {
    const kitabs = await withCache(CACHE_KITABS, () =>
      prisma.kitab.findMany({
        where: { isPublished: true },
        select: {
          id: true, slug: true, title: true, arabicTitle: true,
          author: true, description: true, coverColor: true,
          coverUrl: true, type: true, isPublished: true, createdAt: true,
          _count: { select: { babs: true } },
        },
        orderBy: { createdAt: 'asc' },
      }), 300) // cache 5 menit

    // HTTP cache header — browser & CDN cache 60 detik
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json({ kitabs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/kitab/all — semua kitab (admin)
const getAllKitabs = async (req, res) => {
  try {
    const kitabs = await withCache(CACHE_KITABS_ALL, () =>
      prisma.kitab.findMany({
        select: {
          id: true, slug: true, title: true, arabicTitle: true,
          author: true, description: true, coverColor: true,
          coverUrl: true, type: true, isPublished: true, createdAt: true,
          _count: { select: { babs: true } },
        },
        orderBy: { createdAt: 'asc' },
      }), 300)

    res.set('Cache-Control', 'private, max-age=30')
    res.json({ kitabs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/kitab/:slug
const getKitabById = async (req, res) => {
  try {
    const { id } = req.params // bisa slug atau id
    const cacheKey = cacheKitabId(id)

    const kitab = await withCache(cacheKey, () =>
      prisma.kitab.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          babs: {
            orderBy: { orderNum: 'asc' },
            include: { _count: { select: { materis: true } } },
          },
        },
      }), 300)

    if (!kitab) return res.status(404).json({ message: 'Kitab tidak ditemukan.' })

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json(kitab)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/kitab (admin)
const createKitab = async (req, res) => {
  try {
    const { title, author, description, coverUrl, coverColor, arabicTitle, slug, type } = req.body
    if (!title || !author) return res.status(400).json({ message: 'Title dan author wajib diisi.' })

    const kitab = await prisma.kitab.create({
      data: { title, author, description, coverUrl, coverColor, arabicTitle, slug, type },
    })

    // Invalidate cache setelah ada data baru
    invalidate(CACHE_KITABS, CACHE_KITABS_ALL)
    res.status(201).json(kitab)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/kitab/:id (admin)
const updateKitab = async (req, res) => {
  try {
    const { title, author, description, coverUrl, coverColor, arabicTitle, isPublished } = req.body
    const kitab = await prisma.kitab.update({
      where: { id: req.params.id },
      data: { title, author, description, coverUrl, coverColor, arabicTitle, isPublished },
    })

    invalidate(CACHE_KITABS, CACHE_KITABS_ALL, cacheKitabId(req.params.id))
    res.json(kitab)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/kitab/:id (admin)
const deleteKitab = async (req, res) => {
  try {
    await prisma.kitab.delete({ where: { id: req.params.id } })
    invalidate(CACHE_KITABS, CACHE_KITABS_ALL, cacheKitabId(req.params.id))
    res.json({ message: 'Kitab berhasil dihapus.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getKitabs, getAllKitabs, getKitabById, createKitab, updateKitab, deleteKitab }