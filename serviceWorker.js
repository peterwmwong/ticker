const CACHE_VERSION = 1;
const CACHE_NAME = `static-v${CACHE_VERSION}`;

self.addEventListener('install', (event)=> {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache)=> cache.addAll(['/dist/']))
  )
});

self.addEventListener('activate', (event)=> {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event)=> {
  const pathname = new URL(event.request.url).pathname;
  if(pathname === '/dist/'){
    event.respondWith(
      caches.open(CACHE_NAME).then((cache)=>
        cache.match(pathname)
      )
    );
  }
});
