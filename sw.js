// Simple Service Worker for PWA compliance
const CACHE_NAME = 'taha-vault-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy (network only for now)
  event.respondWith(fetch(event.request));
});
