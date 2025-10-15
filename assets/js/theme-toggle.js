// Theme toggle: initialize, persist, and sync icon
// This script runs as an ES module and does not depend on jQuery.

const THEME_STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

function getSavedThemePreference() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    console.log(`[Theme Toggle] getSavedThemePreference() returning: ${saved}`);
    return saved;
  } catch (error) {
    console.error('[Theme Toggle] Error reading localStorage:', error);
    return null;
  }
}

function saveThemePreference(themeName) {
  try {
    console.log(`[Theme Toggle] Saving to localStorage: ${themeName}`);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    const verify = localStorage.getItem(THEME_STORAGE_KEY);
    console.log(`[Theme Toggle] Verification read from localStorage: ${verify}`);
  } catch (error) {
    console.error('[Theme Toggle] Error saving to localStorage:', error);
  }
}

function getSystemPreferredTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

function setThemeAttribute(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
}

function updateIconForTheme(themeName) {
  const iconElement = document.getElementById('theme-icon');
  if (!iconElement) return;
  if (themeName === DARK) {
    iconElement.classList.remove('fa-sun');
    iconElement.classList.add('fa-moon');
  } else {
    iconElement.classList.remove('fa-moon');
    iconElement.classList.add('fa-sun');
  }
}

function applyTheme(themeName, persist = true) {
  console.log(`[Theme Toggle] Applying theme: ${themeName}, persist: ${persist}`);
  setThemeAttribute(themeName);
  updateIconForTheme(themeName);
  if (persist) saveThemePreference(themeName);
  console.log(`[Theme Toggle] Theme applied. data-theme is now: ${document.documentElement.getAttribute('data-theme')}`);
}

function toggleTheme() {
  const current = getSavedThemePreference() || (document.documentElement.getAttribute('data-theme') || getSystemPreferredTheme());
  const next = current === DARK ? LIGHT : DARK;
  console.log(`[Theme Toggle] Toggle clicked! Current: ${current}, Next: ${next}`);
  applyTheme(next, true);
}

// Initialize as early as possible to reduce FOUC
(function initializeTheme() {
  const saved = getSavedThemePreference();
  const initial = saved || getSystemPreferredTheme();
  console.log(`[Theme Toggle] Initializing theme. Saved: ${saved}, System: ${getSystemPreferredTheme()}, Using: ${initial}`);
  setThemeAttribute(initial);
})();

// Debug: Monitor localStorage changes
window.addEventListener('storage', (e) => {
  if (e.key === THEME_STORAGE_KEY) {
    console.warn(`[Theme Toggle] EXTERNAL localStorage change detected! Old: ${e.oldValue}, New: ${e.newValue}`);
  }
});

// Debug: Intercept all localStorage.setItem calls
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  if (key === THEME_STORAGE_KEY) {
    console.trace(`[Theme Toggle] localStorage.setItem('${key}', '${value}') called from:`);
  }
  return originalSetItem.apply(this, arguments);
};

// Sync icon once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateIconForTheme(document.documentElement.getAttribute('data-theme'));
    const toggleEl = document.getElementById('theme-toggle');
    if (toggleEl) {
      console.log('[Theme Toggle] Event listener attached to toggle button');
      toggleEl.addEventListener('click', toggleTheme);
    } else {
      console.error('[Theme Toggle] ERROR: Could not find #theme-toggle element!');
    }
  });
} else {
  updateIconForTheme(document.documentElement.getAttribute('data-theme'));
  const toggleEl = document.getElementById('theme-toggle');
  if (toggleEl) {
    console.log('[Theme Toggle] Event listener attached to toggle button');
    toggleEl.addEventListener('click', toggleTheme);
  } else {
    console.error('[Theme Toggle] ERROR: Could not find #theme-toggle element!');
  }
}

// Listen for system theme changes only when user hasn't set a manual preference
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!getSavedThemePreference()) {
      applyTheme(event.matches ? DARK : LIGHT, false);
    }
  });
}

export {};


