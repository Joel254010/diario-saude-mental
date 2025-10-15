self.addEventListener("install", (event) => {
  self.skipWaiting(); // força instalação imediata
  console.log("🧠 Novo Service Worker instalado!");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key))) // limpa todos os caches antigos
    )
  );
  self.clients.claim(); // aplica imediatamente para todos os clientes
  console.log("✅ Service Worker ativo e atualizado!");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)) // fallback em caso de falha
  );
});
