// Service Worker - Cache slides & images for 1 year
const CACHE_NAME = 'slide-cache-v1';
const MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 năm

// Cache các file quan trọng khi install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Intercept fetch - cache images & slide HTML
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Chỉ cache các resource cục bộ (cùng origin)
  if (url.origin !== location.origin) return;
  
  // Cache ảnh (png, jpg, webp, svg) và slide HTML
  const shouldCache =
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i) ||
    url.pathname.match(/\/slides\/slide-\d+\.html$/i) ||
    url.pathname.match(/\.(css|js|woff2?|ttf)$/i) ||
    url.pathname.endsWith('/logo.png');

  if (shouldCache) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) {
            // Trả về cache ngay, đồng thời cập nhật nền
            const fetchPromise = fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => cached);
            return cached;
          }
          // Chưa có cache → fetch và lưu
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
  }
});
