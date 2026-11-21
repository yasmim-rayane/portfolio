import { getTranslation } from './translation.js';

const THEME_KEY = 'siteTheme';
const prefersDark = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : true;
let currentTheme = typeof localStorage !== 'undefined'
  ? (localStorage.getItem(THEME_KEY) || (prefersDark ? 'dark' : 'light'))
  : 'dark';
let themeReady = false;

function updateThemeLabels(theme = currentTheme) {
  if (typeof document === 'undefined') return;
  const icon = document.getElementById('themeIcon');
  if (icon) {
    if (theme === 'dark') {
      icon.src = 'assets/images/icons/dark-mode-icon.svg';
      icon.alt = getTranslation('themeSwitchToLight') || 'Switch to light theme';
    } else {
      icon.src = 'assets/images/icons/light-mode-icon.svg';
      icon.alt = getTranslation('themeSwitchToDark') || 'Switch to dark theme';
    }
  }
  const btn = document.getElementById('themeToggle');
  if (btn) {
    const label = getTranslation('themeToggleLabel') || 'Change theme';
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
  }
}

function applyTheme(theme) {
  const body = document.body;
  if (!body) return;
  body.setAttribute('data-theme', theme);
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  updateThemeLabels(theme);
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
  document.addEventListener('i18n:applied', () => updateThemeLabels(currentTheme));
  // Fallback rebind (caso imagens/botão atrasem)
  setTimeout(bindTheme, 150);
  setTimeout(bindTheme, 600);
  themeReady = true;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initTheme();
  window.toggleTheme = toggleTheme;
}

export { applyTheme, toggleTheme };
