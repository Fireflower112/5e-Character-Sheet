// js/all-items-page.js

window.renderItemBonuses = (item) => {
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

window.renderItemCard = (character, item) => {
    return `
        <div id="item-card-${item.id}" class="bg-white p-4 rounded-lg shadow-sm">
            <div id="item-display-${item.id}">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-grow"><h4 class="font-semibold text-lg">${item.name}</h4><p class="text-xs text-gray-500">Weight: ${item.weight || 0} lbs</p></div>
                    <div class="flex items-center space-x-3">
                        <button data-action="edit-item" data-item-id="${item.id}" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">Edit</button>
                        <button data-action="delete-item" data-item-id="${item.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                    </div>
                </div>
                ${item.description ? `<p class="text-gray-600 text-sm mt-2">${item.description}</p>` : ''}
                ${window.renderItemBonuses(item)}
            </div>
            <div id="item-edit-area-${item.id}" class="hidden"></div>
        </div>`;
};

window.renderItemEditForm = (item) => {
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

window.AllItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const skillList = ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const attunementItems = allItems.filter(i => i.requiresAttunement);
    const remainingItems = allItems.filter(i => !i.requiresAttunement);
    const weapons = remainingItems.filter(i => i.itemType === 'weapon');
    const armor = remainingItems.filter(i => i.itemType === 'armor');
    const shields = remainingItems.filter(i => i.itemType === 'shield');
    const others = remainingItems.filter(i => !['weapon', 'armor', 'shield'].includes(i.itemType));

    const renderCategorySection = (title, items) => {
        if (items.length === 0) return '';
        return `<details class="bg-gray-50 p-4 rounded-xl shadow-sm" open><summary class="text-xl font-semibold cursor-pointer">${title}</summary><div class="mt-3 space-y-3">${items.map(item => window.renderItemCard(character, item)).join('')}</div></details>`;
    };

    return `
        <div class="space-y-6">
            ${renderCategorySection('Items Requiring Attunement', attunementItems)}
            ${renderCategorySection('Weapons', weapons)}
            ${renderCategorySection('Armor', armor)}
            ${renderCategorySection('Shields', shields)}
            ${renderCategorySection('Other Items', others)}
            <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                <h3 class="text-lg font-semibold mb-3">Add New Item</h3>
                <form id="add-item-form" class="space-y-4">
                    <div class="grid grid-cols-3 gap-4"><div class="col-span-2"><label class="block text-sm font-medium">Item Name</label><input type="text" id="item-name" required class="w-full p-2 border rounded-md"></div><div><label class="block text-sm font-medium">Weight (lbs)</label><input type="number" id="item-weight" value="0" step="0.1" class="w-full p-2 border rounded-md"></div></div>
                    <textarea id="item-description" placeholder="Item Description" class="w-full p-2 border rounded-md"></textarea>
                    <div class="flex justify-between items-center"><div><label class="block text-sm font-medium mb-1">Item Type</label><select id="item-type" class="p-2 border rounded-md"><option value="other">Other</option><option value="weapon">Weapon</option><option value="armor">Armor</option><option value="shield">Shield</option></select></div><div class="flex items-center space-x-2 pt-5"><input type="checkbox" id="item-requires-attunement" class="h-4 w-4 rounded text-indigo-600"><label for="item-requires-attunement" class="font-medium text-gray-700">Requires Attunement</label></div></div>
                    <div id="bonuses-container" class="space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Bonuses:</h4><div class="flex items-end gap-2 text-sm"><select id="add-item-bonus-field" class="p-1 border rounded flex-grow"><optgroup label="Primary Stats"><option value="ac">Armor Class</option><option value="initiative">Initiative</option></optgroup><optgroup label="Ability Scores">${abilityScores.map(s => `<option value="${s}">${s.toUpperCase()}</option>`).join('')}</optgroup><optgroup label="Skills">${skillList.map(s => `<option value="${s.toLowerCase().replace(/ /g, '')}">${s}</option>`).join('')}</optgroup></select><select id="add-item-bonus-type" class="p-1 border rounded"><option value="enhancement">Enhance (+)</option><option value="override">Override (=)</option></select><div><label class="block font-medium">Value</label><input type="number" id="add-item-bonus-value" class="w-20 p-1 border rounded" placeholder="+1"></div><button type="button" id="add-bonus-btn" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button></div><ul id="bonuses-list" class="flex flex-wrap gap-2 pt-2"></ul></div>
                    <button type="button" id="add-item-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Item</button>
                </form>
            </div>
        </div>`;
};

window.attachAllItemsPageHandlers = () => {
    const addItemForm = document.getElementById('add-item-form');
    if (!addItemForm) return;

    let itemBonuses = [];
    const addBonusBtn = document.getElementById('add-bonus-btn');
    const bonusesList = document.getElementById('bonuses-list');
    
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

        if (newItemData.name) {
            window.stores.characterActions.addItem(newItemData);
            window.showMessage('Item added!', 'green');
            addItemForm.reset();
            bonusesList.innerHTML = '';
            itemBonuses = [];
        } else {
            window.showMessage('Item name is required.', 'red');
        }
    };
};