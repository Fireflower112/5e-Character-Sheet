// js/handlers/inventory-handlers.js

DndSheet.handlers.inventoryClickHandlers = {
    // MODIFIED: Added the handler for the custom container button
    'add-container': () => {
        const containerData = {
            name: document.getElementById('container-name').value,
            description: document.getElementById('container-description').value,
            capacity: parseFloat(document.getElementById('container-capacity').value) || 0,
            weight: parseFloat(document.getElementById('container-weight').value) || 0,
        };
        if (containerData.name) {
            DndSheet.stores.characterActions.addContainer(containerData);
            document.getElementById('add-container-form').reset();
            DndSheet.helpers.showMessage('Container added!', 'green');
        } else {
            DndSheet.helpers.showMessage('Container name is required.', 'red');
        }
    },
    'add-item-bonus': (target) => {
        const form = target.closest('#add-item-form');
        const bonusValueInput = form.querySelector('#add-item-bonus-value');
        const value = parseInt(bonusValueInput.value, 10);
        const fieldSelect = form.querySelector('#add-item-bonus-field');
        const field = fieldSelect.value;
        const fieldLabel = fieldSelect.options[fieldSelect.selectedIndex].text;
        const type = form.querySelector('#add-item-bonus-type').value;
        if (field && !isNaN(value)) {
            const bonusesList = form.querySelector('#bonuses-list');
            const listItem = document.createElement('li');
            listItem.dataset.field = field;
            listItem.dataset.value = value;
            listItem.dataset.type = type;
            const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
            listItem.innerHTML = `${fieldLabel}: ${symbol}${value} <button type="button" class="remove-bonus-btn text-red-500 ml-1 font-bold">x</button>`;
            listItem.className = 'inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold pl-2.5 pr-1 py-0.5 rounded-full';
            listItem.querySelector('.remove-bonus-btn').onclick = () => listItem.remove();
            bonusesList.appendChild(listItem);
            bonusValueInput.value = '';
        }
    },
    'add-item': (target) => {
        const form = target.closest('#add-item-form');
        const bonuses = [];
        form.querySelectorAll('#bonuses-list li').forEach(li => {
            bonuses.push({ field: li.dataset.field, value: parseInt(li.dataset.value, 10), type: li.dataset.type });
        });
        const newItemData = {
            name: form.querySelector('#item-name').value,
            weight: parseFloat(form.querySelector('#item-weight').value) || 0,
            description: form.querySelector('#item-description').value,
            itemType: form.querySelector('#item-type').value,
            requiresAttunement: form.querySelector('#item-requires-attunement').checked,
            bonuses: bonuses,
        };
        if (newItemData.itemType === 'weapon') {
            Object.assign(newItemData, { numDice: parseInt(form.querySelector('#weapon-num-dice').value, 10), dieType: parseInt(form.querySelector('#weapon-die-type').value, 10) });
        } else if (newItemData.itemType === 'armor') {
            newItemData.armorType = form.querySelector('#armor-type').value;
            newItemData.acBase = parseInt(form.querySelector('#armor-ac-base').value, 10);
        } else if (newItemData.itemType === 'shield') {
            newItemData.acBonus = parseInt(form.querySelector('#shield-ac-bonus').value, 10);
        }
        if (newItemData.name) {
            DndSheet.stores.characterActions.addItem(newItemData);
            DndSheet.helpers.showMessage('Item added!', 'green');
            form.reset();
            form.querySelector('#bonuses-list').innerHTML = '';
            form.querySelector('#weapon-fields').classList.add('hidden');
            form.querySelector('#armor-fields').classList.add('hidden');
            form.querySelector('#shield-fields').classList.add('hidden');
        } else {
            DndSheet.helpers.showMessage('Item name is required.', 'red');
        }
    },
    'delete-item': (target) => {
        const { itemId } = target.dataset;
        if (itemId && confirm('Are you sure?')) DndSheet.stores.characterActions.deleteItem(itemId);
    },
    'toggle-favorite': (target) => DndSheet.stores.characterActions.toggleFavoriteItem(target.dataset.itemId),
    'edit-item': (target) => {
        const { itemId } = target.dataset;
        const character = DndSheet.stores.character.get();
        const item = character.inventory.items[itemId];
        if (item) {
            // Note: editBonuses needs to be accessible. We'll handle this in the main listener file.
            DndSheet.app.editBonuses = [...(item.bonuses || [])];
            document.getElementById(`item-display-${itemId}`).classList.add('hidden');
            const editArea = document.getElementById(`item-edit-area-${itemId}`);
            editArea.innerHTML = DndSheet.pages.renderItemEditForm(item);
            editArea.classList.remove('hidden');
        }
    },
    'cancel-item-edit': (target) => {
        const { itemId } = target.dataset;
        document.getElementById(`item-display-${itemId}`).classList.remove('hidden');
        document.getElementById(`item-edit-area-${itemId}`).classList.add('hidden');
    },
    'save-item-edit': (target) => {
        const { itemId } = target.dataset;
        const editArea = document.getElementById(`item-edit-area-${itemId}`);
        const updates = { name: editArea.querySelector('.edit-item-name').value, description: editArea.querySelector('.edit-item-description').value, bonuses: DndSheet.app.editBonuses };
        DndSheet.stores.characterActions.updateItem(itemId, updates);
    },
};

DndSheet.handlers.inventoryChangeHandlers = {
    'toggle-attunement': (target) => DndSheet.stores.characterActions.toggleAttunement(target.dataset.itemId),
    'assign-to-container': (target) => DndSheet.stores.characterActions.assignItemToContainer(target.dataset.itemId, target.value),
    'equip-weapon': (target) => {
        const slot = target.checked ? 'Wielded' : null;
        DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
    },
    'equip-armor': (target) => {
        const slot = target.checked ? 'Armor' : null;
        DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
    },
    'equip-shield': (target) => {
        const slot = target.checked ? 'Shield' : null;
        DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
    },
};