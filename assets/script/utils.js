// Generic helpers & shared logic

export function onReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

export function updateYear() {
    const footerEl = document.querySelector('[data-i18n-html="footer"]');
    if (!footerEl) return;
    const year = new Date().getFullYear();
    footerEl.innerHTML = footerEl.innerHTML.replace(/\b\d{4}\b/, year);
}

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => { });
    }
}

export function isFirstVisit() {
    return !localStorage.getItem('visitedSite');
}

export function markVisited() {
    localStorage.setItem('visitedSite', '1');
}
