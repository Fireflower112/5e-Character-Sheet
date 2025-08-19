// js/all-items-page.js

window.InventoryPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const containers = Object.values(character.inventory.containers || {});
    
    // --- Data for forms ---
    const equipmentSlots = [ { key: 'Armor', label: 'Armor' }, { key: 'Belt', label: 'Belt' }, { key: 'Body', label: 'Body' }, { key: 'Chest', label: 'Chest' }, { key: 'Eyes', label: 'Eyes' }, { key: 'Feet', label: 'Feet' }, { key: 'Hands', label: 'Hands' }, { key: 'Head', label: 'Head' }, { key: 'Headband', label: 'Headband' }, { key: 'Neck', label: 'Neck' }, { key: 'Ring1', label: 'Ring 1' }, { key: 'Ring2', label: 'Ring 2' }, { key: 'Shield', label: 'Shield' }, { key: 'Shoulders', label: 'Shoulders' }, { key: 'Wrists', label: 'Wrists' }];
    const skillList = [ "Acrobatics", "Appraise", "Bluff", "Climb", "Diplomacy", "Disable Device", "Disguise", "Escape Artist", "Fly", "Handle Animal", "Heal", "Intimidate", "Knowledge (Arcana)", "Knowledge (Dungeoneering)", "Knowledge (Engineering)", "Knowledge (Geography)", "Knowledge (History)", "Knowledge (Local)", "Knowledge (Nature)", "Knowledge (Nobility)", "Knowledge (Planes)", "Knowledge (Religion)", "Linguistics", "Perception", "Perform", "Profession", "Ride", "Sense Motive", "Sleight of Hand", "Spellcraft", "Stealth", "Survival", "Swim", "Use Magic Device" ].map(name => ({ key: name.toLowerCase().replace(' (', '').replace(')', '').replace(/ /g, '-').replace(/-(\w)/g, (match, letter) => letter.toUpperCase()).replace(/Knowledge(\w)/, (_, c) => `knowledge${c.toUpperCase()}`), label: name }));
    const skillLabelMap = new Map(skillList.map(skill => [skill.key, skill.label]));
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderEditForm = (item) => {
        const bonusesHtml = (item.bonuses || []).map((bonus, index) => {
            const label = skillLabelMap.get(bonus.field) || bonus.field.toUpperCase();
            const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : '');
            return `<li class="flex items-center justify-between bg-gray-200 px-2 py-0.5 rounded-full text-xs" data-field="${bonus.field}" data-value="${bonus.value}" data-type="${bonus.type}"><span>${label}: ${symbol}${bonus.value}</span><button type="button" data-action="remove-bonus-from-edit" class="ml-2 text-red-500 hover:text-red-700 font-bold">x</button></li>`;
        }).join('');

        let itemSpecificFields = '';
        switch(item.itemType) {
            case 'weapon':
                itemSpecificFields = `
                    <div class="border-t pt-3 space-y-2">
                        <h4 class="font-medium text-gray-700">Edit Weapon Stats:</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><label class="font-medium">Damage</label><div class="flex items-center"><input type="number" class="edit-item-numDice w-full p-1 border rounded" value="${item.numDice || 1}"> <span class="mx-1 font-bold">d</span> <input type="number" class="edit-item-dieType w-full p-1 border rounded" value="${item.dieType || 6}"></div></div>
                            <div><label class="font-medium">Crit Multiplier</label><input type="number" class="edit-item-critMultiplier w-full p-1 border rounded" value="${item.critMultiplier || 2}"></div>
                            <div><label class="font-medium">Range (ft)</label><input type="number" class="edit-item-range w-full p-1 border rounded" value="${item.range || 0}"></div>
                        </div>
                    </div>`;
                break;
            case 'armor':
                itemSpecificFields = `
                    <div class="border-t pt-3 space-y-2">
                        <h4 class="font-medium text-gray-700">Edit Armor Stats:</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><label class="font-medium">AC Bonus</label><input type="number" class="edit-item-acBonus w-full p-1 border rounded" value="${item.acBonus || 0}"></div>
                            <div><label class="font-medium">Type</label><select class="edit-item-armorType w-full p-1 border rounded"><option value="light" ${item.armorType === 'light' ? 'selected' : ''}>Light</option><option value="medium" ${item.armorType === 'medium' ? 'selected' : ''}>Medium</option><option value="heavy" ${item.armorType === 'heavy' ? 'selected' : ''}>Heavy</option></select></div>
                        </div>
                    </div>`;
                break;
            case 'shield':
                itemSpecificFields = `
                    <div class="border-t pt-3 space-y-2">
                        <h4 class="font-medium text-gray-700">Edit Shield Stats:</h4>
                        <div><label class="font-medium text-sm">AC Bonus</label><input type="number" class="edit-item-acBonus w-full p-1 border rounded" value="${item.acBonus || 0}"></div>
                    </div>`;
                break;
        }

        return `
            <div class="mt-4 pt-4 border-t-2 border-dashed space-y-3">
                <input type="hidden" class="edit-item-id" value="${item.id}">
                <div><label class="block text-sm font-medium">Name</label><input type="text" class="edit-item-name w-full p-1 border rounded" value="${item.name}"></div>
                <div><label class="block text-sm font-medium">Description</label><textarea class="edit-item-description w-full p-1 border rounded">${item.description || ''}</textarea></div>
                
                ${itemSpecificFields}

                <div class="space-y-3 border-t pt-3">
                    <h4 class="font-medium text-gray-700">Edit Bonuses:</h4>
                    <ul class="edit-bonuses-list flex flex-wrap gap-2">${bonusesHtml}</ul>
                    <div class="flex items-end gap-2 text-sm">
                        <select class="edit-bonus-field p-1 border rounded flex-grow">
                            ${abilityScores.map(score => `<option value="${score}">${score.toUpperCase()}</option>`).join('')}
                            ${skillList.map(skill => `<option value="${skill.key}">${skill.label}</option>`).join('')}
                        </select>
                        <select class="edit-bonus-type p-1 border rounded"><option value="enhancement">Augment (+)</option><option value="override">Set (=)</option></select>
                        <div><label class="block font-medium">Value</label><input type="number" class="edit-bonus-value w-20 p-1 border rounded" placeholder="+1"></div>
                        <button type="button" data-action="add-bonus-to-edit" data-item-id="${item.id}" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Add</button>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 mt-2">
                    <button type="button" data-action="cancel-edit" data-item-id="${item.id}" class="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
                    <button type="button" data-action="save-item-changes" data-item-id="${item.id}" class="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Save</button>
                </div>
            </div>`;
    };

    const renderItemCard = (item) => {
        let equipControl = '';
        const equippableTypes = ['weapon', 'armor', 'shield', 'wearable'];
        if (equippableTypes.includes(item.itemType)) {
            if (item.itemType === 'weapon') equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-weapon-${item.id}" data-item-id="${item.id}" data-action="equip-weapon" ${item.equippedSlot ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-weapon-${item.id}" class="text-gray-700">Wielded</label></div>`;
            else if (['armor', 'shield'].includes(item.itemType)) equipControl = `<div class="flex items-center space-x-2"><input type="checkbox" id="equip-${item.itemType}-${item.id}" data-item-id="${item.id}" data-action="equip-armor-shield" data-item-type="${item.itemType}" ${item.equippedSlot ? 'checked' : ''} class="rounded text-indigo-600 h-5 w-5"/><label for="equip-${item.itemType}-${item.id}" class="text-gray-700">Equipped</label></div>`;
            else equipControl = `<select data-item-id="${item.id}" data-action="equip-to-slot" class="p-1 border rounded-md text-sm"><option value="none">Not Equipped</option>${equipmentSlots.map(slot => `<option value="${slot.key}" ${item.equippedSlot === slot.key ? 'selected' : ''}>${slot.label}</option>`).join('')}</select>`;
        }
        const favoriteButton = item.itemType === 'weapon' ? `<button data-action="toggle-favorite" data-item-id="${item.id}" class="text-gray-400 hover:text-yellow-500" title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${item.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${item.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></button>` : '';
        const bonusesHtml = (item.bonuses && item.bonuses.length > 0) ? `<div class="mt-2 pt-2 border-t flex flex-wrap gap-2">${item.bonuses.map(bonus => { const label = skillLabelMap.get(bonus.field) || bonus.field.toUpperCase(); const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : ''); return `<span class="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">${label}: ${symbol}${bonus.value}</span>`; }).join('')}</div>` : '';
        
        // --- FIX: Re-added the container control logic ---
        let containerControl = '';
        if (!item.equippedSlot || item.equippedSlot === 'none') {
            containerControl = `
                <div class="mt-2">
                    <label class="text-xs font-medium text-gray-600">Store in:</label>
                    <select data-item-id="${item.id}" data-action="assign-to-container" class="w-full p-1 border rounded-md text-sm bg-gray-50">
                        <option value="none" ${!item.containerId ? 'selected' : ''}>Not Stored</option>
                        ${Object.values(containers).map(c => `<option value="${c.id}" ${item.containerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>`;
        }

        return `
            <div id="item-card-${item.id}" class="bg-white p-4 rounded-lg shadow-sm">
                <div id="item-display-${item.id}">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-grow">
                            <h4 class="font-semibold text-lg">${item.name}</h4>
                            <p class="text-xs text-gray-500">Weight: ${item.weight || 0} lbs</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            ${favoriteButton}
                            ${equipControl}
                            <button data-action="toggle-edit-item" data-item-id="${item.id}" class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Edit</button>
                            <button data-action="delete-item" data-item-id="${item.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                    ${item.description ? `<p class="text-gray-600 text-sm mt-2">${item.description}</p>` : ''}
                    ${bonusesHtml}
                    ${containerControl}
                </div>
                <div id="item-edit-area-${item.id}" class="hidden">
                    ${renderEditForm(item)}
                </div>
            </div>`;
    };
    
    const renderCategorySection = (title, items) => {
        if (items.length === 0) return '';
        return `
            <details class="bg-gray-50 p-4 rounded-xl shadow-sm" open>
                <summary class="text-xl font-semibold cursor-pointer">${title}</summary>
                <div class="mt-3 space-y-3">
                    ${items.map(renderItemCard).join('')}
                </div>
            </details>`;
    };

    const weapons = allItems.filter(i => i.itemType === 'weapon');
    const armor = allItems.filter(i => i.itemType === 'armor');
    const shields = allItems.filter(i => i.itemType === 'shield');
    const wearables = allItems.filter(i => i.itemType === 'wearable');
    const others = allItems.filter(i => i.itemType === 'other');

    return `
        <div>
            <div class="space-y-4">
                ${renderCategorySection('Weapons', weapons)}
                ${renderCategorySection('Armor', armor)}
                ${renderCategorySection('Shields', shields)}
                ${renderCategorySection('Wearable Items', wearables)}
                ${renderCategorySection('Other Items', others)}

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add New Item</h3>
                    <form id="add-item-form" class="space-y-4">
                         <div class="grid grid-cols-3 gap-4">
                            <div class="col-span-2"><label for="item-name" class="block text-sm font-medium">Item Name</label><input type="text" id="item-name" required class="w-full p-2 border rounded-md"></div>
                            <div><label for="item-weight" class="block text-sm font-medium">Weight (lbs)</label><input type="number" id="item-weight" value="0" step="0.01" class="w-full p-2 border rounded-md"></div>
                        </div>
                        <textarea id="item-description" placeholder="Item Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                        <div>
                            <label for="item-type" class="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                            <select id="item-type" class="w-full p-2 border rounded-md">
                                <option value="other">Other (Passive)</option>
                                <option value="wearable">Wearable Item</option>
                                <option value="weapon">Weapon</option>
                                <option value="armor">Armor</option>
                                <option value="shield">Shield</option>
                            </select>
                        </div>
                        
                        <div id="weapon-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Weapon Stats:</h4><div class="grid grid-cols-2 gap-4"><div><label for="weapon-range" class="block text-sm font-medium">Range (ft)</label><input type="number" id="weapon-range" value="0" class="w-full p-2 border rounded-md"></div><div><label for="weapon-num-dice" class="block text-sm font-medium">Num. of Dice</label><input type="number" id="weapon-num-dice" value="1" class="w-full p-2 border rounded-md"></div><div><label for="weapon-die-type" class="block text-sm font-medium">Type of Die</label><input type="number" id="weapon-die-type" value="6" class="w-full p-2 border rounded-md"></div><div class="col-span-2"><label for="weapon-crit" class="block text-sm font-medium">Crit Multiplier</label><input type="number" id="weapon-crit" value="2" class="w-full p-2 border rounded-md"></div></div></div>
                        <div id="armor-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Armor Stats:</h4><label for="armor-type" class="block text-sm font-medium">Armor Type</label><select id="armor-type" class="w-full p-2 border rounded-md"><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy</option></select><label for="armor-ac-bonus" class="block text-sm font-medium">Armor Bonus</label><input type="number" id="armor-ac-bonus" value="0" class="w-full p-2 border rounded-md"></div>
                        <div id="shield-fields" class="hidden space-y-3 border-t pt-4"><h4 class="font-medium text-gray-700">Shield Stats:</h4><label for="shield-ac-bonus" class="block text-sm font-medium">AC Bonus</label><input type="number" id="shield-ac-bonus" value="0" class="w-full p-2 border rounded-md"></div>
                        
                        <div id="bonuses-container" class="space-y-3 border-t pt-4">
                            <h4 class="font-medium text-gray-700">Bonuses:</h4>
                            <div id="bonus-category-selector" class="flex flex-wrap gap-2"><button type="button" data-bonus-category="ability" class="bonus-cat-btn px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">Ability Score</button><button type="button" data-bonus-category="skill" class="bonus-cat-btn px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">Skill</button><button type="button" data-bonus-category="concentration" class="bonus-cat-btn px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">Concentration</button></div>
                            <div id="bonus-details-area" class="hidden items-center gap-4">
                                <div id="ability-bonus-selector" class="hidden flex-grow"><label for="ability-bonus-type" class="block text-sm font-medium">Ability</label><select id="ability-bonus-type" class="w-full p-2 border rounded-md">${abilityScores.map(score => `<option value="${score}">${score.toUpperCase()}</option>`).join('')}</select></div>
                                <div id="skill-bonus-selector" class="hidden flex-grow"><label for="skill-bonus-type" class="block text-sm font-medium">Skill</label><select id="skill-bonus-type" class="w-full p-2 border rounded-md">${skillList.map(skill => `<option value="${skill.key}">${skill.label}</option>`).join('')}</select></div>
                                <div class="flex items-end space-x-2"><div class="flex items-center space-x-2 pr-2"><input type="radio" id="bonus-type-enhance" name="bonus-type" value="enhancement" checked><label for="bonus-type-enhance" class="text-sm">Augment (+)</label><input type="radio" id="bonus-type-override" name="bonus-type" value="override"><label for="bonus-type-override" class="text-sm">Set (=)</label></div><div class="flex-grow"><label for="bonus-value" class="block text-sm font-medium">Value</label><input type="number" id="bonus-value" placeholder="+1" class="w-24 p-2 border rounded-md"></div><button type="button" id="add-bonus-btn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-10">Add</button></div>
                            </div>
                            <ul id="bonuses-list" class="flex flex-wrap gap-2 pt-2"></ul>
                        </div>
                        
                        <button type="button" id="add-item-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Item</button>
                    </form>
                </div>
            </div>
        </div>`;
};

window.attachInventoryHandlers = () => {
    const addItemForm = document.getElementById('add-item-form');
    if (!addItemForm) return;

    let itemBonuses = [];
    const addItemBtn = document.getElementById('add-item-btn');
    const itemTypeSelect = document.getElementById('item-type');
    const itemFields = {
        weapon: document.getElementById('weapon-fields'),
        armor: document.getElementById('armor-fields'),
        shield: document.getElementById('shield-fields'),
    };
    const bonusCategorySelector = document.getElementById('bonus-category-selector');
    const bonusDetailsArea = document.getElementById('bonus-details-area');
    const abilityBonusSelector = document.getElementById('ability-bonus-selector');
    const skillBonusSelector = document.getElementById('skill-bonus-selector');
    const addBonusBtn = document.getElementById('add-bonus-btn');
    const bonusesList = document.getElementById('bonuses-list');
    let activeBonusCategory = null;

    itemTypeSelect.onchange = (e) => {
        const selectedType = e.target.value;
        Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
        if (itemFields[selectedType]) {
            itemFields[selectedType].classList.remove('hidden');
        }
    };
    itemTypeSelect.dispatchEvent(new Event('change'));

    bonusCategorySelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('bonus-cat-btn')) {
            const category = e.target.dataset.bonusCategory;
            activeBonusCategory = category;
            bonusCategorySelector.querySelectorAll('.bonus-cat-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            e.target.classList.add('bg-indigo-600', 'text-white');
            e.target.classList.remove('bg-gray-200', 'text-gray-700');
            bonusDetailsArea.classList.remove('hidden');
            bonusDetailsArea.classList.add('flex');
            abilityBonusSelector.classList.add('hidden');
            skillBonusSelector.classList.add('hidden');
            if (category === 'ability') {
                abilityBonusSelector.classList.remove('hidden');
            } else if (category === 'skill') {
                skillBonusSelector.classList.remove('hidden');
            }
        }
    });

    addBonusBtn.onclick = () => {
        const bonusValueInput = document.getElementById('bonus-value');
        const value = parseInt(bonusValueInput.value, 10);
        const type = document.querySelector('input[name="bonus-type"]:checked').value;
        let field = null;
        let fieldLabel = '';

        if (activeBonusCategory === 'ability') {
            const selector = document.getElementById('ability-bonus-type');
            field = selector.value;
            fieldLabel = selector.options[selector.selectedIndex].text;
        } else if (activeBonusCategory === 'skill') {
            const selector = document.getElementById('skill-bonus-type');
            field = selector.value;
            fieldLabel = selector.options[selector.selectedIndex].text;
        } else if (activeBonusCategory === 'concentration') {
            field = 'concentration';
            fieldLabel = 'Concentration';
        }

        if (field && !isNaN(value)) {
            itemBonuses.push({ field, value, type });
            const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
            const listItem = document.createElement('li');
            listItem.textContent = `${fieldLabel}: ${symbol}${value}`;
            listItem.className = 'inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded-full';
            bonusesList.appendChild(listItem);
            bonusValueInput.value = '';
        }
    };

    addItemBtn.onclick = () => {
        const newItemData = {
            name: document.getElementById('item-name').value,
            weight: parseFloat(document.getElementById('item-weight').value) || 0,
            description: document.getElementById('item-description').value,
            bonuses: [...itemBonuses],
            itemType: document.getElementById('item-type').value,
        };

        if (newItemData.itemType === 'weapon') {
            Object.assign(newItemData, {
                numDice: parseInt(document.getElementById('weapon-num-dice').value, 10),
                dieType: parseInt(document.getElementById('weapon-die-type').value, 10),
                range: parseInt(document.getElementById('weapon-range').value, 10),
                critMultiplier: parseInt(document.getElementById('weapon-crit').value, 10),
            });
        } else if (newItemData.itemType === 'armor') {
            newItemData.armorType = document.getElementById('armor-type').value;
            newItemData.acBonus = parseInt(document.getElementById('armor-ac-bonus').value, 10);
        } else if (newItemData.itemType === 'shield') {
            newItemData.acBonus = parseInt(document.getElementById('shield-ac-bonus').value, 10);
        }

        if (newItemData.name) {
            window.stores.character.addItem(newItemData);
            window.showMessage('Item added successfully!', 'green');
            addItemForm.reset();
            Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
            bonusesList.innerHTML = '';
            itemBonuses = [];
            bonusDetailsArea.classList.add('hidden');
            bonusDetailsArea.classList.remove('flex');
            bonusCategorySelector.querySelectorAll('.bonus-cat-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            activeBonusCategory = null;
        } else {
            window.showMessage('Please enter an item name.', 'red');
        }
    };
};
