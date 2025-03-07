/**
 * The name of the cache storage version.
 * @constant
 */
const cacheName = "v1";

/**
 * Array of files to be cached for offline access.
 * @constant
 */
const cachedFiles = ["index.html", "index.js", "index.css"];

/**
 * Event listener for the 'install' event, triggered when the service worker is first installed.
 * This caches the specified files for offline use.
 *
 * @param {InstallEvent} e - The install event triggered during the installation of the service worker.
 * @return {Promise} Resolves when the installation process completes and caching is done.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event
 */
self.addEventListener("install", (e) => {
  console.log("Service Worker Installed!"); // Log message when the service worker is installed

  // Wait until the files are cached before finishing the installation
  e.waitUntil(
    caches
      .open(cacheName) // Open (or create) a cache with the specified cache name
      .then((cache) => {
        console.log("Service Worker Caching Files"); // Log message to indicate caching of files
        return cache.addAll(cachedFiles); // Cache the specified files
      })
      .then(() => self.skipWaiting()) // Skip the waiting phase and activate the service worker immediately
  );
});

/**
 * Event listener for the 'activate' event, triggered when the service worker is activated.
 * This is used to clean up any old caches that are no longer needed.
 *
 * @param {ActivateEvent} e - The activate event triggered when the service worker becomes active.
 * @return {Promise} Resolves once the old caches are cleaned up.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event
 */
self.addEventListener("activate", (e) => {
  console.log("Service Worker Activated!"); // Log message when the service worker is activated

  // Wait until old caches are cleaned up
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      // Loop through all cache names and delete outdated caches
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            // If the cache name does not match the current cache version
            return caches.delete(cache); // Delete the outdated cache
          }
        })
      );
    })
  );
});

/**
 * Event listener for the 'fetch' event, triggered whenever a fetch request is made.
 * It attempts to fetch the requested resource from the network, and falls back to the cache if the network request fails.
 *
 * @param {FetchEvent} e - The fetch event triggered by a resource request.
 * @return {Response|Promise} A promise that resolves to a Response object, either from the network or cache.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event
 */
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching"); // Log message when a fetch request is made

  // Try fetching from the network, if it fails, respond with the cached resource
  e.respondWith(
    fetch(e.request) // Try to fetch the resource from the network
      .catch(() => caches.match(e.request)) // If network request fails (e.g., offline), return the cached version
  );
});
