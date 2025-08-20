// js/inventory-page.js (Main App Logic)

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const summaryHeaderArea = document.getElementById('character-summary-header');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    
    // Load last-viewed page from localStorage, or set defaults
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';

    // CORE RENDER FUNCTION - THIS WAS MISSING
    const renderApp = () => {
        const character = window.stores.character.get();
        
        summaryHeaderArea.innerHTML = window.renderCharacterSummaryHeader(character);
        
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
            case 'homebrew':
                pageHtml = window.HomebrewEditorPage();
                break;
            case 'notes':
                pageHtml = window.NotesPage(character, currentSubPage);
                break;
            default:
                pageHtml = '<h2>Page Not Found</h2>';
        }

        contentArea.innerHTML = pageHtml;
        updateNavStyles();
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

    // --- CENTRALIZED EVENT LISTENERS ---

    contentArea.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action, itemId, subpage, abilityId, raceName, subraceName, lang, index } = actionTarget.dataset;

        switch (action) {
            case 'toggle-accordion':
                const details = actionTarget.nextElementSibling;
                const icon = actionTarget.querySelector('.accordion-icon');
                if (details && details.classList.contains('accordion-details')) {
                    details.classList.toggle('hidden');
                    if (icon) icon.textContent = details.classList.contains('hidden') ? '[+]' : '[-]';
                }
                break;
            case 'toggle-favorite':
                window.stores.character.toggleFavorite(itemId);
                break;
            case 'delete-item':
                if (confirm('Are you sure you want to delete this item?')) window.stores.character.deleteItem(itemId);
                break;
            case 'sub-tab':
                if (subpage) {
                    currentSubPage = subpage;
                    localStorage.setItem('currentSubPage', currentSubPage);
                    renderApp();
                }
                break;
            case 'add-class':
                window.stores.character.addClass();
                break;
            case 'remove-class':
                window.stores.character.removeClass(index);
                break;
            case 'open-homebrew-modal':
                document.getElementById('modal-container').innerHTML = window.renderHomebrewRaceModal();
                window.attachHomebrewRaceModalHandlers();
                break;
            case 'open-homebrew-subrace-modal':
                document.getElementById('modal-container').innerHTML = window.renderHomebrewSubraceModal();
                window.attachHomebrewSubraceModalHandlers();
                break;
            case 'remove-language':
                window.stores.character.removeLanguage(lang);
                break;
        }
    });

    contentArea.addEventListener('change', (e) => {
        const target = e.target;
        const { action, field, itemType, skill, type, save } = target.dataset;

        if (action === 'assign-to-container') window.stores.character.assignItemToContainer(target.dataset.itemId, target.value);
        else if (action === 'equip-to-slot') window.stores.character.equipItemToSlot(target.dataset.itemId, target.value);
        else if (field === 'race') window.stores.character.applyRace(target.value);
        else if (field === 'subrace') window.stores.character.applySubrace(target.value);
        else if (skill && type) {
            const character = window.stores.character.get();
            const newSkills = { ...character.skills };
            newSkills[skill][type] = target.checked;
            window.stores.character.set({ skills: newSkills });
        } else if (save) {
            const character = window.stores.character.get();
            const newSaves = { ...character.savingThrows };
            newSaves[save].proficient = target.checked;
            window.stores.character.set({ savingThrows: newSaves });
        } else if (target.id === 'language-input') {
            window.stores.character.addLanguage(target.value);
            target.value = '';
        }
    });
    
    contentArea.addEventListener('input', (e) => {
        const { action, field, subfield, index } = e.target.dataset;

        if (action === 'update-class') {
            window.stores.character.updateClass(index, e.target.dataset.field, e.target.value);
        } else if (field && field !== 'languages') {
            window.stores.character.updateCharacterProperty(field, e.target.value, subfield);
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