// js/spells-editor-page.js

DndSheet.pages.SpellsEditorPage = (character) => {
    const castingStats = [ { key: 'int', label: 'Intelligence' }, { key: 'wis', label: 'Wisdom' }, { key: 'cha', label: 'Charisma' }];
    const spellSchools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
    const castingTimes = ['1 Action', '1 Bonus Action', '1 Reaction', '1 Minute', '10 Minutes', '1 Hour'];

    // This function renders the list of spells the character currently knows.
    const renderSpellsList = (spells) => {
        const spellArray = Object.values(spells).sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
        if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned yet.</p>';
        
        return spellArray.map(spell => `
            <div class="bg-white p-3 rounded-md shadow-sm flex justify-between items-center">
                <div>
                    <span class="font-semibold">${spell.name}</span>
                    <span class="text-sm text-gray-500">(Lvl ${spell.level})</span>
                </div>
                <button data-action="delete-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
            </div>
        `).join('');
    };

    return `
        <div>
            <div class="space-y-6">
                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add New Spell</h3>
                    <form id="add-spell-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t pt-4">
                            </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                            <div><label for="spell-damage-num-dice" class="block text-sm font-medium">Damage Dice #</label><input type="number" id="spell-damage-num-dice" class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-damage-die-type" class="block text-sm font-medium">Die Type</label><input type="number" id="spell-damage-die-type" class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-damage-type" class="block text-sm font-medium">Damage Type</label><input type="text" id="spell-damage-type" class="w-full p-2 border rounded-md"></div>
                        </div>

                        <button type="button" id="add-spell-btn" data-action="add-spell" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Spell</button>
                    </form>
                </div>

                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    </div>
            </div>
        </div>
    `;
};


DndSheet.pages.attachSpellsEditorHandlers = () => {
    const editorContainer = document.querySelector('#content-area');
    if (!editorContainer) return;

    editorContainer.addEventListener('input', (e) => {
        if (e.target.dataset.action === 'update-spell-slot-total') {
            const level = e.target.dataset.level;
            DndSheet.stores.characterActions.updateSpellSlot(level, 'total', e.target.value);
        }
    });
    
    editorContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button || !button.dataset.action) return;

        const { action, spellId } = button.dataset;
        if (action === 'toggle-favorite-spell') {
            DndSheet.stores.characterActions.toggleFavoriteSpell(spellId);
        } else if (action === 'delete-spell') {
            DndSheet.stores.characterActions.deleteSpell(spellId);
        }
    });

    const addSpellBtn = document.getElementById('add-spell-btn');
    if (addSpellBtn) {
        addSpellBtn.onclick = () => {
            const newSpell = {
                name: document.getElementById('spell-name').value,
                description: document.getElementById('spell-description').value,
                level: parseInt(document.getElementById('spell-level').value, 10),
                school: document.getElementById('spell-school').value,
                castingTime: document.getElementById('spell-casting-time').value,
                // MODIFIED: Read the new duration values from the form
                durationValue: parseInt(document.getElementById('spell-duration-value').value, 10),
                durationUnit: document.getElementById('spell-duration-unit').value,
            };

            if (newSpell.name && !isNaN(newSpell.level)) {
                DndSheet.stores.characterActions.addSpell(newSpell);
                DndSheet.helpers.showMessage('Spell added successfully!', 'green');
                document.getElementById('add-spell-form').reset();
            } else {
                DndSheet.helpers.showMessage('Please enter a spell name and level.', 'red');
            }
        };
    }
};