/**
 * =============================================================================
 * Service Worker - Cache Strategy
 * =============================================================================
 *
 * Gerencia o cache offline do portfólio na raiz do site:
 * - Network-First para documentos HTML, scripts JS e CSS (evita código obsoleto)
 * - Cache-First para imagens, ícones e cursores
 * =============================================================================
 */

const CACHE_NAME = 'portfolio-static-v6';

const STATIC_ASSETS = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/css/header-effects.css',
    './assets/script/script.js',
    './assets/script/translation.js',
    './assets/script/theme.js',
    './assets/script/api-github.js',
    './assets/script/shooting-stars.js',
    './assets/images/Rainbow Marble.ico',
    './assets/images/icons/usa-flag.svg',
    './assets/images/icons/brazil-flag.png',
    './assets/images/icons/dark-mode-icon.svg',
    './assets/images/icons/light-mode-icon.svg'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const req = e.request;

    if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

    const url = new URL(req.url);
    const isCodeOrDoc =
        req.mode === 'navigate' ||
        url.pathname.endsWith('/') ||
        /\.(html|js|css)$/.test(url.pathname);

    if (isCodeOrDoc) {
        e.respondWith(
            fetch(req)
                .then(res => {
                    if (res && res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() =>
                    caches.match(req).then(cached => {
                        if (cached) return cached;
                        if (req.mode === 'navigate') return caches.match('./index.html');
                        return undefined;
                    })
                )
        );
        return;
    }

    e.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;

            return fetch(req)
                .then(res => {
                    if (res && res.ok && /\.(png|svg|ico|jpg|jpeg|webp|cur|woff2|pdf)$/i.test(url.pathname)) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});
