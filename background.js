/**
 * Gmail Theme Control - Background Script
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
    console.log('🎨 Gmail Theme Control has been installed/updated');
    console.log('✨ You can now control your Gmail theme with ease');
    console.log('💡 Choose between Light, Dark, or System theme');
  } catch (error) {
    console.error('❌ Error during extension initialization:', error);
  }
};

// Listen for extension installation or updates
chrome.runtime.onInstalled.addListener(handleExtensionLifecycle);

// ============================================================================
// Message Handling
// ============================================================================

/**
 * Sends a message to a tab safely with error handling
 * @param {number} tabId - The ID of the tab to send the message to
 * @param {Object} message - The message to send
 * @returns {Promise} - A promise that resolves when the message is sent
 */
const sendMessageToTab = async (tabId, message) => {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    // Ignore errors for tabs that don't exist or aren't ready
    if (!error.message.includes('Receiving end does not exist')) {
      console.error('Error sending message to tab:', error);
    }
  }
};

/**
 * Handles messages from the popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'themeChanged') {
    // Notify all Gmail tabs about the theme change
    chrome.tabs.query({
      url: 'https://mail.google.com/*'
    }, (tabs) => {
      if (tabs.length === 0) {
        console.log('No Gmail tabs found');
        return;
      }

      // Send message to each tab
      tabs.forEach(tab => {
        sendMessageToTab(tab.id, {
          action: 'themeChanged',
          theme: message.theme
        });
      });
    });
  }
});
