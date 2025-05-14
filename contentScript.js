/**
 * Gmail Theme Sync & Control
 *
 * This script manages Gmail's theme based on user preferences or system settings.
 * By default, it syncs with the system theme, but also supports manual Light and Dark mode selection.
 */

// ============================================================================
// Constants
// ============================================================================

const STYLE_ID = 'gmail-theme-style';
const DARK_MODE_STYLES = `
  /* Invert the entire page */
  html {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Fix images and videos to appear normal */
  img, video {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Ensure SVG icons are properly inverted */
  img, svg {
    filter: invert(1) hue-rotate(180deg) !important;
  }

  /* Fix specific Gmail UI elements */
  .qj, .aEe, .aoH {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

// ============================================================================
// Style Management Functions
// ============================================================================

/**
 * Creates a new style element with dark mode CSS
 * @returns {HTMLStyleElement} A new style element containing dark mode styles
 */
const createDarkModeStyle = () => {
  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.innerHTML = DARK_MODE_STYLES;
  return styleElement;
};

/**
 * Applies dark mode by adding the style element to the document head
 */
const applyDarkMode = () => {
  try {
    removeDarkMode();
    const styleElement = createDarkModeStyle();
    document.head.appendChild(styleElement);
    console.log('Dark mode applied');
  } catch (error) {
    console.error('Failed to apply dark mode:', error);
  }
};

/**
 * Removes dark mode by removing the style element from the document
 */
const removeDarkMode = () => {
  try {
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) {
      existingStyle.remove();
      console.log('Dark mode removed');
    }
  } catch (error) {
    console.error('Failed to remove dark mode:', error);
  }
};

// ============================================================================
// Theme Management Functions
// ============================================================================

let currentTheme = 'system';
let isPaused = false;

/**
 * Updates the theme based on the selected mode
 * @param {string} theme - The theme to apply ('light', 'dark', 'system', or 'default')
 */
const updateTheme = (theme) => {
  if (theme === 'default') {
    removeDarkMode();
    console.log('Theme reset to Gmail default');
    return;
  }
  if (isPaused) {
    console.log('Theme change ignored: extension is paused');
    return;
  }
  console.log('Updating theme to:', theme);
  currentTheme = theme;

  if (theme === 'system') {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System theme is:', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  } else if (theme === 'dark') {
    applyDarkMode();
  } else {
    removeDarkMode();
  }
};

/**
 * Handles system theme changes when in system mode
 * @param {MediaQueryListEvent} mediaQueryEvent - The media query event
 */
const handleSystemThemeChange = (mediaQueryEvent) => {
  if (isPaused) {
    console.log('System theme change ignored: extension is paused');
    return;
  }
  console.log('System theme changed:', mediaQueryEvent.matches ? 'dark' : 'light');
  if (currentTheme === 'system') {
    updateTheme('system');
  }
};

/**
 * Handles pause/resume state
 * @param {boolean} paused
 */
const setPaused = (paused) => {
  isPaused = paused;
  if (isPaused) {
    removeDarkMode();
    console.log('Extension paused: theme changes disabled');
  } else {
    // Re-apply the current theme from storage to ensure correct theme is applied
    chrome.storage.sync.get(['themePreference'], (result) => {
      const savedTheme = result.themePreference || 'system';
      currentTheme = savedTheme;
      updateTheme(savedTheme);
      console.log('Extension resumed: theme changes enabled and theme re-applied');
    });
  }
};

/**
 * Initializes the theme manager
 */
const initializeThemeManager = () => {
  try {
    console.log('Initializing theme manager');
    // Get saved theme preference and pause state, defaulting to system and not paused
    chrome.storage.sync.get(['themePreference', 'themePaused'], (result) => {
      isPaused = !!result.themePaused;
      const savedTheme = result.themePreference || 'system';
      currentTheme = savedTheme;
      if (!isPaused) {
        updateTheme(savedTheme);
      } else {
        removeDarkMode();
      }
    });

    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

    // Listen for theme change and pause state messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'themeChanged') {
        updateTheme(message.theme);
        sendResponse && sendResponse({
          success: true
        });
      }
      if (message.action === 'themePauseState') {
        setPaused(!!message.paused);
        sendResponse && sendResponse({
          success: true
        });
      }
      return true;
    });
  } catch (error) {
    console.error('Failed to initialize theme manager:', error);
  }
};

// ============================================================================
// Initialize
// ============================================================================

// Start the theme manager
initializeThemeManager();
