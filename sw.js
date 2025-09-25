const CACHE_NAME = 'portfolio-static-v1';
const STATIC_ASSETS = [
    'index.html',
    'assets/css/style.css',
    'assets/css/translation.css',
    'assets/script/script.js',
    'assets/script/translation.js',
    'assets/script/theme.js',
    'assets/images/Rainbow Marble.ico',
    'assets/images/icons/usa-flag.svg',
    'assets/images/icons/brazil-flag.png',
    'assets/images/icons/dark-mode-icon.svg'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
    e.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(res => {
                const copy = res.clone();
                // Cache only basic static types
                if (/\.(css|js|png|svg|ico|jpg|jpeg|webp)$/.test(req.url)) {
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                }
                return res;
            }).catch(() => caches.match('index.html'));
        })
    );
});
