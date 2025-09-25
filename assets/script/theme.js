const THEME_KEY = 'siteTheme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');

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
        icon.alt = 'Switch to dark theme'; // unified language
    }
}

function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
});

// Expose if needed elsewhere
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
