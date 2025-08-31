// js/spells-editor-page.js

DndSheet.pages.SpellsEditorPage = (character) => {
    const castingStats = [ { key: 'int', label: 'Intelligence' }, { key: 'wis', label: 'Wisdom' }, { key: 'cha', label: 'Charisma' }];
    const spellSchools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
    const castingTimes = ['1 Action', '1 Bonus Action', '1 Reaction', '1 Minute', '10 Minutes', '1 Hour'];

    // --- NEW: Calculation Logic ---
    const spellcastingAbilityKey = character.spellcasting.castingStat || 'int';
    const abilityMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, spellcastingAbilityKey));
    const profBonus = character.proficiencyBonus || 2;

    const calculatedDC = 8 + profBonus + abilityMod;
    const calculatedAttack = profBonus + abilityMod;

    const spellSaveDC = character.spellcasting.dcOverride !== null ? character.spellcasting.dcOverride : calculatedDC;
    const spellAttackBonus = character.spellcasting.attackBonusOverride !== null ? character.spellcasting.attackBonusOverride : calculatedAttack;
    // --- END: Calculation Logic ---

    const renderSpellsList = (spells) => {
    const spellArray = Object.values(spells).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned yet.</p>';

    return spellArray.map(spell => {
        let damageHtml = '';
        if (spell.damageNumDice && spell.damageDieType) {
            damageHtml = `<p><strong>Damage:</strong> ${spell.damageNumDice}d${spell.damageDieType} ${spell.damageType || ''}</p>`;
        }

        const durationDisplay = spell.durationValue ? `${spell.durationValue} ${spell.durationUnit}` : (spell.durationUnit || 'N/A');

        return `
            <div class="bg-white rounded-md shadow-sm" data-accordion-wrapper>
                <div data-action="toggle-accordion" class="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-md">
                    <div>
                        <span class="font-semibold">${spell.name}</span>
                        <span class="text-sm text-gray-500">(${spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`})</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="delete-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>

                <div class="accordion-details hidden p-3 border-t border-gray-200">
                    <p class="text-gray-700 mb-2">${spell.description || 'No description.'}</p>
                    <div class="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                        <p><strong>School:</strong> ${spell.school || 'N/A'}</p>
                        <p><strong>Casting Time:</strong> ${spell.castingTime || 'N/A'}</p>
                        <p><strong>Duration:</strong> ${durationDisplay}</p>
                        ${damageHtml}
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
                        <div>
                            <label for="casting-stat" class="block text-sm font-medium">Casting Ability</label>
                            <select id="casting-stat" data-field="spellcasting" data-subfield="castingStat" class="w-full p-2 border rounded-md">${castingStats.map(s => `<option value="${s.key}" ${character.spellcasting.castingStat === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}</select>
                        </div>
                        <div>
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium">Spell Save DC</label>
                                <div class="text-xs">
                                    <input type="checkbox" id="dc-override-checkbox" data-action="toggle-dc-override" ${character.spellcasting.dcOverride !== null ? 'checked' : ''}>
                                    <label for="dc-override-checkbox">Override</label>
                                </div>
                            </div>
                            <input type="number" class="w-full p-2 border rounded-md bg-gray-200" value="${spellSaveDC}" readonly>
                            <input type="number" id="dc-override-value" data-field="spellcasting" data-subfield="dcOverride" class="w-full p-2 border rounded-md mt-1 ${character.spellcasting.dcOverride === null ? 'hidden' : ''}" value="${character.spellcasting.dcOverride || calculatedDC}">
                        </div>
                        <div>
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium">Spell Attack Bonus</label>
                                <div class="text-xs">
                                    <input type="checkbox" id="attack-override-checkbox" data-action="toggle-attack-override" ${character.spellcasting.attackBonusOverride !== null ? 'checked' : ''}>
                                    <label for="attack-override-checkbox">Override</label>
                                </div>
                            </div>
                            <input type="number" class="w-full p-2 border rounded-md bg-gray-200" value="${spellAttackBonus}" readonly>
                            <input type="number" id="attack-override-value" data-field="spellcasting" data-subfield="attackBonusOverride" class="w-full p-2 border rounded-md mt-1 ${character.spellcasting.attackBonusOverride === null ? 'hidden' : ''}" value="${character.spellcasting.attackBonusOverride || calculatedAttack}">
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Spell Browser</h3>
                    <input type="text" id="spell-search-input" placeholder="Search for a spell..." class="w-full p-2 border rounded-md mb-3">
                    <div id="spell-browser-results" class="bg-white rounded-md shadow-sm max-h-96 overflow-y-auto">
                        <p class="text-gray-500 italic p-4 text-center">Start typing to search for spells.</p>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add Custom Spell</h3>
                    <form id="add-spell-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label for="spell-name" class="block text-sm font-medium">Spell Name</label><input type="text" id="spell-name" required class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-level" class="block text-sm font-medium">Level</label><input type="number" id="spell-level" required class="w-full p-2 border rounded-md" min="0" max="9" value="0"></div>
                        </div>
                        <textarea id="spell-description" placeholder="Spell Description" class="w-full p-2 border rounded-md"></textarea>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t pt-4">
                            <div><label for="spell-school" class="block text-sm font-medium">School</label><select id="spell-school" class="w-full p-2 border rounded-md">${spellSchools.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                            <div><label for="spell-casting-time" class="block text-sm font-medium">Casting Time</label><select id="spell-casting-time" class="w-full p-2 border rounded-md">${castingTimes.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
                            <div><label for="spell-duration-value" class="block text-sm font-medium">Duration Value</label><input type="number" id="spell-duration-value" value="0" class="w-full p-2 border rounded-md"></div>
                            <div><label for="spell-duration-unit" class="block text-sm font-medium">Duration Unit</label><select id="spell-duration-unit" class="w-full p-2 border rounded-md"><option>Instantaneous</option><option>Rounds</option><option>Minutes</option><option>Hours</option></select></div>
                        </div>
                        <div class="border-t pt-4">
                            <label for="spell-duration-effect" class="block text-sm font-medium">Duration Effect</label>
                            <input type="text" id="spell-duration-effect" placeholder="e.g., Target is grappled" class="w-full p-2 border rounded-md">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
    <div>
        <label for="spell-damage-num-dice" class="block text-sm font-medium">Damage Dice #</label>
        <input type="number" id="spell-damage-num-dice" class="w-full p-2 border rounded-md">
    </div>
    <div>
        <label for="spell-damage-die-type" class="block text-sm font-medium">Damage Die Type</label>
        <input type="text" id="spell-damage-die-type" placeholder="e.g., d8" class="w-full p-2 border rounded-md">
    </div>
    <div>
        <label for="spell-damage-type" class="block text-sm font-medium">Damage Type</label>
        <select id="spell-damage-type" class="w-full p-2 border rounded-md bg-white">
            <option value="">None</option>
            <option value="Acid">Acid</option>
            <option value="Bludgeoning">Bludgeoning</option>
            <option value="Cold">Cold</option>
            <option value="Fire">Fire</option>
            <option value="Force">Force</option>
            <option value="Lightning">Lightning</option>
            <option value="Necrotic">Necrotic</option>
            <option value="Piercing">Piercing</option>
            <option value="Poison">Poison</option>
            <option value="Psychic">Psychic</option>
            <option value="Radiant">Radiant</option>
            <option value="Slashing">Slashing</option>
            <option value="Thunder">Thunder</option>
        </select>
    </div>
</div>
                        <button type="button" id="add-spell-btn" data-action="add-spell" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Spell</button>
                    </form>
                </div>

                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-3">Known Spells</h3>
                    <div class="space-y-3">${renderSpellsList(character.spells)}</div>
                </div>
            </div>
        </div>
    `;
};

DndSheet.pages.attachSpellsEditorHandlers = () => {
    // This is now called from main.js
};