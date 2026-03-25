// Taha Vault Service Worker — cache-first with update broadcast
const CACHE_NAME = 'taha-vault-v2';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first for navigation (so pull-to-refresh always fetches fresh HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Notify all clients when a new SW takes over
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
