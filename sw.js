// Service worker: powloka offline + cache audio na zadanie. Wersja zmienia sie przy kazdym wydaniu.
const VERSION = 'mmj-08b6296737';
const SHELL = ["./assets/index-DSyak1z5.js", "./assets/index-DlN5W0XX.css", "./assets/klee-one-sub-BAMtRd1v.woff2", './', './index.html', './manifest.webmanifest', './strokes.json', './audio-manifest.json', './icon.svg', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'mmj-audio').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => {
  if (e.data?.type === 'cache-audio') {
    e.waitUntil(caches.open('mmj-audio').then(async c => { let n = 0; for (const u of e.data.urls) { if (!(await c.match(u))) { try { await c.add(u); } catch {} } n++; if (n % 50 === 0) e.source?.postMessage({ type: 'audio-progress', n }); } e.source?.postMessage({ type: 'audio-done', n }); }));
  }
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (url.pathname.includes('/audio/')) {
    e.respondWith(caches.open('mmj-audio').then(async c => { const hit = await c.match(req); if (hit) return hit; const res = await fetch(req); if (res.ok && res.status === 200) c.put(req, res.clone()); return res; }));
    return;
  }
  // powloka i zasoby: najpierw siec (swieze wydanie), awaryjnie cache
  e.respondWith(fetch(req).then(res => { if (res.ok) { const cl = res.clone(); caches.open(VERSION).then(c => c.put(req, cl)); } return res; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
