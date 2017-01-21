const CACHE_VERSION = 19;
const CACHE_NAME = `static-v${CACHE_VERSION}`;
const CACHED_PATH_NAMES = [
  '/outfit-knockout/dist/',
  '/outfit-knockout/dist/App.min.js'
]
const CACHE = caches.open(CACHE_NAME);

self.addEventListener('install', event => {
  event.waitUntil(
    CACHE.then(cache => cache.addAll(CACHED_PATH_NAMES))
  )
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const pathname = new URL(event.request.url).pathname;
  if(CACHED_PATH_NAMES.indexOf(pathname) !== -1){
    event.respondWith(
      CACHE.then(cache => cache.match(pathname))
    );
  }
});
