const CACHE_NAME = "calculadora-v1";

const FILES_TO_CACHE = [
  "/Public/",
  "/Public/index.html",
  "/Public/style.css",
  "/Public/manifest.json"
];

// Instalación
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Archivos cacheados");
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((error) => {
        console.error("[SW] Error al cachear archivos:", error);
      })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Eliminando caché antiguo:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptar requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error("[SW] Error en fetch:", error);
      })
  );
});