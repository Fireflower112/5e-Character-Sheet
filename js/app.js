// js/app.js

// This helper function is on the global window object to be accessible
window.renderItemDetailsModal = (item) => {
    const skillLabelMap = new Map([
        ["acrobatics", "Acrobatics"], ["appraise", "Appraise"], ["bluff", "Bluff"], ["climb", "Climb"],
        ["diplomacy", "Diplomacy"], ["disableDevice", "Disable Device"], ["disguise", "Disguise"],
        ["escapeArtist", "Escape Artist"], ["fly", "Fly"], ["handleAnimal", "Handle Animal"], ["heal", "Heal"],
        ["intimidate", "Intimidate"], ["knowledgeArcana", "Knowledge (Arcana)"], ["knowledgeDungeoneering", "Knowledge (Dungeoneering)"],
        ["knowledgeEngineering", "Knowledge (Engineering)"], ["knowledgeGeography", "Knowledge (Geography)"],
        ["knowledgeHistory", "Knowledge (History)"], ["knowledgeLocal", "Knowledge (Local)"], ["knowledgeNature", "Knowledge (Nature)"],
        ["knowledgeNobility", "Knowledge (Nobility)"], ["knowledgePlanes", "Knowledge (Planes)"], ["knowledgeReligion", "Knowledge (Religion)"],
        ["linguistics", "Linguistics"], ["perception", "Perception"], ["perform", "Perform"], ["profession", "Profession"],
        ["ride", "Ride"], ["senseMotive", "Sense Motive"], ["sleightOfHand", "Sleight of Hand"],
        ["spellcraft", "Spellcraft"], ["stealth", "Stealth"], ["survival", "Survival"], ["swim", "Swim"],
        ["useMagicDevice", "Use Magic Device"], ["concentration", "Concentration"]
    ]);
    
    const bonusesHtml = (item.bonuses && item.bonuses.length > 0)
        ? `<div class="mt-4 pt-2 border-t">
            <h4 class="font-semibold text-gray-700 mb-2">Bonuses:</h4>
            <div class="flex flex-wrap gap-2">
                ${item.bonuses.map(bonus => {
                    const label = skillLabelMap.get(bonus.field) || bonus.field.toUpperCase();
                    const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : '');
                    return `<span class="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">${label}: ${symbol}${bonus.value}</span>`;
                }).join('')}
            </div>
        </div>`
        : '';

    return `
        <h3 class="text-2xl font-bold mb-2">${item.name}</h3>
        <p class="text-gray-600 mb-4 italic">${item.description || 'No description.'}</p>
        ${bonusesHtml}
        <button id="close-modal-btn" class="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Close</button>
    `;
};

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');
    const itemModal = document.getElementById('item-modal');
    const itemModalContent = document.getElementById('item-modal-content');

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
    
    // This function now correctly calls attachInventoryHandlers
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

    // A single listener for all CLICK actions
    contentArea.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action, itemId, subpage } = actionTarget.dataset;

        switch (action) {
            case 'show-item-details':
                const item = window.stores.character.get().inventory.items[itemId];
                if (item) {
                    itemModalContent.innerHTML = window.renderItemDetailsModal(item);
                    itemModal.classList.add('show');
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

    // A single listener for all CHANGE events
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

    itemModal.addEventListener('click', (e) => {
        if (e.target.id === 'item-modal' || e.target.id === 'close-modal-btn') {
            itemModal.classList.remove('show');
        }
    });

    // --- Initialization ---
    window.stores.character.subscribe(renderApp);
    window.stores.character.init();
});