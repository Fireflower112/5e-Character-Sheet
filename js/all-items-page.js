// js/all-items-page.js

// NEW: Helper function to get styling for different rarities
DndSheet.pages.getRarityInfo = (rarity = 'common') => {
    const r = rarity.toLowerCase();
    switch (r) {
        case 'uncommon': return { text: 'Uncommon', class: 'text-green-700 font-semibold' };
        case 'rare': return { text: 'Rare', class: 'text-blue-700 font-semibold' };
        case 'very rare': return { text: 'Very Rare', class: 'text-indigo-700 font-semibold' };
        case 'legendary': return { text: 'Legendary', class: 'text-amber-700 font-semibold' };
        case 'artifact': return { text: 'Artifact', class: 'text-red-700 font-semibold' };
        default: return { text: 'Common', class: 'text-gray-600' };
    }
};

DndSheet.pages.renderItemBonuses = (item) => {
    if (!item.bonuses || item.bonuses.length === 0) return '';
    const skillList = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const primaryStats = { 'ac': 'Armor Class', 'initiative': 'Initiative' };
    const getLabel = (field) => {
        if (primaryStats[field]) return primaryStats[field];
        if (abilityScores.includes(field)) return field.toUpperCase();
        const skill = skillList.find(s => s.toLowerCase().replace(/ /g, '') === field);
        return skill || field;
    };
    return `<div class="mt-2 pt-2 border-t text-xs"><h5 class="font-semibold mb-1 text-gray-600">Bonuses:</h5><div class="flex flex-wrap gap-1">${item.bonuses.map(bonus => { const label = getLabel(bonus.field); const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : ''); return `<span class="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full">${label}: ${symbol}${bonus.value}</span>`; }).join('')}</div></div>`;
};

