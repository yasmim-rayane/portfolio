const THEME_KEY = 'siteTheme';
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light');
let themeReady = false;

function applyTheme(theme) {
  const body = document.body;
  if (!body) return;
  body.setAttribute('data-theme', theme);
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    if (theme === 'dark') {
      icon.src = 'assets/images/icons/dark-mode-icon.svg';
      icon.alt = 'Switch to light theme';
    } else {
      icon.src = 'assets/images/icons/light-mode-icon.svg';
      icon.alt = 'Switch to dark theme';
    }
  }
  const meta = document.getElementById('meta-theme-color');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d0d0d' : '#fefefe');
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function bindTheme() {
  const btn = document.getElementById('themeToggle');
  if (btn && !btn.__bound) {
    btn.addEventListener('click', toggleTheme);
    btn.__bound = true;
  }
}

function initTheme() {
  if (themeReady) return;
  if (!document.body) return document.addEventListener('DOMContentLoaded', initTheme, { once: true });
  applyTheme(currentTheme);
  bindTheme();
  // Fallback rebind (caso imagens/botão atrasem)
  setTimeout(bindTheme, 150);
  setTimeout(bindTheme, 600);
  themeReady = true;
}

initTheme();
window.toggleTheme = toggleTheme;
export { applyTheme, toggleTheme };
