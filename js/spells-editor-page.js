// js/spells-editor-page.js
DndSheet.pages.SpellsEditorPage = (character) => {
    const castingStats = [ { key: 'int', label: 'Intelligence' }, { key: 'wis', label: 'Wisdom' }, { key: 'cha', label: 'Charisma' }];


const renderSpellsList = (spells) => {
    const spellArray = Object.values(spells).sort((a, b) => (a.level || a.properties?.Level) - (b.level || b.properties?.Level) || a.name.localeCompare(b.name));
    if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned yet.</p>';

    return spellArray.map(spell => {
        // Use the new 'properties' object if it exists, otherwise fall back to the old structure for custom spells.
        const props = spell.properties || spell;

        // --- Build the new detailed display ---
        let damageHtml = '';
        if (props.Damage && props['Damage Type']) {
            damageHtml = `<p><strong>Damage:</strong> ${props.Damage} ${props['Damage Type']}</p>`;
        }

        const isConcentration = spell.trackerInfo?.requiresConcentration || props.Concentration === 'Yes';

        return `
            <div class="bg-white rounded-md shadow-sm" data-accordion-wrapper>
                <div data-action="toggle-accordion" class="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-md">
                    <div>
                        <span class="font-semibold">${spell.name}</span>
                        <span class="text-sm text-gray-500">(${props.Level === 0 ? 'Cantrip' : `Lvl ${props.Level}`})</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="delete-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <div class="accordion-details hidden p-3 border-t border-gray-200">
                    <p class="text-gray-700 mb-2">${spell.description || 'No description.'}</p>
                    
                    <div class="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <p><strong>School:</strong> ${props.School || 'N/A'}</p>
                        <p><strong>Casting Time:</strong> ${props['Casting Time'] || 'N/A'}</p>
                        <p><strong>Range:</strong> ${props.Range || 'N/A'}</p>
                        <p><strong>Duration:</strong> ${props.Duration || 'N/A'}</p>
                        ${damageHtml}
                        <div class="flex items-center">
                            <input type="checkbox" ${isConcentration ? 'checked' : ''} disabled class="h-4 w-4 rounded text-indigo-600 mr-2">
                            <label>Requires Concentration</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

 return `
        <div>
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-3">Spellcasting Stats</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label for="casting-stat" class="block text-sm font-medium">Casting Ability</label><select id="casting-stat" data-field="spellcasting" data-subfield="castingStat" class="w-full p-2 border rounded-md">${castingStats.map(s => `<option value="${s.key}" ${character.spellcasting.castingStat === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}</select></div>
                        <div><label class="block text-sm font-medium">Spell Save DC</label><input type="number" class="w-full p-2 border rounded-md bg-gray-200" value="0" readonly></div>
                        <div><label class="block text-sm font-medium">Spell Attack Bonus</label><input type="number" class="w-full p-2 border rounded-md bg-gray-200" value="0" readonly></div>
                    </div>
                </div>
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                       <h3 class="text-xl font-semibold mb-3">Spell Slots (Manual Override)</h3>
                       <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
                            ${(character.spellcasting.spellSlots || []).filter((s, i) => i > 0).map((slot, index) => {
                                const level = index + 1;
                                return `
                                    <div class="text-center">
                                        <label class="font-bold">Lvl ${level}</label>
                                        <input type="number" data-action="update-spell-slot-total" data-level="${level}" class="w-full p-2 border rounded-md text-center mt-1" value="${slot.total}">
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Spell Browser</h3>
                    <input type="text" id="spell-search-input" placeholder="Search for a spell..." class="w-full p-2 border rounded-md mb-3">
                    <div id="spell-browser-results" class="bg-white rounded-md shadow-sm max-h-96 overflow-y-auto">
                        <p class="text-gray-500 italic p-4 text-center">Start typing to search for spells.</p>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner text-center">
                     <button data-action="open-homebrew-spell-modal" class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Create Homebrew Spell</button>
                </div>

                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-3">Known Spells</h3>
                    <div class="space-y-3">${renderSpellsList(character.spells)}</div>
                </div>
            </div>
        </div>
    `;
};