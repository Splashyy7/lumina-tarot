// Lumina Tarot Service Worker (Offline Cache & Shell)
const CACHE_NAME = 'lumina-tarot-v2.0';

const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './robots.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS).catch((err) => {
        console.warn('Pre-caching offline assets notice:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip external API / worker requests from caching
  if (event.request.method !== 'GET' || event.request.url.includes('workers.dev') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Fetch background update
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
