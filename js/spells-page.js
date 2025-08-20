// js/spells-page.js
window.SpellsPage = (character) => {
    const spellSchools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Universal'];
    const castingTimes = ['1 standard action', '1 swift action', '1 immediate action', '1 minute', '10 minutes', '1 hour', '24 hours'];
    const durations = ['Instantaneous', '1 round/level', '1 min/level', '10 min/level', '1 hour/level', '24 hours', 'Permanent'];
    const spellShapes = ['None', 'Cone', 'Sphere', 'Cylinder', 'Line', 'Burst'];

    const renderSpellSlots = (spellSlots) => {
        const slots = Array.isArray(spellSlots) ? spellSlots : [];
        // --- UPDATED: Filter out spell levels with 0 total slots ---
        const visibleSlots = slots
            .map((slot, level) => ({ ...slot, level })) // Add level to object for reference
            .filter(slot => slot.total > 0);

        if (visibleSlots.length === 0) {
            return `
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6">
                    <h3 class="text-xl font-semibold mb-3">Spell Slots</h3>
                    <p class="text-gray-500 italic">No spell slots available. Add them in the Character Editor.</p>
                </div>
            `;
        }
        
        return `
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6">
                <h3 class="text-xl font-semibold mb-3">Spell Slots</h3>
                <div id="spell-slots-container" class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    ${visibleSlots.map(slot => `
                        <div class="bg-white p-3 rounded-lg shadow-inner text-center">
                            <label class="font-bold text-lg">Lvl ${slot.level}</label>
                            <div class="flex items-center justify-center mt-2">
                                <input type="number" value="${slot.used}" data-level="${slot.level}" data-type="used" class="w-12 text-center p-1 border rounded-md">
                                <span class="mx-1">/</span>
                                <input type="number" value="${slot.total}" class="w-12 text-center p-1 border rounded-md bg-gray-200" readonly>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

    const renderSpells = (spells) => {
        const spellArray = Object.values(spells);
        if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned.</p>';
        return spellArray.map(spell => {
            let rangeString;
            const rawRange = spell.range;
            if (rawRange && !isNaN(parseInt(rawRange, 10))) {
                rangeString = `${rawRange} ft.`;
            } else {
                rangeString = rawRange || 'N/A';
            }

            return `
                <div id="spell-${spell.id}" class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><h4 class="font-semibold text-lg">${spell.name}</h4><span class="text-sm text-gray-500">(Lvl ${spell.level})</span></div>
                        <div class="flex items-center space-x-3">
                            <button data-action="toggle-favorite-spell" data-spell-id="${spell.id}" class="text-gray-400 hover:text-yellow-500 transition-colors" title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${spell.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${spell.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></button>
                            <button onclick="window.stores.character.deleteSpell('${spell.id}')" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><strong>School:</strong> ${spell.school} | <strong>Damage:</strong> ${spell.damageNumDice || 0}d${spell.damageDieType || 0}</p>
                        <p><strong>Cast Time:</strong> ${spell.castingTime} | <strong>Duration:</strong> ${spell.duration}</p>
                        <p><strong>Range:</strong> ${rangeString} | <strong>Shape:</strong> ${spell.shape || 'N/A'}</p>
                    </div>
                    ${spell.description ? `<p class="text-gray-700 text-sm mt-2 pt-2 border-t">${spell.description}</p>` : ''}
                </div>
            `;
        }).join('');
    };

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Spellbook</h2>
            ${renderSpellSlots(character.spellcasting.spellSlots)}
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm"><h3 class="text-xl font-semibold mb-3">All Spells</h3><div id="all-spells" class="space-y-2">${renderSpells(character.spells || {})}</div></div>
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

window.attachSpellsPageHandlers = () => {
    const addSpellBtn = document.getElementById('add-spell-btn');
    const allSpellsContainer = document.getElementById('all-spells');
    const spellSlotsContainer = document.getElementById('spell-slots-container');
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

    if (allSpellsContainer) {
        allSpellsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.action === 'toggle-favorite-spell') {
                window.stores.character.toggleFavoriteSpell(button.dataset.spellId);
            }
        });
    }

    if (spellSlotsContainer) {
        // Use 'input' instead of 'change' for more immediate updates
        spellSlotsContainer.addEventListener('input', (e) => {
            const { level, type } = e.target.dataset;
            if (level && type === 'used') { // Only 'used' slots are editable here
                window.stores.character.updateSpellSlot(level, type, e.target.value);
            }
        });
    }
};