const store = new Map()

const withCache = async (key, fetcher, ttlSeconds = 300) => {
  const now = Date.now()
  const cached = store.get(key)
  if (cached && now < cached.expiresAt) return cached.data
  const data = await fetcher()
  store.set(key, { data, expiresAt: now + ttlSeconds * 1000 })
  return data
}

const invalidate = (...keys) => keys.forEach(k => store.delete(k))

module.exports = { withCache, invalidate }