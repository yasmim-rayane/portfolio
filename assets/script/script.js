// Module entrypoint
import './translation.js';
import './theme.js';

// First-visit loader
let __loaderInit = false;
function initLoader() {
    if (__loaderInit) return;
    __loaderInit = true;
    const loader = document.getElementById('page-initial-loader');
    if (!loader) return;
    const firstVisit = !localStorage.getItem('visitedSite');
    if (firstVisit) {
        document.body.classList.add('no-scroll');
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            localStorage.setItem('visitedSite', '1');
            setTimeout(() => loader.remove(), 600);
        }, 1200);
    } else {
        loader.remove();
    }
}

// Year updater
function updateYear() {
    const el = document.querySelector('[data-i18n-html="footer"]');
    if (!el) return;
    const current = new Date().getFullYear();
    el.innerHTML = el.innerHTML.replace(/\b\d{4}\b/, current);
}

// Offline banner
function updateOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (!banner) return;
    banner.style.display = navigator.onLine ? 'none' : 'block';
}

// Service Worker
function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

// Safe init (executa cedo e também após DOM)
function boot() {
    initLoader();
    updateYear();
    updateOfflineBanner();
    registerSW();
}
document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('i18n:applied', updateYear); // atualiza ano após troca de idioma
window.addEventListener('online', updateOfflineBanner);
window.addEventListener('offline', updateOfflineBanner);

// Tentativa antecipada (caso DOM já carregado)
if (document.readyState !== 'loading') boot();