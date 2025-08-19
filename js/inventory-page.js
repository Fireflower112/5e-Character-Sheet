// js/inventory-page.js
window.InventoryPage = (character) => {
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const bonusFields = [...abilityScores, 'concentration'];

    const renderItemDetails = (item) => {
        switch (item.itemType) {
            case 'weapon':
                return `
                    <div class="mt-2 text-sm text-gray-700 space-y-2">
                        <div class="flex items-center justify-between">
                            <span><strong>Damage:</strong> <input type="number" value="${item.numDice || 1}" data-item-id="${item.id}" data-field="numDice" class="w-12 text-center p-1 border rounded-md"> D <input type="number" value="${item.dieType || 6}" data-item-id="${item.id}" data-field="dieType" class="w-12 text-center p-1 border rounded-md"></span>
                            <span><strong>Crit:</strong> x<input type="number" value="${item.critMultiplier || 2}" data-item-id="${item.id}" data-field="critMultiplier" class="w-12 text-center p-1 border rounded-md"></span>
                        </div>
                        <div><strong>Range:</strong> <input type="number" value="${item.range || 0}" data-item-id="${item.id}" data-field="range" class="w-16 text-center p-1 border rounded-md"> ft</div>
                    </div>`;
            case 'armor':
                return `
                    <div class="mt-2 text-sm text-gray-700 space-y-2">
                        <div><strong>Type:</strong> <select data-item-id="${item.id}" data-field="armorType" class="p-1 border rounded-md"><option value="light" ${item.armorType === 'light' ? 'selected' : ''}>Light</option><option value="medium" ${item.armorType === 'medium' ? 'selected' : ''}>Medium</option><option value="heavy" ${item.armorType === 'heavy' ? 'selected' : ''}>Heavy</option></select></div>
                        <div><strong>AC Bonus:</strong> +<input type="number" value="${item.acBonus || 0}" data-item-id="${item.id}" data-field="acBonus" class="w-12 text-center p-1 border rounded-md"></div>
                    </div>`;
            case 'shield':
                return `
                    <div class="mt-2 text-sm text-gray-700">
                        <strong>AC Bonus:</strong> +<input type="number" value="${item.acBonus || 0}" data-item-id="${item.id}" data-field="acBonus" class="w-12 text-center p-1 border rounded-md">
                    </div>`;
            default: return '';
        }
    };

    const renderItems = (items) => {
        const itemArray = Object.values(items);
        if (itemArray.length === 0) return '<p class="text-gray-500 italic">No items to display.</p>';

        return itemArray.map(item => `
            <div id="item-${item.id}" class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-lg">${item.name}</h4>
                    <div class="flex items-center space-x-3">
                        <button data-action="toggle-favorite" data-item-id="${item.id}" class="text-gray-400 hover:text-yellow-500 transition-colors" title="Favorite">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${item.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${item.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </button>
                        <input type="checkbox" id="equipped-${item.id}" data-item-id="${item.id}" data-action="toggle-equip" ${item.equipped ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/>
                        <label for="equipped-${item.id}" class="text-gray-700">Equipped</label>
                        <button onclick="window.stores.character.deleteItem('${item.id}')" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                    </div>
                </div>
                ${item.description ? `<p class="text-gray-600 text-sm mb-2">${item.description}</p>` : ''}
                ${renderItemDetails(item)}
            </div>
        `).join('');
    };

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Inventory</h2>
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm"><h3 class="text-xl font-semibold mb-3">All Items</h3><div id="all-items" class="space-y-2">${renderItems(character.inventory.items)}</div></div>
                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add New Item</h3>
                    <form id="add-item-form" class="space-y-4">
                        <input type="text" id="item-name" placeholder="Item Name" required class="w-full p-2 border rounded-md">
                        <textarea id="item-description" placeholder="Item Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                        <div><label for="item-type" class="block text-sm font-medium text-gray-700 mb-1">Item Type</label><select id="item-type" class="w-full p-2 border rounded-md"><option value="other">Other</option><option value="weapon">Weapon</option><option value="armor">Armor</option><option value="shield">Shield</option></select></div>
                        <div id="weapon-fields" class="hidden space-y-3 border-t pt-4">
                            <h4 class="font-medium text-gray-700">Weapon Stats:</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label for="weapon-size" class="block text-sm font-medium">Size</label><select id="weapon-size" class="w-full p-2 border rounded-md"><option value="S">Small (S)</option><option value="M" selected>Medium (M)</option><option value="L">Large (L)</option></select></div>
                                <div><label for="weapon-range" class="block text-sm font-medium">Range (ft)</label><input type="number" id="weapon-range" value="0" class="w-full p-2 border rounded-md"></div>
                                <div><label for="weapon-num-dice" class="block text-sm font-medium">Num. of Dice</label><input type="number" id="weapon-num-dice" value="1" class="w-full p-2 border rounded-md"></div>
                                <div><label for="weapon-die-type" class="block text-sm font-medium">Type of Die</label><input type="number" id="weapon-die-type" value="6" class="w-full p-2 border rounded-md"></div>
                                <div class="col-span-2"><label for="weapon-crit" class="block text-sm font-medium">Crit Multiplier</label><input type="number" id="weapon-crit" value="2" class="w-full p-2 border rounded-md"></div>
                            </div>
                        </div>
                        <div id="armor-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Armor Stats:</h4><label for="armor-type" class="block text-sm font-medium">Armor Type</label><select id="armor-type" class="w-full p-2 border rounded-md"><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option></select><label for="armor-ac-bonus" class="block text-sm font-medium">Armor Bonus</label><input type="number" id="armor-ac-bonus" value="0" class="w-full p-2 border rounded-md"></div>
                        <div id="shield-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Shield Stats:</h4><label for="shield-ac-bonus" class="block text-sm font-medium">AC Bonus</label><input type="number" id="shield-ac-bonus" value="0" class="w-full p-2 border rounded-md"></div>
                        <div id="bonuses-container" class="space-y-2 border-t pt-4 hidden"><h4 class="font-medium text-gray-700">Bonuses:</h4><div class="flex items-center space-x-2"><select id="bonus-type" class="p-2 border rounded-md"><option value="">Select Bonus Type</option>${bonusFields.map(field => `<option value="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</option>`).join('')}</select><input type="number" id="bonus-value" placeholder="Value" class="w-24 p-2 border rounded-md"><button type="button" id="add-bonus-btn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Bonus</button></div><ul id="bonuses-list" class="space-y-2"></ul></div>
                        <button type="button" id="add-item-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Item</button>
                    </form>
                </div>
            </div>
        </div>
    `;
};

window.attachInventoryHandlers = () => {
    const addItemBtn = document.getElementById('add-item-btn');
    const allItemsContainer = document.getElementById('all-items');
    const itemTypeSelect = document.getElementById('item-type');
    const bonusesContainer = document.getElementById('bonuses-container');
    const addBonusBtn = document.getElementById('add-bonus-btn');
    const bonusesList = document.getElementById('bonuses-list');
    let itemBonuses = [];

    const itemFields = {
        weapon: document.getElementById('weapon-fields'),
        armor: document.getElementById('armor-fields'),
        shield: document.getElementById('shield-fields'),
    };

    if (itemTypeSelect) {
        itemTypeSelect.onchange = (e) => {
            const selectedType = e.target.value;
            Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
            if (itemFields[selectedType]) {
                itemFields[selectedType].classList.remove('hidden');
            }
            bonusesContainer.classList.toggle('hidden', selectedType === 'other');
        };
    }

    if(addBonusBtn) {
        addBonusBtn.onclick = () => {
            const bonusTypeInput = document.getElementById('bonus-type');
            const bonusValueInput = document.getElementById('bonus-value');
            const field = bonusTypeInput.value;
            const value = parseInt(bonusValueInput.value, 10);
            if (field && !isNaN(value)) {
                itemBonuses.push({ field, value });
                const listItem = document.createElement('li');
                listItem.textContent = `${field.toUpperCase()}: ${value > 0 ? '+' : ''}${value}`;
                listItem.className = 'inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2';
                bonusesList.appendChild(listItem);
                bonusTypeInput.value = '';
                bonusValueInput.value = '';
            }
        };
    }

    if (addItemBtn) {
        addItemBtn.onclick = () => {
            const itemType = itemTypeSelect.value;
            const newItemData = {
                name: document.getElementById('item-name').value,
                description: document.getElementById('item-description').value,
                bonuses: [...itemBonuses],
                itemType: itemType,
            };

            if (itemType === 'weapon') {
                Object.assign(newItemData, {
                    weaponSize: document.getElementById('weapon-size').value,
                    numDice: parseInt(document.getElementById('weapon-num-dice').value, 10),
                    dieType: parseInt(document.getElementById('weapon-die-type').value, 10),
                    range: parseInt(document.getElementById('weapon-range').value, 10),
                    critMultiplier: parseInt(document.getElementById('weapon-crit').value, 10),
                });
            } else if (itemType === 'armor') {
                newItemData.armorType = document.getElementById('armor-type').value;
                newItemData.acBonus = parseInt(document.getElementById('armor-ac-bonus').value, 10);
            } else if (itemType === 'shield') {
                newItemData.acBonus = parseInt(document.getElementById('shield-ac-bonus').value, 10);
            }

            if (newItemData.name) {
                window.stores.character.addItem(newItemData);
                window.showMessage('Item added successfully!', 'green');
                document.getElementById('add-item-form').reset();
                Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
                bonusesContainer.classList.add('hidden');
                bonusesList.innerHTML = '';
                itemBonuses = [];
            } else {
                window.showMessage('Please enter an item name.', 'red');
            }
        };
    }

    if (allItemsContainer) {
        allItemsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.action === 'toggle-favorite') {
                window.stores.character.toggleFavorite(button.dataset.itemId);
            }
        });

        allItemsContainer.addEventListener('change', (e) => {
            const { itemId, action, field, bonusIndex } = e.target.dataset;
            if (action === 'toggle-equip') {
                window.stores.character.toggleEquip(itemId);
            } else if (field) {
                window.stores.character.updateItem(itemId, field, e.target.value);
            } else if (bonusIndex) {
                window.stores.character.updateItemBonus(itemId, bonusIndex, e.target.value);
            }
        });
    }
};