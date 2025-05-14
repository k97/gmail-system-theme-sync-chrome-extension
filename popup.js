// Update status based on system theme
const updateStatus = () => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const statusText = document.getElementById('status-text');
    statusText.textContent = isDarkMode ? 'Dark mode active' : 'Light mode active';
};

// Initial status update
updateStatus();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateStatus);