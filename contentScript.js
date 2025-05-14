/**
 * Gmail Dark Mode Theme Manager
 *
 * This script automatically applies dark mode to Gmail based on system preferences.
 * It uses CSS filters to invert colors and maintain image/video visibility.
 */

// ============================================================================
// Constants
// ============================================================================

const STYLE_ID = 'gmail-dark-mode-style';
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
    const styleElement = createDarkModeStyle();
    document.head.appendChild(styleElement);
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
    }
  } catch (error) {
    console.error('Failed to remove dark mode:', error);
  }
};

// ============================================================================
// Theme Management Functions
// ============================================================================

/**
 * Updates the theme based on system color scheme preference
 * @param {MediaQueryListEvent} mediaQueryEvent - The media query event containing the color scheme preference
 */
const updateTheme = (mediaQueryEvent) => {
  if (mediaQueryEvent.matches) {
    applyDarkMode();
  } else {
    removeDarkMode();
  }
};

/**
 * Initializes the theme manager by:
 * 1. Setting up the initial theme based on system preference
 * 2. Adding a listener for system theme changes
 */
const initializeThemeManager = () => {
  try {
    // Get system color scheme preference
    const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply initial theme
    updateTheme(systemColorScheme);

    // Listen for system theme changes
    systemColorScheme.addEventListener('change', updateTheme);
  } catch (error) {
    console.error('Failed to initialize theme manager:', error);
  }
};

// ============================================================================
// Initialize
// ============================================================================

// Start the theme manager
initializeThemeManager();
