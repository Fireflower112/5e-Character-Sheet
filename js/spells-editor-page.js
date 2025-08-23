// js/spells-editor-page.js

DndSheet.pages.SpellsEditorPage = (character) => {
    const castingStats = [
        { key: 'int', label: 'Intelligence' },
        { key: 'wis', label: 'Wisdom' },
        { key: 'cha', label: 'Charisma' }
    ];
    const spellSchools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
    const castingTimes = ['1 Action', '1 Bonus Action', '1 Reaction', '1 Minute', '10 Minutes', '1 Hour'];
    const durations = ['Instantaneous', '1 Round', '1 Minute', '10 Minutes', '1 Hour', '8 Hours', '24 Hours', 'Special', 'Until Dispelled'];
    const spellShapes = ['None', 'Cone', 'Sphere', 'Cylinder', 'Line', 'Cube'];

    const renderSpells = (spells) => {
        const spellArray = Object.values(spells).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
        if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned yet.</p>';
        return spellArray.map(spell => {
            return `
                <div id="spell-editor-${spell.id}" class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-grow">
                            <h4 class="font-semibold text-lg">${spell.name} <span class="text-sm text-gray-500 font-normal">(Lvl ${spell.level})</span></h4>
                            <p class="text-xs text-gray-500">${spell.school}</p>
                        </div>
                        <div class="flex items-center space-x-3 flex-shrink-0">
                            <button data-action="toggle-favorite-spell" data-spell-id="${spell.id}" class="text-gray-400 hover:text-yellow-500 transition-colors" title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${spell.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${spell.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></button>
                            <button data-action="delete-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                    ${spell.description ? `<p class="text-gray-700 text-sm mt-2 pt-2 border-t">${spell.description}</p>` : ''}
                </div>
            `;
        }).join('');
    };


    return `
        <div>
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
                                <label for="spellResistance" class="text-lg font-medium text-gray-700">Spell Save DC:</label>
                                <input type="number" id="spellResistance" value="${character.spellcasting?.spellResistance || 0}" data-field="spellcasting" data-subfield="spellResistance" class="w-24 p-2 text-lg bg-white border rounded-md"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Total Spells Per Day:</h4>
                        <p class="text-sm text-gray-500 mb-4">Set the total number of spell slots for each level. This will update the list in the main Spellbook tab.</p>
                        <div class="grid grid-cols-5 lg:grid-cols-10 gap-4 text-center">
                            ${(character.spellcasting.spellSlots || []).map((slot, level) => `
                                <div class="flex flex-col items-center">
                                    <label class="font-medium">Lvl ${level}</label>
                                    <input 
                                        type="number" 
                                        value="${slot.total}" 
                                        data-action="update-spell-slot-total"
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
                            <div><label for="spell-level" class="block text-sm font-medium">Level</label><input type="number" id="spell-level" required class="w-full p-2 border rounded-md" min="0" max="9"></div>
                        </div>
                        <textarea id="spell-description" placeholder="Spell Description" class="w-full p-2 border rounded-md"></textarea>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div><label for="spell-school" class="block text-sm font-medium">School</label><select id="spell-school" class="w-full p-2 border rounded-md">${spellSchools.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                            <div><label for="spell-casting-time" class="block text-sm font-medium">Casting Time</label><select id="spell-casting-time" class="w-full p-2 border rounded-md">${castingTimes.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
                            <div><label for="spell-duration" class="block text-sm font-medium">Duration</label><select id="spell-duration" class="w-full p-2 border rounded-md">${durations.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
                             <div><label for="spell-range" class="block text-sm font-medium">Range</label><input type="text" id="spell-range" placeholder="e.g., 30 ft" class="w-full p-2 border rounded-md"></div>
                        </div>
                        <button type="button" id="add-spell-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Spell</button>
                    </form>
                </div>

                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-3">Known Spells</h3>
                    <div id="all-spells-editor-list" class="space-y-3">${renderSpells(character.spells || {})}</div>
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
                duration: document.getElementById('spell-duration').value,
                range: document.getElementById('spell-range').value,
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