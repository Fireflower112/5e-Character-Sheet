// js/main.js

const DndSheet = {
    pages: {},
    stores: {},
    data: {},
    helpers: {}
};

function loadHomebrewData() {
    try {
        const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
        Object.assign(DndSheet.data.races, homebrewRaces);
    } catch (e) {
        console.error("Failed to load homebrew data:", e);
    }
}

DndSheet.helpers.showMessage = (message, color) => {
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
    let editBonuses = [];

    const renderApp = () => {
        const character = DndSheet.stores.character.get();
        summaryHeaderArea.innerHTML = DndSheet.pages.renderCharacterSummaryHeader(character);
        if (!character || Object.keys(character).length === 0) {
            contentArea.innerHTML = '<p>Loading character...</p>';
            return;
        }
        let pageHtml = '';
        switch (currentPage) {
            case 'dashboard': pageHtml = DndSheet.pages.DashboardPage(character, currentSubPage); break;
            case 'character-editor': pageHtml = DndSheet.pages.CharacterEditorPage(character, currentSubPage); break;
            case 'inventory': pageHtml = DndSheet.pages.InventoryContainerPage(character, currentSubPage); break;
            case 'homebrew': pageHtml = DndSheet.pages.HomebrewEditorPage(); break;
            case 'notes': pageHtml = DndSheet.pages.NotesPage(character, currentSubPage); break;
            default: pageHtml = '<h2>Page Not Found</h2>';
        }
        contentArea.innerHTML = pageHtml;
        updateNavStyles();
        if (currentPage === 'inventory' && currentSubPage === 'equipped') { DndSheet.pages.attachEquippedItemsPageHandlers(); }
        if (currentPage === 'inventory' && currentSubPage === 'stored') { DndSheet.pages.attachStoredItemsPageHandlers(); }
        if (currentPage === 'inventory' && currentSubPage === 'all') { DndSheet.pages.attachAllItemsPageHandlers(); }
        if (currentPage === 'notes') { DndSheet.pages.attachNotesPageHandlers(); }
        if (currentPage === 'character-editor' && currentSubPage === 'spells') { DndSheet.pages.attachSpellsEditorHandlers(); }
        if (currentPage === 'dashboard' && currentSubPage === 'spells') { DndSheet.pages.attachSpellsPageHandlers(); }
        if (currentPage === 'character-editor' && currentSubPage === 'abilities') { DndSheet.pages.attachAbilitiesEditorHandlers(); }
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
        const { action, subpage, itemId, raceName, subraceName, index, lang, abilityId, spellId } = actionTarget.dataset;

        switch (action) {
            case 'toggle-accordion': {
                const details = actionTarget.nextElementSibling;
                if (details && details.classList.contains('accordion-details')) {
                    details.classList.toggle('hidden');
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
                const character = DndSheet.stores.character.get();
                const item = character.inventory.items[itemId];
                if (item) {
                    editBonuses = [...(item.bonuses || [])];
                    document.getElementById(`item-display-${itemId}`).classList.add('hidden');
                    const editArea = document.getElementById(`item-edit-area-${itemId}`);
                    editArea.innerHTML = DndSheet.pages.renderItemEditForm(item);
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
                const updates = { name: editArea.querySelector('.edit-item-name').value, description: editArea.querySelector('.edit-item-description').value, bonuses: editBonuses };
                DndSheet.stores.characterActions.updateItem(itemId, updates);
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
            case 'remove-edit-bonus': { actionTarget.parentElement.remove(); break; }
            case 'toggle-favorite': if (itemId) DndSheet.stores.characterActions.toggleFavoriteItem(itemId); break;
            case 'toggle-favorite-spell': if (spellId) DndSheet.stores.characterActions.toggleFavoriteSpell(spellId); break;
            case 'delete-item': if (itemId && confirm('Are you sure?')) DndSheet.stores.characterActions.deleteItem(itemId); break;
            case 'delete-ability': if (abilityId && confirm('Are you sure?')) DndSheet.stores.characterActions.deleteAbility(abilityId); break;
            case 'add-class': DndSheet.stores.characterActions.addClass(); break;
            case 'remove-class': DndSheet.stores.characterActions.removeClass(index); break;
            case 'open-homebrew-modal':
                document.getElementById('modal-container').innerHTML = DndSheet.pages.renderHomebrewRaceModal();
                DndSheet.pages.attachHomebrewRaceModalHandlers();
                break;
            case 'open-homebrew-subrace-modal': {
                const character = DndSheet.stores.character.get();
                document.getElementById('modal-container').innerHTML = DndSheet.pages.renderHomebrewSubraceModal(character.race);
                DndSheet.pages.attachHomebrewSubraceModalHandlers(character.race);
                break;
            }
            case 'remove-language': DndSheet.stores.characterActions.removeLanguage(lang); break;
            case 'edit-homebrew-race': {
                const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
                const raceToEdit = homebrewRaces[raceName];
                if (raceToEdit) {
                    document.getElementById('modal-container').innerHTML = DndSheet.pages.renderHomebrewRaceModal(raceToEdit);
                    DndSheet.pages.attachHomebrewRaceModalHandlers(raceToEdit);
                }
                break;
            }
            case 'delete-homebrew-race': {
                if (confirm(`Are you sure you want to delete the "${raceName}" race?`)) {
                    DndSheet.stores.character.deleteHomebrewRace(raceName);
                }
                break;
            }
            case 'edit-homebrew-subrace': {
                const allRaces = {...DndSheet.data.races, ...JSON.parse(localStorage.getItem('homebrewRaces') || '{}')};
                const baseRace = allRaces[raceName];
                const subraceToEdit = baseRace?.subraces.find(s => s.name === subraceName);
                if (subraceToEdit) {
                    document.getElementById('modal-container').innerHTML = DndSheet.pages.renderHomebrewSubraceModal(raceName, subraceToEdit);
                    DndSheet.pages.attachHomebrewSubraceModalHandlers(raceName, subraceToEdit);
                }
                break;
            }
            case 'delete-homebrew-subrace': {
                if (confirm(`Are you sure you want to delete the "${subraceName}" subrace?`)) {
                    DndSheet.stores.character.deleteHomebrewSubrace(raceName, subraceName);
                }
                break;
            }
        }
    });

    contentArea.addEventListener('change', (e) => {
        const target = e.target;
        const { action, field, skill, type, save, itemId, itemType } = target.dataset;
        if (action === 'toggle-attunement') { DndSheet.stores.characterActions.toggleAttunement(itemId); } 
        else if (action === 'assign-to-container') { DndSheet.stores.characterActions.assignItemToContainer(itemId, target.value); } 
        else if (action === 'equip-weapon') { const slot = target.checked ? 'Wielded' : null; DndSheet.stores.characterActions.equipItemToSlot(itemId, slot); } 
        else if (action === 'equip-armor') { const slot = target.checked ? 'Armor' : null; DndSheet.stores.characterActions.equipItemToSlot(itemId, slot); } 
        else if (action === 'equip-shield') { const slot = target.checked ? 'Shield' : null; DndSheet.stores.characterActions.equipItemToSlot(itemId, slot); } 
        else if (field === 'race') { DndSheet.stores.characterActions.handleRaceChange(target.value); } 
        else if (field === 'subrace') { DndSheet.stores.characterActions.applySubrace(target.value); } 
        else if (action === 'update-class') { DndSheet.stores.characterActions.updateClass(target.dataset.index, target.dataset.field, target.value); } 
        else if (action === 'update-subclass') { DndSheet.stores.characterActions.updateSubclass(target.dataset.index, target.value); } 
        else if (skill && type) { const c = DndSheet.stores.character.get(); const n = { ...c.skills }; n[skill][type] = target.checked; DndSheet.stores.character.set({ skills: n }); } 
        else if (save) { const c = DndSheet.stores.character.get(); const n = { ...c.savingThrows }; n[save].proficient = target.checked; DndSheet.stores.character.set({ savingThrows: n }); } 
        else if (target.id === 'language-input') { DndSheet.stores.characterActions.addLanguage(target.value); target.value = ''; }
        else if (action === 'toggle-hp-override') {
            const overrideValue = target.checked ? (DndSheet.stores.character.get().maxHp || 0) : null;
            DndSheet.stores.characterActions.updateCharacterProperty('hpOverride', overrideValue);
        }
    });
    
    contentArea.addEventListener('input', (e) => {
        const { action, field, subfield, index } = e.target.dataset;
        if (field === 'race' || field === 'subrace' || action === 'update-class') return;
        if (field) { DndSheet.stores.characterActions.updateCharacterProperty(field, e.target.value, subfield); }
    });

    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = button.dataset.page;
            localStorage.setItem('currentPage', currentPage);
            if (currentPage === 'dashboard') currentSubPage = 'skills';
            else if (currentPage === 'inventory') currentSubPage = 'equipped';
            else if (currentPage === 'notes') currentSubPage = 'character';
            else if (currentPage === 'character-editor') currentSubPage = 'basic';
            else currentSubPage = ''; // For pages without sub-tabs, like Homebrew
            
            localStorage.setItem('currentSubPage', currentSubPage);
            renderApp();
        });
    });

    DndSheet.stores.character.subscribe(renderApp);
    DndSheet.stores.character.init();
});