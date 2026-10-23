/*
 * Service worker de Respira Libre
 * - Páginas: primero la red (así siempre llega la última versión) y, sin conexión, la copia guardada
 * - /assets/* (con hash en el nombre, no cambian): primero la caché
 * - Resto de archivos propios: copia guardada al instante y se actualiza en segundo plano
 * - Notificaciones: al pulsar una, se abre o enfoca la app
 */
// v2: la fuente Inter ya no viene de Google Fonts; al activar se borra la caché v1
const CACHE = 'respira-libre-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/body.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const putInCache = async (request, response) => {
  if (response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

const networkFirst = async (request) => {
  try {
    return await putInCache(request, await fetch(request));
  } catch {
    return (await caches.match(request)) ?? (await caches.match('/'));
  }
};

const cacheFirst = async (request) =>
  (await caches.match(request)) ?? putInCache(request, await fetch(request));

const staleWhileRevalidate = async (request) => {
  const cached = await caches.match(request);
  const network = fetch(request).then(response => putInCache(request, response)).catch(() => cached);
  return cached ?? network;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const client = clients.find(c => new URL(c.url).origin === self.location.origin);
      return client ? client.focus() : self.clients.openWindow('/');
    })
  );
});
