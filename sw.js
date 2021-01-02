const staticCacheName = 'site-static-v12';
const dynamicCacheName = 'site-dynamic-v5';
//We specify the urls in the assets
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/db.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
      cache.keys().then(keys => {
        if(keys.length > size){
          cache.delete(keys[0]).then(limitCacheSize(name, size));
        }
      });
    });
  };


//Install service worker
//Here self represents the service worker itself
self.addEventListener("install",event=>{
    // console.log("service worker has been installed");
    //So that the install event won't be completed till the caching of assets is completed
    event.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            console.log('Caching app shell assets');
            cache.addAll(assets)
        })
    );
    
})
self.addEventListener('activate',event=>{
    // console.log("service worker has been activated");
    event.waitUntil(
        caches.keys().then(keys => {
          //console.log(keys);
          return Promise.all(keys
            .filter(key => key !== staticCacheName && key !== dynamicCacheName)
            .map(key => caches.delete(key))
          );
        })
      );
})
//Fetch event
self.addEventListener('fetch',evt=>{
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
          caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
              return caches.open(dynamicCacheName).then(cache => {
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              })
            });
          }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1){
              return caches.match('/pages/fallback.html');
            }
          })
        );
      }
})