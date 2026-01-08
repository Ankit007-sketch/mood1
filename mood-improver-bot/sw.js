const CACHE_NAME = 'mood-improver-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './styles.min.css',
  './script.js',
  './script.min.js',
  './data.json',
  './manifest.json',
  './favicon.svg',
  './og-image.svg'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(resp=>{
    if(resp) return resp;
    return fetch(e.request).then(fetchResp=>{
      return caches.open(CACHE_NAME).then(cache=>{
        cache.put(e.request, fetchResp.clone());
        return fetchResp;
      });
    }).catch(()=>{
      // fallback to cached index
      return caches.match('./index.html');
    });
  }));
});
