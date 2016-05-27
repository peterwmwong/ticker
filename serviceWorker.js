const CACHE_VERSION = 1;
const CACHE_NAME = `static-v${CACHE_VERSION}`;
const INDEX_PATH_NAME = '/dist/';
const CACHE = caches.open(CACHE_NAME);

self.addEventListener('install', (event)=> {
  event.waitUntil(
    CACHE.then((cache)=> cache.addAll([INDEX_PATH_NAME]))
  )
});

self.addEventListener('activate', (event)=> {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event)=> {
  const pathname = new URL(event.request.url).pathname;
  if(pathname === INDEX_PATH_NAME){
    event.respondWith(
      CACHE.then((cache)=> cache.match(pathname))
    );
  }
});
