const CACHE_NAME = 'kitab-app-v1'

// File yang di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate — hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch strategy:
// - API calls (/api/*) → Network only (selalu fresh dari server)
// - Static assets → Cache first, fallback network
// - Navigasi → Network first, fallback cache (index.html)
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Jangan cache API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request))
    return
  }

  // Navigasi (HTML) → network first, fallback index.html dari cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html')
      )
    )
    return
  }

  // Static assets → cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        // Cache response baru
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})