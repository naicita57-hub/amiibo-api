let cacheName = "cache";
let cacheDynamic = "cache2";

self.addEventListener("install", (e) => {
  console.log("installed", e);
//   e.waitUntil(
//     caches.open(cacheName).then((cache) => {
//       cache.addAll([
//         "index.html",
//         "css/style.css",
//         "imagenes/banner.png",
//         "imagenes/logo.svg",
//       ]);
//     })
//   );
});

self.addEventListener("activate", (e) => {
  console.log("El sw is working", e);
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response;
      }
      let requestToCache = e.request.clone();
      return fetch(requestToCache)
        .then(
            function (response){
                if(!response || response.status !==200){
                    return response;
                }

                let responseToCache = response.clone();
                caches.open(cacheDynamic)
                    .then((cache) => {
                        cache.put(requestToCache, responseToCache)
                    })
                return response;
            }
        )

    //   return fetch(e.request);
    })
  );
});
