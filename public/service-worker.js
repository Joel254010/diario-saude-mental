self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("diario-saude-cache-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/manifest.json"]);
    })
  );
  console.log("🧘‍♀️ Service Worker instalado!");
});

self.addEventListener("activate", (event) => {
  console.log("✨ Service Worker ativo!");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
