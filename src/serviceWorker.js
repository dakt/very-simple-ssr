const CACHE_NAME = 'pwa-cache';
const urlsToCache = [
    '/',
    '/styles.css',
    '/vendors~bundle.js',
    '/bundle.js',
];

/*
 * Invoked on first download or when downloaded file is 
 * found to be new byte-wise.
 */
self.addEventListener('install', event => {
    
    console.log('Installing service worker');

    // event.waitUntil(
    //     caches.open(CACHE_NAME)
    //         .then(cache => {
    //             return cache.addAll(urlsToCache);
    //         })
    // );    
});

self.addEventListener('activate', (event) => {
    console.log('Active:', event);
});

self.addEventListener('fetch', (event) => {

    /* Ignore non-GET requests */
    if (event.request.method !== 'GET') return;

    event.respondWith(new Promise((resolve) => {

        const cache = caches.open(CACHE_NAME).then((cache) => {
            cache.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('FROM CACHE', event.request.url);
                    event.waitUntil(cache.add(event.request));
                    resolve(cachedResponse);
                } else {
                    console.log('NEED TO CACHE');
                    // IMPORTANT: Clone the request. A request is a stream and
                    // can only be consumed once. Since we are consuming this
                    // once by cache and once by the browser for fetch, we need
                    // to clone the response.
                    const fetchRequest = event.request.clone();

                    resolve(fetch(fetchRequest).then((response) => {

                        console.log('GOT DATA FOR', event.request.url);

                        // Check if we received a valid response
                        // if (!response || response.status !== 200 || response.type !== 'basic') {
                        //     return response;
                        // }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = response.clone();
                        cache.put(event.request, responseToCache);

                        console.log(cache);

                        return response;
                    }));
                }
            });
        });
    }));

});