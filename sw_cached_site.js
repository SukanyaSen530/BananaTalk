const cacheName = "v2";

// Call install event

self.addEventListener("install", (e) => {
  console.log("Service Worker Installed!");
});

// Call install event

self.addEventListener("activate", () => {
  console.log("Service Worker Activated!");

  // Cleanup old cache
  e.waitUntil(
    caches.keys().then((cacheName) => {
      return Promise.all(
        cacheName.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

/**
 * Event listener for the 'fetch' event, triggered whenever a fetch request is made.
 * This attempts to fetch the requested resource from the network, and if successful,
 * it clones the response and caches it. If the network request fails (e.g., offline),
 * it falls back to serving the cached version of the resource.
 *
 * @param {FetchEvent} e - The fetch event triggered by a resource request.
 * @return {Response|Promise} A promise that resolves to a Response object,
 *                            either fetched from the network or from the cache.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event
 */
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching"); // Log message when a fetch request is made

  // Try to fetch the requested resource from the network
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone(); // Clone the response to cache it for later use

        // Open the cache and add the cloned response to it
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone); // Store the response in the cache
        });

        return res; // Return the original response
      })
      .catch((err) =>
        // If network fails (e.g., offline), match the request from the cache
        caches.match(e.request).then((res) => res)
      )
  );
});
