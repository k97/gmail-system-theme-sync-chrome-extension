/**
 * Gmail System Theme Sync - Background Script
 *
 * This script runs in the background and handles extension installation
 * and updates. It provides feedback when the extension is installed or updated.
 */

// ============================================================================
// Extension Lifecycle Management
// ============================================================================

/**
 * Handles extension installation and updates
 * Provides user feedback through console logging
 */
const handleExtensionLifecycle = () => {
  try {
    console.log('🎨 Gmail System Theme Sync has been installed/updated');
    console.log('✨ The extension will now automatically sync Gmail with your system theme');
    console.log('💡 Dark mode will be applied when your system is in dark mode');
    console.log('☀️ Light mode will be applied when your system is in light mode');
  } catch (error) {
    console.error('❌ Error during extension initialization:', error);
  }
};

// Listen for extension installation or updates
chrome.runtime.onInstalled.addListener(handleExtensionLifecycle);
