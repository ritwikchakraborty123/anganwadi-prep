// Offline support for the app.
//
// HOW TO PUBLISH AN UPDATE: after changing index.html (or anything listed in FILES),
// bump VERSION below (v1 -> v2 -> v3 ...) and push. Phones that open the app with
// internet will download the new copy and delete the old one. If VERSION is not
// changed, phones keep showing the copy they already saved.
const VERSION = "v1";
const CACHE = "anganwadi-prep-" + VERSION;

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/fonts.css",
  "./fonts/HindSiliguri-400-bengali.woff2",
  "./fonts/HindSiliguri-400-latin.woff2",
  "./fonts/HindSiliguri-400-latin-ext.woff2",
  "./fonts/HindSiliguri-500-bengali.woff2",
  "./fonts/HindSiliguri-500-latin.woff2",
  "./fonts/HindSiliguri-500-latin-ext.woff2",
  "./fonts/HindSiliguri-600-bengali.woff2",
  "./fonts/HindSiliguri-600-latin.woff2",
  "./fonts/HindSiliguri-600-latin-ext.woff2",
  "./fonts/HindSiliguri-700-bengali.woff2",
  "./fonts/HindSiliguri-700-latin.woff2",
  "./fonts/HindSiliguri-700-latin-ext.woff2",
  "./fonts/TiroBangla-400-bengali.woff2",
  "./fonts/TiroBangla-400-latin.woff2",
  "./fonts/TiroBangla-400-latin-ext.woff2",
];

// Save every file. "reload" skips the browser's HTTP cache so a new VERSION
// always stores fresh copies from GitHub Pages.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

// Remove copies saved by older versions.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("anganwadi-prep-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Always answer from the saved copy; only go to the network for anything not saved.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html", { ignoreSearch: true }).then((r) => r || fetch(req))
    );
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
});
