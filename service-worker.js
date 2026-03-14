/**
 * MAHESH MALI PLATFORM — Service Worker
 * Provides offline support and caching for PWA functionality
 */

const CACHE_NAME  = 'mahesh-platform-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/style.css',
  '/admin.css',
  '/script.js',
  '/admin.js',
  '/manifest.json'
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => {
        return new Request(url, { cache: 'reload' });
      })).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs (API calls, CDN fonts, etc.)
  if (request.method !== 'GET') return;
  if (!url.origin.includes(self.location.origin)) {
    // For external resources: network first, no caching
    return;
  }

  // Strategy: Cache First (with network fallback) for static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Offline fallback: return index.html for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

/* ── BACKGROUND SYNC (optional) ── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-leads') {
    console.log('[SW] Background sync: leads');
    // Could sync pending leads to Google Sheets here
  }
});
