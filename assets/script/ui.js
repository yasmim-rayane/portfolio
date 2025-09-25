import { onReady, updateYear, registerServiceWorker, isFirstVisit, markVisited } from './utils.js';

function initLoader() {
    const loader = document.getElementById('page-initial-loader');
    if (!loader) return;
    if (isFirstVisit()) {
        document.body.classList.add('no-scroll');
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            markVisited();
            setTimeout(() => loader.remove(), 600);
        }, 1200);
    } else {
        loader.remove();
    }
}

function initOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (!banner) return;
    const apply = () => {
        banner.style.display = navigator.onLine ? 'none' : 'block';
    };
    window.addEventListener('online', apply);
    window.addEventListener('offline', apply);
    apply();
}

function initYearUpdater() {
    updateYear();
    document.addEventListener('i18n:applied', updateYear);
}

export function initUI() {
    onReady(() => {
        initLoader();
        initOfflineBanner();
        initYearUpdater();
        registerServiceWorker();
    });
}
