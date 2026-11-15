// AegisOS Enterprise Service Worker - Network First with Auto-Purge v3.12.0
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => caches.delete(k)));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Network first: always fetch live from server
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
