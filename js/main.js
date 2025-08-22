// js/main.js

window.showMessage = (message, color) => {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.style.backgroundColor = color;
    messageBox.classList.add('show');
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const summaryHeaderArea = document.getElementById('character-summary-header');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';

    const renderApp = () => {
		console.log('%c RENDER:', 'color: blue; font-weight: bold;', 'Page is redrawing.');
		const character = window.stores.character.get();
        summaryHeaderArea.innerHTML = window.renderCharacterSummaryHeader(character);
        if (!character || Object.keys(character).length === 0) {
            contentArea.innerHTML = '<p>Loading character...</p>';
            return;
        }
        let pageHtml = '';
        switch (currentPage) {
            case 'dashboard': pageHtml = window.DashboardPage(character, currentSubPage); break;
            case 'character-editor': pageHtml = window.CharacterEditorPage(character, currentSubPage); break;
            case 'inventory': pageHtml = window.InventoryContainerPage(character, currentSubPage); break;
            case 'homebrew': pageHtml = window.HomebrewEditorPage(); break;
            case 'notes': pageHtml = window.NotesPage(character, currentSubPage); break;
            default: pageHtml = '<h2>Page Not Found</h2>';
        }
        contentArea.innerHTML = pageHtml;
        updateNavStyles();
        if (currentPage === 'inventory' && currentSubPage === 'equipped') { window.attachEquippedItemsPageHandlers(); }
        if (currentPage === 'inventory' && currentSubPage === 'stored') { window.attachStoredItemsPageHandlers(); }
        if (currentPage === 'inventory' && currentSubPage === 'all') { window.attachAllItemsPageHandlers(); }
    };
    
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

    contentArea.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        // MODIFIED: Added itemId
        const { action, subpage, lang, index, itemId } = actionTarget.dataset;

        switch (action) {
            case 'sub-tab':
                if (subpage) {
                    currentSubPage = subpage;
                    localStorage.setItem('currentSubPage', currentSubPage);
                    renderApp();
                }
                break;
            // --- NEW: Added handlers for favorite and delete ---
            case 'toggle-favorite':
                if (itemId) window.stores.characterActions.toggleFavoriteItem(itemId);
                break;
            case 'delete-item':
                if (itemId && confirm('Are you sure you want to delete this item?')) {
                    window.stores.characterActions.deleteItem(itemId);
                }
                break;
            // (Other cases are unchanged)
            case 'add-class': window.stores.characterActions.addClass(); break;
            case 'remove-class': window.stores.characterActions.removeClass(index); break;
            case 'open-homebrew-modal': /* ... */ break;
            case 'open-homebrew-subrace-modal': /* ... */ break;
            case 'remove-language': window.stores.characterActions.removeLanguage(lang); break;
        }
    });

    contentArea.addEventListener('change', (e) => {
        const target = e.target;
        // MODIFIED: Added itemId and itemType
        const { action, field, skill, type, save, itemId, itemType } = target.dataset;

        // --- NEW: Added handlers for inventory actions ---
        if (action === 'assign-to-container') {
            window.stores.characterActions.assignItemToContainer(itemId, target.value);
        } else if (action === 'equip-to-slot') {
            window.stores.characterActions.equipItemToSlot(itemId, target.value);
        } else if (action === 'equip-weapon') {
            const slot = target.checked ? 'Wielded' : 'none';
            window.stores.characterActions.equipItemToSlot(itemId, slot);
        } else if (action === 'equip-armor-shield') {
            const slot = target.checked ? (itemType === 'armor' ? 'Armor' : 'Shield') : 'none';
            window.stores.characterActions.equipItemToSlot(itemId, slot);
        } 
        // (Other change handlers are unchanged)
        else if (field === 'race') { window.stores.characterActions.applyRace(target.value); } 
        else if (field === 'subrace') { window.stores.characterActions.applySubrace(target.value); } 
        else if (action === 'update-class') { window.stores.characterActions.updateClass(target.dataset.index, target.dataset.field, target.value); } 
        else if (action === 'update-subclass') { window.stores.characterActions.updateSubclass(target.dataset.index, target.value); } 
        else if (skill && type) { /* ... */ } 
        else if (save) { /* ... */ } 
        else if (target.id === 'language-input') { /* ... */ }
    });
    
    contentArea.addEventListener('input', (e) => {
        const { action, field, subfield, index } = e.target.dataset;
         if (field === 'race' || field === 'subrace') return;
		 if (action === 'update-class') {
            window.stores.characterActions.updateClass(index, e.target.dataset.field, e.target.value);
        } else if (field) {
            window.stores.characterActions.updateCharacterProperty(field, e.target.value, subfield);
        }
    });

    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = button.dataset.page;
            localStorage.setItem('currentPage', currentPage);
            if (currentPage === 'dashboard') currentSubPage = 'skills';
            if (currentPage === 'inventory') currentSubPage = 'equipped';
            if (currentPage === 'notes') currentSubPage = 'character';
            if (currentPage === 'character-editor') currentSubPage = 'basic';
            localStorage.setItem('currentSubPage', currentSubPage);
            renderApp();
        });
    });

    window.stores.character.subscribe(renderApp);
    window.stores.character.init();
});