// js/spells-page.js
DndSheet.pages.SpellsPage = (character) => {
    const renderSpellSlots = (spellSlots) => {
        const slots = Array.isArray(spellSlots) ? spellSlots : [];
        const visibleSlots = slots
            .map((slot, level) => ({ ...slot, level }))
            .filter(slot => slot.total > 0);

        if (visibleSlots.length === 0) {
            return `
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6">
                    <h3 class="text-xl font-semibold mb-3">Spell Slots</h3>
                    <p class="text-gray-500 italic">No spell slots available. Add them in the Character Editor > Spells tab.</p>
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
        if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned. Add them in the Character Editor > Spells tab.</p>';
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
                            <button onclick="DndSheet.stores.character.deleteSpell('${spell.id}')" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
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
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Known Spells</h3>
                <div id="all-spells" class="space-y-2">${renderSpells(character.spells || {})}</div>
            </div>
        </div>
    `;
};

DndSheet.pages.attachSpellsPageHandlers = () => {
    const allSpellsContainer = document.getElementById('all-spells');
    const spellSlotsContainer = document.getElementById('spell-slots-container');

    if (allSpellsContainer) {
        allSpellsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.action === 'toggle-favorite-spell') {
                DndSheet.stores.character.toggleFavoriteSpell(button.dataset.spellId);
            }
        });
    }

    if (spellSlotsContainer) {
        spellSlotsContainer.addEventListener('input', (e) => {
            const { level, type } = e.target.dataset;
            if (level && type === 'used') {
                DndSheet.stores.character.updateSpellSlot(level, type, e.target.value);
            }
        });
    }
};