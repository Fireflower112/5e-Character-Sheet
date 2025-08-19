// js/app.js

// This helper function is on the global window object to be accessible
window.renderItemDetailsModal = (item) => {
    // ... (modal rendering logic - no changes here)
};

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    const itemModal = document.getElementById('item-modal');
    const itemModalContent = document.getElementById('item-modal-content');

    // --- PROBE 1: Check if the buttons are being found when the page loads ---
    console.log('App started. Buttons found:', mainNavButtons);

    let currentPage = 'dashboard';
    let currentSubPage = 'basic';

    const renderApp = () => {
        // ... (renderApp logic - no changes here)
    };
    
    function attachContentHandlers() {
        // ... (attachContentHandlers logic - no changes here)
    }

    function updateNavStyles() {
        // ... (updateNavStyles logic - no changes here)
    }

    // --- Event Listeners ---

    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            // --- PROBE 2: Check if the click itself is being registered ---
            console.log('Navigation button clicked:', button.dataset.page);

            currentPage = button.dataset.page;
            currentSubPage = 'basic'; 
            if (currentPage === 'inventory') currentSubPage = 'equipped';
            if (currentPage === 'notes') currentSubPage = 'character';
            renderApp();
        });
    });

    // ... (other event listeners - no changes here) ...

    // --- Initialization ---
    window.stores.character.subscribe(renderApp);
    window.stores.character.init();
});