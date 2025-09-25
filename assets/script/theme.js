const THEME_KEY = 'siteTheme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
let initialized = false;

function applyTheme(theme) {
    const body = document.body;
    if (!body) return;
    body.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    swapThemeIcon(theme);
    const meta = document.getElementById('meta-theme-color');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d0d0d' : '#fefefe');
}

function swapThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    if (theme === 'dark') {
        icon.src = 'assets/images/icons/dark-mode-icon.svg';
        icon.alt = 'Switch to light theme';
    } else {
        icon.src = 'assets/images/icons/light-mode-icon.svg';
        icon.alt = 'Switch to dark theme';
    }
}

function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function initTheme() {
    if (initialized) return;
    if (!document.body) return document.addEventListener('DOMContentLoaded', initTheme, { once: true });
    applyTheme(currentTheme);
    document.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggle')) toggleTheme();
    });
    initialized = true;
}

initTheme();

window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
initTheme();

// Expose
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
// Expose / export
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
    earlyApply();
    bindThemeToggle();
});

// Expose if needed elsewhere
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
