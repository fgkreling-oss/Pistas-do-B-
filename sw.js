const CACHE = 'pistas-do-be-v2-20261025';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request, url=new URL(req.url);
  if(req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(resp => {
    if(resp.ok) { const copy=resp.clone(); caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{}); }
    return resp;
  }).catch(() => caches.match(req).then(resp=>resp || caches.match('./index.html'))));
});