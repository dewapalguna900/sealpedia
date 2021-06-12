const CACHE_NAME = "sealpedia-v5";
const urlsToCache = [
    "/",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/classes.html",
    "/pages/contact.html",
    "/pages/maps.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/register_sw.js",
    "/assets/data/classes.json",
    "/assets/img/profil.jpg",
    "/assets/img/seal_banner.jpg",
    "/assets/img/seal_cleric.jpg",
    "/assets/img/seal_clown.jpg",
    "/assets/img/seal_craftsman.jpg",
    "/assets/img/seal_elim.gif",
    "/assets/img/seal_hunter.jpg",
    "/assets/img/seal_knight.jpg",
    "/assets/img/seal_lime.gif",
    "/assets/img/seal_logo.png",
    "/assets/img/seal_madelin.gif",
    "/assets/img/seal_magician.jpg",
    "/assets/img/seal_sevis.gif",
    "/assets/img/seal_warrior.jpg",
    "/assets/img/seal_zaid.gif",
    "/seal_icon_512.png",
    "/seal_icon_192.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    )
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
            .match(event.request, { cacheName: CACHE_NAME })
            .then(function (response) {
                if (response) {
                    console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                    return response;
                }

                console.log(
                    "ServiceWorker: Memuat aset dari server: ",
                    event.request.url
                );
                return fetch(event.request);
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});