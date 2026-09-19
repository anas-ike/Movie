<<<<<<< ours
const CACHE='lightsout-static-v1';const ASSETS=['/','/css/app.css','/css/components.css','/css/player.css','/css/responsive.css','/js/app.js','/images/logo.svg','/images/placeholder-poster.svg'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('fetch',e=>{if(new URL(e.request.url).origin===location.origin&&['style','script','image'].includes(e.request.destination))e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
=======
const CACHE = 'lightsout-static-v3';
const ASSETS = ['/css/app.css', '/css/components.css', '/css/player.css', '/css/responsive.css', '/js/app.js', '/images/logo.svg', '/images/placeholder-poster.svg'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => { const url = new URL(event.request.url); if (url.origin === location.origin && ['style', 'script', 'image'].includes(event.request.destination)) event.respondWith(fetch(event.request).catch(() => caches.match(event.request))); });
>>>>>>> theirs
