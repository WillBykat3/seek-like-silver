// Seek Like Silver service worker: lets the site be installed and keeps studying possible offline.
//
// - The site's own files: network first (so a new version shows up right away), with the
//   last copy used when offline.
// - Fonts and the Supabase code library: served from the saved copy, refreshed in the background.
// - Sign-in, saving answers, groups and verse text always go to the network (never cached here).
//
// Bump VERSION when this file's list changes; old caches are cleaned up automatically.
const VERSION = "sls-v1";
const SHELL = [
  "./", "index.html", "privacy.html", "styles.css",
  "config.js", "questions.js", "library.js", "glossary.js", "richtext.js", "icons.js", "app.js",
  "logo.svg", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "site.webmanifest",
];
const STATIC_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("sls-") && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const saved = await cache.match(request, { ignoreSearch: true });
    if (saved) return saved;
    // Any page address (#q=…, #answers, …) can be served by the saved home page.
    if (request.mode === "navigate") {
      const home = await cache.match("index.html");
      if (home) return home;
    }
    throw err;
  }
}

async function savedThenRefresh(request) {
  const cache = await caches.open(VERSION);
  const saved = await cache.match(request);
  const refresh = fetch(request).then((res) => {
    if (res.ok || res.type === "opaque") cache.put(request, res.clone());
    return res;
  }).catch(() => saved);
  return saved || refresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
  } else if (STATIC_HOSTS.includes(url.hostname)) {
    event.respondWith(savedThenRefresh(request));
  }
  // Everything else (Supabase, Google sign-in, YouVersion) goes straight to the network.
});
