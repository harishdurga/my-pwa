const staticCacheName = 'site-static'
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
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
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
})
//Fetch event
self.addEventListener('fetch',event=>{
    // console.log('fetch event',event);
    event.respondWith(
        caches.match(event.request).then(cacheRes=>{
            //We are checking if the requested resource is in the cache else we will just return a fetch operation to the server
            return cacheRes || fetch(event.request)
        })
    )
})