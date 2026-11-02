let cacheName = "cache";
let cacheDynamic = "cache2";

self.addEventListener('install', (e) => {
    console.log('el SW se instalo ', e);
});

self.addEventListener('activate', (e) => {
    console.log('El SW se ha activado ', e);
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then( (response) => {
                if(response){
                    return response;
                }
                let requestToCache = e.request.clone();
                return fetch(requestToCache)
                    .then(
                        function (response){
                            if(!response || response.status !== 200){
                                return response;
                            }

                            let responseToCache = response.clone()
                            caches.open(cacheDynamic)
                                .then( (cache) => {
                                    cache.put(requestToCache, responseToCache)
                                })
                            return response;
                        }
                    )


               // return fetch(e.request)

            })
    )
});

self.addEventListener('push', (e) => {
    console.log(e);

    let title = 'Demo de la push';

    options = {
        body: "Click para regresar a la app",
        icon: 'imagenes/logo.svg',
        vibrate: [100, 50, 100],
        data: {id: 1},
        actions: [
            {
                'action': 'Si',
                'title': 'Me gusta la app',
                'icon': 'imagenes/nai-mii.png'
            },
            {
                'action': 'No',
                'title': 'No me gusta la app',
                'icon': 'imagenes/mii-triste.webp'
            }
        ]
    }

    e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationClick', (e) => {
    console.log(e);
    if(e.action === 'Si'){
        clients.openWindows('https://amiibo-api-two.vercel.app/');
        console.log(clients);
    }else if (e.actions === 'No'){
        console.log('No le gustó, definitivamente')
    }

    e.notification.close();
});