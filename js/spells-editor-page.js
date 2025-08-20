// js/spells-editor-page.js

window.SpellsEditorPage = (character) => {
    const castingStats = [
        { key: 'int', label: 'Intelligence' },
        { key: 'wis', label: 'Wisdom' },
        { key: 'cha', label: 'Charisma' }
    ];
    const spellSchools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Universal'];
    const castingTimes = ['1 standard action', '1 swift action', '1 immediate action', '1 minute', '10 minutes', '1 hour', '24 hours'];
    const durations = ['Instantaneous', '1 round/level', '1 min/level', '10 min/level', '1 hour/level', '24 hours', 'Permanent'];
    const spellShapes = ['None', 'Cone', 'Sphere', 'Cylinder', 'Line', 'Burst'];

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Spellcasting Settings</h2>
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
                    <div>
                        <div class="flex items-center space-x-4">
                            <div class="flex-1 flex items-center space-x-2">
                                <label for="castingStat" class="text-lg font-medium text-gray-700">Casting Stat:</label>
                                <select id="castingStat" data-field="spellcasting" data-subfield="castingStat" class="flex-1 p-2 text-lg bg-white border rounded-md">
                                    ${castingStats.map(stat => `<option value="${stat.key}" ${character.spellcasting.castingStat === stat.key ? 'selected' : ''}>${stat.label}</option>`).join('')}
                                </select>
                            </div>
                            <div class="flex-1 flex items-center space-x-2">
                                <label for="spellResistance" class="text-lg font-medium text-gray-700">Spell Resistance:</label>
                                <input type="number" id="spellResistance" value="${character.spellcasting?.spellResistance || 0}" data-field="spellcasting" data-subfield="spellResistance" class="w-24 p-2 text-lg bg-white border rounded-md"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Total Spells Per Day:</h4>
                        <p class="text-sm text-gray-500 mb-4">Set the total number of spell slots for each level. This will update the list in the main Spellbook tab.</p>
                        <div class="grid grid-cols-5 gap-4 text-center">
                            ${(character.spellcasting.spellSlots || []).map((slot, level) => `
                                <div class="flex flex-col items-center">
                                    <label class="font-medium">Lvl ${level}</label>
                                    <input 
                                        type="number" 
                                        value="${slot.total}" 
                                        data-action="update-spell-slot"
                                        data-level="${level}"
                                        class="w-20 p-1 text-center border rounded-md"
                                    />
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add New Spell</h3>
                    <form id="add-spell-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label for="spell-name" class="block text-sm font-medium">Spell Name</label><input type="text" id="spell-name" required class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-level" class="block text-sm font-medium">Level</label><input type="number" id="spell-level" required class="w-full p-2 border rounded-md"></div>
                        </div>
                        <textarea id="spell-description" placeholder="Spell Description" class="w-full p-2 border rounded-md"></textarea>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div><label for="spell-school" class="block text-sm font-medium">School</label><select id="spell-school" class="w-full p-2 border rounded-md">${spellSchools.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                            <div><label for="spell-casting-time" class="block text-sm font-medium">Casting Time</label><select id="spell-casting-time" class="w-full p-2 border rounded-md">${castingTimes.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
                            <div><label for="spell-duration" class="block text-sm font-medium">Duration</label><select id="spell-duration" class="w-full p-2 border rounded-md">${durations.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
                            <div><label for="spell-type" class="block text-sm font-medium">Type</label><select id="spell-type" class="w-full p-2 border rounded-md"><option value="other">Other</option><option value="melee">Melee</option><option value="ranged">Ranged</option></select></div>
                        </div>
                        <div id="spell-damage-fields" class="grid grid-cols-2 gap-4 border-t pt-4">
                            <div><label for="spell-damage-num-dice" class="block text-sm font-medium">Damage Dice</label><input type="number" id="spell-damage-num-dice" value="0" class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-damage-die-type" class="block text-sm font-medium">Die Type</label><input type="number" id="spell-damage-die-type" value="0" class="w-full p-2 border rounded-md"></div>
                        </div>
                        <div id="spell-range-fields" class="hidden grid-cols-2 gap-4 border-t pt-4">
                            <div><label for="spell-range" class="block text-sm font-medium">Range (ft)</label><input type="text" id="spell-range" placeholder="e.g., 30" class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-shape" class="block text-sm font-medium">Shape</label><select id="spell-shape" class="w-full p-2 border rounded-md">${spellShapes.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                        </div>
                        <button type="button" id="add-spell-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Spell</button>
                    </form>
                </div>
            </div>
        </div>
    `;
};

window.attachSpellsEditorHandlers = () => {
    const editorContainer = document.querySelector('#content-area');
    if (!editorContainer) return;

    // Handler for updating spell slots
    editorContainer.addEventListener('input', (e) => {
        if (e.target.tagName !== 'INPUT' || e.target.dataset.action !== 'update-spell-slot') return;
        
        const level = e.target.dataset.level;
        window.stores.character.updateSpellSlot(level, 'total', e.target.value);
    });

    // Handler for updating casting stat
    editorContainer.addEventListener('change', (e) => {
        if (e.target.tagName !== 'SELECT' || e.target.dataset.field !== 'spellcasting') return;

        window.updateCharacterInfo(e.target.dataset.field, e.target.value, e.target.dataset.subfield);
    });

    // Handlers for the "Add New Spell" form
    const addSpellBtn = document.getElementById('add-spell-btn');
    const spellTypeSelect = document.getElementById('spell-type');
    const spellRangeFields = document.getElementById('spell-range-fields');

    if (spellTypeSelect) {
        spellTypeSelect.onchange = (e) => {
            spellRangeFields.classList.toggle('hidden', e.target.value !== 'ranged');
        };
    }

    if (addSpellBtn) {
        addSpellBtn.onclick = () => {
            const newSpell = {
                name: document.getElementById('spell-name').value,
                description: document.getElementById('spell-description').value,
                level: parseInt(document.getElementById('spell-level').value, 10),
                school: document.getElementById('spell-school').value,
                castingTime: document.getElementById('spell-casting-time').value,
                duration: document.getElementById('spell-duration').value,
                spellType: document.getElementById('spell-type').value,
                damageNumDice: parseInt(document.getElementById('spell-damage-num-dice').value, 10),
                damageDieType: parseInt(document.getElementById('spell-damage-die-type').value, 10),
                range: document.getElementById('spell-range').value,
                shape: document.getElementById('spell-shape').value,
            };

            if (newSpell.name && !isNaN(newSpell.level)) {
                window.stores.character.addSpell(newSpell);
                window.showMessage('Spell added successfully!', 'green');
                document.getElementById('add-spell-form').reset();
                spellRangeFields.classList.add('hidden');
            } else {
                window.showMessage('Please enter a spell name and level.', 'red');
            }
        };
    }
};