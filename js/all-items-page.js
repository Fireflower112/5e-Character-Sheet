// js/all-items-page.js

window.AllItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const containers = Object.values(character.inventory.containers || {});
    const equipmentSlots = [ { key: 'Armor', label: 'Armor' }, { key: 'Belt', label: 'Belt' }, { key: 'Body', label: 'Body' }, { key: 'Chest', label: 'Chest' }, { key: 'Eyes', label: 'Eyes' }, { key: 'Feet', label: 'Feet' }, { key: 'Hands', label: 'Hands' }, { key: 'Head', label: 'Head' }, { key: 'Headband', label: 'Headband' }, { key: 'Neck', label: 'Neck' }, { key: 'Ring1', label: 'Ring 1' }, { key: 'Ring2', label: 'Ring 2' }, { key: 'Shield', label: 'Shield' }, { key: 'Shoulders', label: 'Shoulders' }, { key: 'Wrists', label: 'Wrists' }];
    
    const renderItemCard = (item) => {
        // This function is unchanged
        let equipControl = '';
        const equippableTypes = ['weapon', 'armor', 'shield', 'wearable'];
        if (equippableTypes.includes(item.itemType)) {
            if (item.itemType === 'weapon') {
                equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-weapon-${item.id}" data-item-id="${item.id}" data-action="equip-weapon" ${item.equippedSlot ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-weapon-${item.id}" class="text-gray-700">Wielded</label></div>`;
            } else if (['armor', 'shield'].includes(item.itemType)) {
                equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-${item.itemType}-${item.id}" data-item-id="${item.id}" data-action="equip-armor-shield" data-item-type="${item.itemType}" ${item.equippedSlot ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-${item.itemType}-${item.id}" class="text-gray-700">Equipped</label></div>`;
            } else {
                equipControl = `<select data-item-id="${item.id}" data-action="equip-to-slot" class="p-1 border rounded-md text-sm"><option value="none">Not Equipped</option>${equipmentSlots.map(slot => `<option value="${slot.key}" ${item.equippedSlot === slot.key ? 'selected' : ''}>${slot.label}</option>`).join('')}</select>`;
            }
        }

        const favoriteButton = (item.itemType === 'weapon') ? `<button data-action="toggle-favorite" data-item-id="${item.id}" class="text-gray-400 hover:text-yellow-500" title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${item.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${item.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></button>` : '';
        
        let containerControl = '';
        if (!item.equippedSlot || item.equippedSlot === 'none') {
            containerControl = `<div class="mt-2"><label class="text-xs font-medium text-gray-600">Store in:</label><select data-item-id="${item.id}" data-action="assign-to-container" class="w-full p-1 border rounded-md text-sm bg-gray-50"><option value="none" ${!item.containerId ? 'selected' : ''}>Not Stored</option>${Object.values(containers).map(c => `<option value="${c.id}" ${item.containerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>`;
        }

        return `
            <div id="item-card-${item.id}" class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-grow"><h4 class="font-semibold text-lg">${item.name}</h4><p class="text-xs text-gray-500">Weight: ${item.weight || 0} lbs</p></div>
                    <div class="flex items-center space-x-3">${favoriteButton}${equipControl}<button data-action="delete-item" data-item-id="${item.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button></div>
                </div>
                ${item.description ? `<p class="text-gray-600 text-sm mt-2">${item.description}</p>` : ''}
                ${containerControl}
            </div>`;
    };
    
    const allItemsHtml = allItems.length > 0
        ? allItems.map(renderItemCard).join('')
        : '<p class="text-gray-500 italic">No items in inventory. Add one below!</p>';

    // --- ADDED a new div to wrap the list and the form ---
    return `
        <div class="space-y-6">
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">All Items</h3>
                <div class="space-y-3">${allItemsHtml}</div>
            </div>

            <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                <h3 class="text-lg font-semibold mb-3">Add New Item</h3>
                <form id="add-item-form" class="space-y-4">
                     <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2"><label for="item-name" class="block text-sm font-medium">Item Name</label><input type="text" id="item-name" required class="w-full p-2 border rounded-md"></div>
                        <div><label for="item-weight" class="block text-sm font-medium">Weight (lbs)</label><input type="number" id="item-weight" value="0" step="0.1" class="w-full p-2 border rounded-md"></div>
                    </div>
                    <textarea id="item-description" placeholder="Item Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                    <div>
                        <label for="item-type" class="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                        <select id="item-type" class="w-full p-2 border rounded-md">
                            <option value="other">Other</option>
                            <option value="wearable">Wearable Item</option>
                            <option value="weapon">Weapon</option>
                            <option value="armor">Armor</option>
                            <option value="shield">Shield</option>
                        </select>
                    </div>
                    <div id="weapon-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Weapon Stats:</h4><div class="grid grid-cols-2 gap-4"><div><label for="weapon-num-dice" class="block text-sm font-medium">Num. of Dice</label><input type="number" id="weapon-num-dice" value="1" class="w-full p-2 border rounded-md"></div><div><label for="weapon-die-type" class="block text-sm font-medium">Type of Die</label><input type="number" id="weapon-die-type" value="6" class="w-full p-2 border rounded-md"></div></div></div>
                    <div id="armor-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Armor Stats:</h4><label for="armor-type" class="block text-sm font-medium">Armor Type</label><select id="armor-type" class="w-full p-2 border rounded-md"><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option></select><label for="armor-ac-base" class="block text-sm font-medium">Base AC</label><input type="number" id="armor-ac-base" value="10" class="w-full p-2 border rounded-md"></div>
                    <div id="shield-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Shield Stats:</h4><label for="shield-ac-bonus" class="block text-sm font-medium">AC Bonus</label><input type="number" id="shield-ac-bonus" value="2" class="w-full p-2 border rounded-md"></div>
                    <button type="button" id="add-item-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Item</button>
                </form>
            </div>
        </div>`;
};

// --- ADDED the handler function back in ---
window.attachAllItemsPageHandlers = () => {
    const addItemForm = document.getElementById('add-item-form');
    if (!addItemForm) return;

    const addItemBtn = document.getElementById('add-item-btn');
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

    addItemBtn.onclick = () => {
        const newItemData = {
            name: document.getElementById('item-name').value,
            weight: parseFloat(document.getElementById('item-weight').value) || 0,
            description: document.getElementById('item-description').value,
            itemType: document.getElementById('item-type').value,
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
            window.stores.characterActions.addItem(newItemData);
            window.showMessage('Item added successfully!', 'green');
            addItemForm.reset();
            Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
        } else {
            window.showMessage('Please enter an item name.', 'red');
        }
    };
};