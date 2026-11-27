// Service worker: powloka offline + cache audio na zadanie. Wersja zmienia sie przy kazdym wydaniu.
const VERSION = 'mmj-9e014d4347';
const SHELL = ["./assets/index-CNjQiZXs.js", "./assets/index-Dw_o88HL.css", "./assets/klee-one-sub-BAMtRd1v.woff2", './', './index.html', './manifest.webmanifest', './strokes.json', './audio-manifest.json', './icon.svg', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== 'mmj-audio' && k !== 'mmj-asr').map(k => caches.delete(k)))).then(pruneAudio).then(() => self.clients.claim())); });
// usuwa z pamieci nagrania, ktorych nie ma juz w manifescie (np. po zmianie glosow) — postep nauki jest w IndexedDB, nie tu
async function pruneAudio() {
  try {
    const m = await (await fetch('./audio-manifest.json', { cache: 'no-store' })).json();
    const keep = new Set(); for (const v of Object.values(m)) { if (v.n) keep.add(v.n); if (v.s) keep.add(v.s); }
    const c = await caches.open('mmj-audio');
    for (const req of await c.keys()) { const f = req.url.split('/').pop().split('?')[0]; if (!keep.has(f)) await c.delete(req); }
  } catch { /* offline — sprobuje przy nastepnej aktualizacji */ }
}
self.addEventListener('message', e => {
  if (e.data?.type === 'cache-audio') {
    e.waitUntil(caches.open('mmj-audio').then(async c => { let n = 0; for (const u of e.data.urls) { if (!(await c.match(u))) { try { await c.add(u); } catch {} } n++; if (n % 50 === 0) e.source?.postMessage({ type: 'audio-progress', n }); } e.source?.postMessage({ type: 'audio-done', n }); }));
  }
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  // K-03: model rozpoznawania mowy — tylko z pamieci 'mmj-asr' (pobierany na zyczenie), bez kopii w powloce
  if (url.pathname.includes('/asr/') && !url.pathname.endsWith('files.json')) {
    e.respondWith(caches.open('mmj-asr').then(c => c.match(req.url.split('#')[0]).then(r => r || fetch(req))));
    return;
  }
  if (url.pathname.includes('/audio/')) {
    e.respondWith(audioResponse(req));
    return;
  }
  // powloka i zasoby: najpierw siec (swieze wydanie), awaryjnie cache
  e.respondWith(fetch(req).then(res => { if (res.ok) { const cl = res.clone(); caches.open(VERSION).then(c => c.put(req, cl)); } return res; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});

// Audio: pelny plik zawsze pobierany i zapisywany BEZ naglowka Range; zapytania Range
// (Safari dla <audio>) obslugiwane z pamieci odpowiedzia 206.
async function audioResponse(req) {
  const c = await caches.open('mmj-audio');
  const key = req.url.split('#')[0];
  let full = await c.match(key);
  if (!full) {
    const res = await fetch(key, { credentials: 'same-origin' });
    if (!res.ok || res.status !== 200) return res;
    await c.put(key, res.clone());
    full = res;
  }
  const range = req.headers.get('range');
  if (!range) return full;
  const buf = await full.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const size = buf.byteLength;
  let start = m[1] ? parseInt(m[1], 10) : 0;
  let end = m[2] ? parseInt(m[2], 10) : size - 1;
  if (!m[1] && m[2]) { start = size - parseInt(m[2], 10); end = size - 1; }
  end = Math.min(end, size - 1);
  return new Response(buf.slice(start, end + 1), { status: 206, statusText: 'Partial Content', headers: { 'Content-Type': 'audio/mp4', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
