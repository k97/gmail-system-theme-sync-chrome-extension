/**
 * Gmail System Theme Sync Extension
 * Popup UI Controller
 */

// DOM Elements
const elements = {
    segmentOptions: document.querySelectorAll('.segment-option'),
    pauseBtn: document.getElementById('pauseBtn'),
    iconPlay: document.querySelector('#pauseBtn .icon-play'),
    iconPause: document.querySelector('#pauseBtn .icon-pause'),
    tooltip: document.querySelector('#pauseBtn .tooltip'),
    themeControl: document.getElementById('themeControl'),
    themeLabel: document.querySelector('.theme-label')
};

// State
const state = {
    isPaused: false,
    currentTheme: 'system'
};

/**
 * Updates the UI to reflect the current pause state
 */
function updatePauseUI() {
    const {isPaused} = state;
    const {pauseBtn, iconPlay, iconPause, tooltip, themeControl, themeLabel} = elements;

    // Update pause button state
    pauseBtn.classList.toggle('paused', isPaused);
    iconPlay.style.display = isPaused ? '' : 'none';
    iconPause.style.display = isPaused ? 'none' : '';
    tooltip.textContent = isPaused ? 'Resume extension' : 'Pause extension';
    pauseBtn.setAttribute('aria-label', isPaused ? 'Resume extension' : 'Pause extension');

    // Update theme controls visibility
    const displayStyle = isPaused ? 'none' : '';
    themeControl.style.display = displayStyle;
    if (themeLabel) {
        themeLabel.style.display = displayStyle;
    }
}

/**
 * Sets the active theme and updates UI accordingly
 * @param {string} theme - The theme to set ('system', 'light', or 'dark')
 */
function setActiveTheme(theme) {
    state.currentTheme = theme;
    elements.segmentOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });
}

/**
 * Sends a message to content scripts about theme changes
 * @param {string} theme - The theme to apply
 */
function notifyThemeChange(theme) {
    chrome.runtime.sendMessage({
        action: 'themeChanged',
        theme
    });
}

/**
 * Handles pause state changes
 */
function handlePauseStateChange() {
    state.isPaused = !state.isPaused;

    // Save state
    chrome.storage.sync.set({
        themePaused: state.isPaused
    });

    // Update UI
    updatePauseUI();

    // Notify content scripts
    chrome.runtime.sendMessage({
        action: 'themePauseState',
        paused: state.isPaused
    });

    // Handle theme based on pause state
    if (state.isPaused) {
        notifyThemeChange('default');
    } else {
        notifyThemeChange(state.currentTheme);
    }
}

/**
 * Handles theme selection
 * @param {string} selectedTheme - The selected theme
 */
function handleThemeSelection(selectedTheme) {
    if (state.isPaused) return;

    setActiveTheme(selectedTheme);
    chrome.storage.sync.set({
        themePreference: selectedTheme
    });
    notifyThemeChange(selectedTheme);
}

// Initialize extension state
chrome.storage.sync.get(['themePreference', 'themePaused'], (result) => {
    state.isPaused = !!result.themePaused;
    state.currentTheme = result.themePreference || 'system';

    updatePauseUI();
    setActiveTheme(state.currentTheme);

    // Notify content scripts of initial state
    chrome.runtime.sendMessage({
        action: 'themePauseState',
        paused: state.isPaused
    });

    // Apply appropriate theme
    notifyThemeChange(state.isPaused ? 'default' : state.currentTheme);
});

// Event Listeners
elements.pauseBtn.addEventListener('click', handlePauseStateChange);

elements.segmentOptions.forEach(option => {
    option.addEventListener('click', () => handleThemeSelection(option.dataset.theme));
});