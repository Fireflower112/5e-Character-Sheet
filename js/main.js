// js/main.js

function loadHomebrewData() {
    try {
        const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
        Object.assign(window.dndData.races, homebrewRaces);
    } catch (e) {
        console.error("Failed to load homebrew data:", e);
    }
}

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
    loadHomebrewData();

    const contentArea = document.getElementById('content-area');
    const summaryHeaderArea = document.getElementById('character-summary-header');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';
    let editBonuses = []; // Temporary holder for bonuses while editing

    const renderApp = () => {
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

        const { action, subpage, itemId, lang, index, abilityId, raceName, subraceName } = actionTarget.dataset;

        switch (action) {
            case 'toggle-accordion': {
                const displayArea = actionTarget.closest('[id^="item-display-"]');
                if(displayArea) {
                    const details = displayArea.querySelector('.accordion-details');
                    if (details) {
                        details.classList.toggle('hidden');
                    }
                }
                break;
            }
            case 'sub-tab':
                if (subpage) {
                    currentSubPage = subpage;
                    localStorage.setItem('currentSubPage', currentSubPage);
                    renderApp();
                }
                break;
            case 'edit-item': {
                const character = window.stores.character.get();
                const item = character.inventory.items[itemId];
                if (item) {
                    editBonuses = [...(item.bonuses || [])];
                    const displayArea = document.getElementById(`item-display-${itemId}`);
                    const editArea = document.getElementById(`item-edit-area-${itemId}`);
                    editArea.innerHTML = window.renderItemEditForm(item);
                    displayArea.classList.add('hidden');
                    editArea.classList.remove('hidden');
                }
                break;
            }
            case 'cancel-item-edit': {
                document.getElementById(`item-display-${itemId}`).classList.remove('hidden');
                document.getElementById(`item-edit-area-${itemId}`).classList.add('hidden');
                break;
            }
            case 'save-item-edit': {
                const editArea = document.getElementById(`item-edit-area-${itemId}`);
                const updates = {
                    name: editArea.querySelector('.edit-item-name').value,
                    description: editArea.querySelector('.edit-item-description').value,
                    bonuses: editBonuses,
                };
                window.stores.characterActions.updateItem(itemId, updates);
                break;
            }
            case 'add-edit-bonus': {
                const bonusEditArea = document.getElementById(`item-edit-area-${itemId}`);
                const list = bonusEditArea.querySelector('.edit-bonuses-list');
                const fieldSelect = bonusEditArea.querySelector('.edit-bonus-field');
                const field = fieldSelect.value;
                const label = fieldSelect.options[fieldSelect.selectedIndex].text;
                const type = bonusEditArea.querySelector('.edit-bonus-type').value;
                const valueInput = bonusEditArea.querySelector('.edit-bonus-value');
                const value = parseInt(valueInput.value, 10);
                if (field && !isNaN(value)) {
                    const newBonus = { field, value, type };
                    editBonuses.push(newBonus);
                    const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
                    const newLi = document.createElement('li');
                    newLi.className = 'inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold pl-2.5 pr-1 py-0.5 rounded-full';
                    newLi.innerHTML = `<span>${label}: ${symbol}${value}</span><button type="button" class="ml-2 text-red-500 hover:text-red-700 font-bold">x</button>`;
                    newLi.querySelector('button').onclick = () => {
                        const index = editBonuses.findIndex(b => b === newBonus);
                        if (index > -1) editBonuses.splice(index, 1);
                        newLi.remove();
                    };
                    list.appendChild(newLi);
                    valueInput.value = '';
                }
                break;
            }
            case 'remove-edit-bonus': {
                actionTarget.parentElement.remove();
                break;
            }
            case 'toggle-favorite':
                if (itemId) window.stores.characterActions.toggleFavoriteItem(itemId);
                break;
            case 'delete-item':
                if (itemId && confirm('Are you sure you want to delete this item?')) {
                    window.stores.characterActions.deleteItem(itemId);
                }
                break;
            case 'add-class':
                window.stores.characterActions.addClass();
                break;
            case 'remove-class':
                window.stores.characterActions.removeClass(index);
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
                window.stores.characterActions.removeLanguage(lang);
                break;
            case 'edit-homebrew-race': {
                const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
                const raceToEdit = homebrewRaces[raceName];
                if (raceToEdit) {
                    document.getElementById('modal-container').innerHTML = window.renderHomebrewRaceModal(raceToEdit);
                    window.attachHomebrewRaceModalHandlers(raceToEdit);
                }
                break;
            }
            case 'delete-homebrew-race': {
                if (confirm(`Are you sure you want to delete the "${raceName}" race?`)) {
                    window.stores.character.deleteHomebrewRace(raceName);
                }
                break;
            }
            case 'edit-homebrew-subrace': {
                const allRaces = {...window.dndData.races, ...JSON.parse(localStorage.getItem('homebrewRaces') || '{}')};
                const baseRace = allRaces[raceName];
                const subraceToEdit = baseRace?.subraces.find(s => s.name === subraceName);
                if (subraceToEdit) {
                    document.getElementById('modal-container').innerHTML = window.renderHomebrewSubraceModal(raceName, subraceToEdit);
                    window.attachHomebrewSubraceModalHandlers(raceName, subraceToEdit);
                }
                break;
            }
            case 'delete-homebrew-subrace': {
                 if (confirm(`Are you sure you want to delete the "${subraceName}" subrace?`)) {
                    window.stores.character.deleteHomebrewSubrace(raceName, subraceName);
                }
                break;
            }
        }
    });

    contentArea.addEventListener('change', (e) => {
        const target = e.target;
        const { action, itemId, itemType } = target.dataset;

        // --- THIS LOGIC IS NOW UPDATED ---
        if (action === 'toggle-attunement') {
            window.stores.characterActions.toggleAttunement(itemId);
        } else if (action === 'assign-to-container') {
            window.stores.characterActions.assignItemToContainer(itemId, target.value);
        } else if (action === 'equip-weapon') {
            const slot = target.checked ? 'Wielded' : 'none';
            window.stores.characterActions.equipItemToSlot(itemId, slot);
        } else if (action === 'equip-armor-shield') {
            const slot = target.checked ? (itemType === 'armor' ? 'Armor' : 'Shield') : 'none';
            window.stores.characterActions.equipItemToSlot(itemId, slot);
        } 
        // (The 'equip-to-slot' case has been removed as it's no longer needed)
        // (All other change handlers like race, class, etc. are unchanged)
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