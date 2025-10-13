self.addEventListener("install", (event) => {
  self.skipWaiting(); // força atualização imediata
  console.log("🧠 Novo Service Worker instalado!");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  clients.claim(); // aplica sem precisar reiniciar o navegador
  console.log("✅ Service Worker ativo e atualizado!");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
