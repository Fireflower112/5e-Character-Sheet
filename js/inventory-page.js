// js/inventory-page.js (Main App Logic)

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const summaryHeaderArea = document.getElementById('character-summary-header');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    
    let currentPage = 'dashboard';
    let currentSubPage = 'skills';

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
        if (window.attachDashboardCombatHandlers) window.attachDashboardCombatHandlers();
        if (window.attachInfoPageHandlers) window.attachInfoPageHandlers();
        if (window.attachSkillsPageHandlers) window.attachSkillsPageHandlers();
        if (window.attachInventoryHandlers) window.attachInventoryHandlers();
        if (window.attachSpellsPageHandlers) window.attachSpellsPageHandlers();
        if (window.attachNotesPageHandlers) window.attachNotesPageHandlers();
        if (window.attachStoredItemsPageHandlers) window.attachStoredItemsPageHandlers();
        if (window.attachAbilitiesEditorHandlers) window.attachAbilitiesEditorHandlers();
        if (window.attachSpellsEditorHandlers) window.attachSpellsEditorHandlers();
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

    contentArea.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action, itemId, subpage, abilityId } = actionTarget.dataset;

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
            case 'toggle-edit-item': 
                document.getElementById(`item-display-${itemId}`).classList.toggle('hidden');
                document.getElementById(`item-edit-area-${itemId}`).classList.toggle('hidden');
                break;
            case 'cancel-edit':
                document.getElementById(`item-display-${itemId}`).classList.remove('hidden');
                document.getElementById(`item-edit-area-${itemId}`).classList.add('hidden');
                break;
            case 'save-item-changes':
                const editArea = document.getElementById(`item-edit-area-${itemId}`);
                const character = window.stores.character.get();
                const item = character.inventory.items[itemId];
                
                const newBonuses = Array.from(editArea.querySelectorAll('.edit-bonuses-list li')).map(li => ({
                    field: li.dataset.field,
                    value: parseInt(li.dataset.value, 10),
                    type: li.dataset.type
                }));
                
                const updates = {
                    name: editArea.querySelector('.edit-item-name').value,
                    description: editArea.querySelector('.edit-item-description').value,
                    bonuses: newBonuses
                };

                if (item.itemType === 'weapon') {
                    updates.numDice = parseInt(editArea.querySelector('.edit-item-numDice').value, 10);
                    updates.dieType = parseInt(editArea.querySelector('.edit-item-dieType').value, 10);
                }
                if (item.itemType === 'armor') {
                    updates.acBase = parseInt(editArea.querySelector('.edit-item-acBase').value, 10);
                    updates.armorType = editArea.querySelector('.edit-item-armorType').value;
                }
                 if (item.itemType === 'shield') {
                    updates.acBonus = parseInt(editArea.querySelector('.edit-item-acBonus').value, 10);
                }
                
                window.stores.character.updateItem(itemId, updates);
                window.showMessage('Item updated!', 'green');
                break;
            case 'add-bonus-to-edit':
                 const bonusEditArea = document.getElementById(`item-edit-area-${itemId}`);
                 const list = bonusEditArea.querySelector('.edit-bonuses-list');
                 const fieldSelect = bonusEditArea.querySelector('.edit-bonus-field');
                 const field = fieldSelect.value;
                 const label = fieldSelect.options[fieldSelect.selectedIndex].text;
                 const type = bonusEditArea.querySelector('.edit-bonus-type').value;
                 const valueInput = bonusEditArea.querySelector('.edit-bonus-value');
                 const value = parseInt(valueInput.value, 10);

                 if (field && !isNaN(value)) {
                    const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
                    const newLi = document.createElement('li');
                    newLi.className = 'flex items-center justify-between bg-gray-200 px-2 py-0.5 rounded-full text-xs';
                    newLi.dataset.field = field;
                    newLi.dataset.value = value;
                    newLi.dataset.type = type;
                    newLi.innerHTML = `<span>${label}: ${symbol}${value}</span><button type="button" data-action="remove-bonus-from-edit" class="ml-2 text-red-500 hover:text-red-700 font-bold">x</button>`;
                    list.appendChild(newLi);
                    valueInput.value = '';
                 }
                break;
            case 'remove-bonus-from-edit':
                actionTarget.parentElement.remove();
                break;
            case 'delete-ability':
                if (confirm('Are you sure you want to delete this ability?')) {
                    window.stores.character.deleteAbility(abilityId);
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
            window.stores.character.updateItem(itemId, { [field]: target.value });
        }
    });

    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = button.dataset.page;
            if (currentPage === 'dashboard') currentSubPage = 'skills';
            if (currentPage === 'inventory') currentSubPage = 'equipped';
            if (currentPage === 'notes') currentSubPage = 'character';
            if (currentPage === 'character-editor') currentSubPage = 'basic';
            renderApp();
        });
    });

    window.stores.character.subscribe(renderApp);
    window.stores.character.init();
});