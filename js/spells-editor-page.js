// js/spells-editor-page.js

window.SpellsEditorPage = (character) => {
    const castingStats = [
        { key: 'int', label: 'Intelligence' },
        { key: 'wis', label: 'Wisdom' },
        { key: 'cha', label: 'Charisma' }
    ];

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Spellcasting Settings</h2>
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
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
        </div>
    `;
};

window.attachSpellsEditorHandlers = () => {
    const editorContainer = document.querySelector('#content-area');
    if (!editorContainer) return;

    editorContainer.addEventListener('input', (e) => {
        if (e.target.tagName !== 'INPUT' || e.target.dataset.action !== 'update-spell-slot') return;
        
        const level = e.target.dataset.level;
        window.stores.character.updateSpellSlot(level, 'total', e.target.value);
    });

    editorContainer.addEventListener('change', (e) => {
        if (e.target.tagName !== 'SELECT' || e.target.dataset.field !== 'spellcasting') return;

        window.updateCharacterInfo(e.target.dataset.field, e.target.value, e.target.dataset.subfield);
    });
};