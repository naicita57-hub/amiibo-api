let cachecitoEstatico = "cache-estatico";
let cachecitoDinamico = "cache-dinamico";
const archivos = [
    "./",
    "index.html",
    "favs.html",
    "manifest.json",
    "css/styles.css",
    "js/script.js",
    "js/api.js",
    "js/favoritos.js",
    "js/app.js",
    "imagenes/logo.svg",
    "imagenes/per-iz.png",
    "imagenes/per-der.png",
    "imagenes/eurogamer-wallpaper.webp",
    "imagenes/gifwarning.webp",
    "imagenes/andrea-mii.png",
    "imagenes/nai-mii.png",
    "imagenes/mii-triste.webp",
    "imagenes/favicon-16x16.png",
    "imagenes/favicon-32x32.png",
    "imagenes/favicon-96x96.png",
    "imagenes/favicon-144x144.png",
    "imagenes/apple-touch-icon.png",
    "imagenes/android-chrome-192x192.png",
    "imagenes/android-chrome-512x512.png",
];
const archivosExternos = [
    "https://cdn.tailwindcss.com",
    "https://fonts.googleapis.com/css2?family=Commissioner:wght@400;600;700;800&display=swap",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(cachecitoEstatico)
            .then((cache) => cache.addAll(archivos))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response;
            }
            let requestToCache = e.request.clone();
            return fetch(requestToCache)
                .then(function (response) {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    let responseToCache = response.clone();
                    caches.open(cachecitoDinamico)
                        .then((cache) => {
                            cache.put(requestToCache, responseToCache);
                        });
                    return response;
                });
        })
    );
});

self.addEventListener("push", (e) => {
    console.log(e);
    let title = "Arg Amiibo";
    options = {
        body: "¡Descubrí nuevas figuras Amiibo en el catálogo!",
        icon: "imagenes/logo.svg",
        vibrate: [100, 50, 100],
        data: { id: 1 },
        actions: [
            {
                action: "Si",
                title: "Ver catálogo",
                icon: "imagenes/nai-mii.png",
            },
            {
                action: "No",
                title: "Cerrar",
                icon: "imagenes/mii-triste.webp",
            },
        ],
    };

    e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (e) => {
    console.log(e);
    if (e.action === "Si") {
        clients.openWindow("https://amiibo-api-two.vercel.app/");
    } else if (e.action === "No") {
        console.log("No le gustó, definitivamente");
    }

    e.notification.close();
});