DndSheet.pages.renderItemCard = (character, item) => {
    const containers = Object.values(character.inventory.containers || {});
    // MODIFIED: Call the new helper function to get rarity text and color
    const rarityInfo = DndSheet.pages.getRarityInfo(item.rarity);
    
    let equipControl = '';
    if (item.requiresAttunement) {
        equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="attune-${item.id}" data-item-id="${item.id}" data-action="toggle-attunement" ${item.attuned ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="attune-${item.id}" class="text-gray-700">Attuned</label></div>`;
    } else if (item.itemType === 'weapon') {
        const slot = item.equippedSlot === 'Wielded' ? 'Wielded' : null;
        equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-weapon-${item.id}" data-item-id="${item.id}" data-action="equip-weapon" ${slot ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-weapon-${item.id}" class="text-gray-700">Wielded</label></div>`;
    } else if (item.itemType === 'armor') {
        equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-armor-${item.id}" data-item-id="${item.id}" data-action="equip-armor" ${item.equippedSlot === 'Armor' ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-armor-${item.id}" class="text-gray-700">Equipped</label></div>`;
    } else if (item.itemType === 'shield') {
        equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-shield-${item.id}" data-item-id="${item.id}" data-action="equip-shield" ${item.equippedSlot === 'Shield' ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-shield-${item.id}" class="text-gray-700">Equipped</label></div>`;
    }


    const favoriteButton = (item.itemType === 'weapon') ? `<button data-action="toggle-favorite" data-item-id="${item.id}" class="text-gray-400 hover:text-yellow-500" title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${item.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${item.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></button>` : '';
    
    let containerControl = '';
    if (!item.equippedSlot && !item.attuned) {
        containerControl = `<div class="mt-2"><label class="text-xs font-medium text-gray-600">Store in:</label><select data-item-id="${item.id}" data-action="assign-to-container" class="w-full p-1 border rounded-md text-sm bg-gray-50"><option value="none" ${!item.containerId ? 'selected' : ''}>Not Stored</option>${Object.values(containers).map(c => `<option value="${c.id}" ${item.containerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>`;
    }

    return `
        <div id="item-card-${item.id}" class="bg-white p-4 rounded-lg shadow-sm" data-accordion-wrapper>
            <div id="item-display-${item.id}">
                 <div class="flex items-start justify-between gap-2">
                    <button data-action="toggle-accordion" class="flex-grow text-left">
                        <h4 class="font-semibold text-lg hover:text-indigo-600">${item.name}</h4>
                        <p class="text-xs text-gray-500">Weight: ${item.weight || 0} lbs | <span class="${rarityInfo.class}">${rarityInfo.text}</span></p>
                    </button>
                    <div class="flex items-center space-x-3 flex-shrink-0">
                        ${favoriteButton}
                        ${equipControl}
                        <button data-action="edit-item" data-item-id="${item.id}" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">Edit</button>
                        <button data-action="delete-item" data-item-id="${item.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                    </div>
                </div>
                <div class="accordion-details hidden mt-2 pt-2 border-t">
                    ${item.description ? `<p class="text-gray-600 text-sm">${item.description}</p>` : ''}
                    ${DndSheet.pages.renderItemBonuses(item)}
                    ${containerControl}
                </div>
            </div>
            <div id="item-edit-area-${item.id}" class="hidden"></div>
        </div>`;
};

DndSheet.pages.renderItemEditForm = (item) => {
    const skillList = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const primaryStats = { 'ac': 'Armor Class', 'initiative': 'Initiative' };
    const getLabel = (field) => {
        if (primaryStats[field]) return primaryStats[field];
        if (abilityScores.includes(field)) return field.toUpperCase();
        const skill = skillList.find(s => s.toLowerCase().replace(/ /g, '') === field);
        return skill || field;
    };
    const existingBonusesHtml = (item.bonuses || []).map((bonus, index) => {
        const label = getLabel(bonus.field);
        const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : '');
        return `<li data-index="${index}" class="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold pl-2.5 pr-1 py-0.5 rounded-full">${label}: ${symbol}${bonus.value} <button data-action="remove-edit-bonus" class="ml-1 font-bold text-red-500">x</button></li>`;
    }).join('');

    return `
        <div class="space-y-3">
            <div><label class="block text-sm font-medium">Name</label><input type="text" class="edit-item-name w-full p-1 border rounded" value="${item.name}"></div>
            <div><label class="block text-sm font-medium">Description</label><textarea class="edit-item-description w-full p-1 border rounded">${item.description || ''}</textarea></div>
            <div class="space-y-2 border-t pt-2">
                <h4 class="font-medium text-gray-700 text-sm">Bonuses:</h4>
                <ul class="edit-bonuses-list flex flex-wrap gap-2">${existingBonusesHtml}</ul>
                <div class="flex items-end gap-2 text-sm">
                    <select class="edit-bonus-field p-1 border rounded flex-grow"><optgroup label="Primary Stats"><option value="ac">AC</option><option value="initiative">Initiative</option></optgroup><optgroup label="Ability Scores">${abilityScores.map(s=>`<option value="${s}">${s.toUpperCase()}</option>`).join('')}</optgroup><optgroup label="Skills">${skillList.map(s=>`<option value="${s.toLowerCase().replace(/ /g,'')}">${s}</option>`).join('')}</optgroup></select>
                    <select class="edit-bonus-type p-1 border rounded"><option value="enhancement">Enhance (+)</option><option value="override">Override (=)</option></select>
                    <input type="number" class="edit-bonus-value w-20 p-1 border rounded" placeholder="+1">
                    <button type="button" data-action="add-edit-bonus" data-item-id="${item.id}" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Add</button>
                </div>
            </div>
            <div class="flex justify-end space-x-2 mt-4">
                <button data-action="cancel-item-edit" data-item-id="${item.id}" class="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button data-action="save-item-edit" data-item-id="${item.id}" class="px-3 py-1 bg-green-500 text-white rounded">Save Changes</button>
            </div>
        </div>`;
};


DndSheet.pages.AllItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const skillList = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const attunementItems = allItems.filter(i => i.requiresAttunement);
    const remainingItems = allItems.filter(i => !i.requiresAttunement);
    const weapons = remainingItems.filter(i => i.itemType === 'weapon');
    const armor = remainingItems.filter(i => i.itemType === 'armor');
    const shields = remainingItems.filter(i => i.itemType === 'shield');
    const others = remainingItems.filter(i => !['weapon', 'armor', 'shield'].includes(i.itemType));

    // MODIFIED: Changed this function to use the JS-driven accordion system for consistency
    const renderCategorySection = (title, items) => {
        if (items.length === 0) return '';
        return `
            <div class="bg-gray-50 p-4 rounded-xl shadow-sm" data-accordion-wrapper>
                <button class="w-full text-left text-xl font-semibold cursor-pointer" data-action="toggle-accordion">${title}</button>
                <div class="accordion-details mt-3 space-y-3">
                    ${items.map(item => DndSheet.pages.renderItemCard(character, item)).join('')}
                </div>
            </div>`;
    };

     return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
                ${renderCategorySection('Items Requiring Attunement', attunementItems)}
                ${renderCategorySection('Weapons', weapons)}
                ${renderCategorySection('Armor', armor)}
                ${renderCategorySection('Shields', shields)}
                ${renderCategorySection('Other Items', others)}
            </div>

            <div class="space-y-6">
                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Item Browser</h3>
                    <div class="flex items-center space-x-3 mb-3">
                        <input type="text" id="item-search-input" placeholder="Search for an item..." class="w-full p-2 border rounded-md flex-grow">
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="magic-item-filter" class="h-4 w-4 rounded text-indigo-600">
                            <label for="magic-item-filter" class="text-sm font-medium text-gray-700">Magic Items</label>
                        </div>
                    </div>
                    <div id="item-browser-results" class="bg-white rounded-md shadow-sm max-h-96 overflow-y-auto">
                        <p class="text-gray-500 italic p-4 text-center">Select filter and start typing...</p>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    </div>
            </div>
        </div>`;
};

DndSheet.pages.attachAllItemsPageHandlers = () => { 
    const addItemForm = document.getElementById('add-item-form');
    if (!addItemForm) return;

    let itemBonuses = [];
    const addBonusBtn = document.getElementById('add-bonus-btn');
    const bonusesList = document.getElementById('bonuses-list');
    const itemTypeSelect = document.getElementById('item-type');
    const itemFields = {
        weapon: document.getElementById('weapon-fields'),
        armor: document.getElementById('armor-fields'),
        shield: document.getElementById('shield-fields'),
    };
    
    itemTypeSelect.onchange = (e) => {
        const selectedType = e.target.value;
        Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
        if (itemFields[selectedType]) {
            itemFields[selectedType].classList.remove('hidden');
        }
    };
    
    addBonusBtn.onclick = () => {
        const bonusValueInput = document.getElementById('add-item-bonus-value');
        const value = parseInt(bonusValueInput.value, 10);
        const fieldSelect = document.getElementById('add-item-bonus-field');
        const field = fieldSelect.value;
        const fieldLabel = fieldSelect.options[fieldSelect.selectedIndex].text;
        const typeSelect = document.getElementById('add-item-bonus-type');
        const type = typeSelect.value;

        if (field && !isNaN(value)) {
            const bonus = { field, value, type };
            itemBonuses.push(bonus);
            const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
            const listItem = document.createElement('li');
            listItem.innerHTML = `${fieldLabel}: ${symbol}${value} <button type="button" class="remove-bonus-btn text-red-500 ml-1 font-bold">x</button>`;
            listItem.className = 'inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold pl-2.5 pr-1 py-0.5 rounded-full';
            listItem.querySelector('.remove-bonus-btn').onclick = () => {
                const index = itemBonuses.findIndex(b => b === bonus);
                if (index > -1) itemBonuses.splice(index, 1);
                listItem.remove();
            };
            bonusesList.appendChild(listItem);
            bonusValueInput.value = '';
        }
    };

    const addItemBtn = document.getElementById('add-item-btn');
    addItemBtn.onclick = () => {
        const newItemData = {
            name: document.getElementById('item-name').value,
            weight: parseFloat(document.getElementById('item-weight').value) || 0,
            description: document.getElementById('item-description').value,
            itemType: document.getElementById('item-type').value,
            requiresAttunement: document.getElementById('item-requires-attunement').checked,
            bonuses: [...itemBonuses],
        };

        if (newItemData.itemType === 'weapon') {
            Object.assign(newItemData, {
                numDice: parseInt(document.getElementById('weapon-num-dice').value, 10),
                dieType: parseInt(document.getElementById('weapon-die-type').value, 10),
            });
        } else if (newItemData.itemType === 'armor') {
            newItemData.armorType = document.getElementById('armor-type').value;
            newItemData.acBase = parseInt(document.getElementById('armor-ac-base').value, 10);
        } else if (newItemData.itemType === 'shield') {
            newItemData.acBonus = parseInt(document.getElementById('shield-ac-bonus').value, 10);
        }

        if (newItemData.name) {
            DndSheet.stores.characterActions.addItem(newItemData);
            DndSheet.helpers.showMessage('Item added!', 'green');
            addItemForm.reset();
            bonusesList.innerHTML = '';
            itemBonuses = [];
            Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
        } else {
            DndSheet.helpers.showMessage('Item name is required.', 'red');
        }
    };
};