/**
 * theme.js
 * Handles dark/light mode toggle and localStorage persistence.
 */


export function getInitialTheme() {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch { /* ignore */ }
}

export function toggleTheme(current) {
  return current === 'light' ? 'dark' : 'light';
}