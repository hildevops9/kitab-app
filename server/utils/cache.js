/**
 * In-Memory Cache — untuk data yang jarang berubah (kitab list, bab list)
 *
 * Di Vercel serverless, memory di-share selama container masih hidup.
 * Cache ini otomatis expire setelah TTL, jadi data tidak stale selamanya.
 */

const store = new Map()

/**
 * @param {string} key
 * @param {() => Promise<any>} fetcher  — fungsi yang fetch data jika cache miss
 * @param {number} ttlSeconds           — berapa lama cache valid (default 5 menit)
 */
const withCache = async (key, fetcher, ttlSeconds = 300) => {
  const now = Date.now()
  const cached = store.get(key)

  if (cached && now < cached.expiresAt) {
    return cached.data
  }

  const data = await fetcher()
  store.set(key, { data, expiresAt: now + ttlSeconds * 1000 })
  return data
}

/** Hapus cache untuk key tertentu — panggil saat data berubah (create/update/delete) */
const invalidate = (...keys) => {
  keys.forEach(k => store.delete(k))
}

/** Hapus semua cache yang mengandung prefix */
const invalidatePrefix = (prefix) => {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}

module.exports = { withCache, invalidate, invalidatePrefix }