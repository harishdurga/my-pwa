const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
//We specify the urls in the assets
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]
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
    // console.log('fetch event',event);
    // if (!(evt.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
                cache.put(evt.request.url, fetchRes.clone());
                return fetchRes;
            })
            });
        }).catch(err=>{
            if(evt.request.url.indexOf('.html') > -1){
                return caches.match('/pages/fallback.html')
            }
        })
    );
})