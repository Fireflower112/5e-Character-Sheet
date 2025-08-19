// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');

    let currentPage = 'dashboard';
    let currentSubPage = 'basic';

    const renderApp = () => {
        const character = window.stores.character.get();
        if (!character || Object.keys(character).length === 0) {
            contentArea.innerHTML = '<p>Loading character...</p>';
            return;
        }

        let pageHtml = '';
        switch (currentPage) {
            case 'dashboard':
                pageHtml = window.DashboardPage(character, currentSubPage);
                break;
            case 'character-editor':
                pageHtml = window.CharacterEditorPage(character, currentSubPage);
                break;
            case 'inventory':
                pageHtml = window.InventoryContainerPage(character, currentSubPage);
                break;
            case 'spells':
                pageHtml = window.SpellsPage(character);
                break;
            case 'notes':
                pageHtml = window.NotesPage(character, currentSubPage);
                break;
            default:
                pageHtml = '<h2>Page Not Found</h2>';
        }

        contentArea.innerHTML = pageHtml;
        attachContentHandlers();
        updateNavStyles();
    };
    
    function attachContentHandlers() {
        if (window.attachMainPageHandlers) window.attachMainPageHandlers();
        if (window.attachInfoPageHandlers) window.attachInfoPageHandlers();
        if (window.attachSkillsPageHandlers) window.attachSkillsPageHandlers();
        if (window.attachInventoryHandlers) window.attachInventoryHandlers();
        if (window.attachSpellsPageHandlers) window.attachSpellsPageHandlers();
        if (window.attachNotesPageHandlers) window.attachNotesPageHandlers();
        if (window.attachStoredItemsPageHandlers) window.attachStoredItemsPageHandlers();
    }

    function updateNavStyles() {
        mainNavButtons.forEach(btn => {
            if (btn.dataset.page === currentPage) {
                btn.classList.add('bg-indigo-700', 'text-white');
                btn.classList.remove('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            } else {
                btn.classList.remove('bg-indigo-700', 'text-white');
                btn.classList.add('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            }
        });
    }

    // --- Event Listeners ---

    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = button.dataset.page;
            currentSubPage = 'basic'; 
            if (currentPage === 'inventory') currentSubPage = 'equipped';
            if (currentPage === 'notes') currentSubPage = 'character';
            renderApp();
        });
    });

    contentArea.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action, itemId, subpage } = actionTarget.dataset;

        switch (action) {
            case 'toggle-accordion':
                const details = actionTarget.nextElementSibling;
                const icon = actionTarget.querySelector('.accordion-icon');
                if (details && details.classList.contains('accordion-details')) {
                    details.classList.toggle('hidden');
                    if (icon) {
                        icon.textContent = details.classList.contains('hidden') ? '[+]' : '[-]';
                    }
                }
                break;

            case 'toggle-favorite':
                window.stores.character.toggleFavorite(itemId);
                break;
            
            case 'delete-item':
                if (confirm('Are you sure you want to delete this item?')) {
                    window.stores.character.deleteItem(itemId);
                }
                break;

            case 'sub-tab':
                if (subpage) {
                    currentSubPage = subpage;
                    renderApp();
                }
                break;
        }
    });

    contentArea.addEventListener('change', (e) => {
        const target = e.target;
        const { itemId, action, field, itemType } = target.dataset;

        if (!action && !field) return;

        if (action === 'assign-to-container') {
            window.stores.character.assignItemToContainer(itemId, target.value);
        } else if (action === 'equip-to-slot') {
            window.stores.character.equipItemToSlot(itemId, target.value);
        } else if (action === 'equip-weapon') {
            const slot = target.checked ? 'Wielded' : 'none';
            window.stores.character.equipItemToSlot(itemId, slot);
        } else if (action === 'equip-armor-shield') {
            const slot = target.checked ? (itemType === 'armor' ? 'Armor' : 'Shield') : 'none';
            window.stores.character.equipItemToSlot(itemId, slot);
        } else if (field) {
            window.stores.character.updateItem(itemId, field, target.value);
        }
    });

    // --- Initialization ---
    window.stores.character.subscribe(renderApp);
    window.stores.character.init();
});