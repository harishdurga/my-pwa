//Install service worker
//Here self represents the service worker itself
self.addEventListener("install",event=>{
    console.log("service worker has been installed");
})
self.addEventListener('activate',event=>{
    console.log("service worker has been activated");
})
//Fetch event
self.addEventListener('fetch',event=>{
    console.log('fetch event',event);
})