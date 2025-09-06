// js/spells-page.js
DndSheet.pages.SpellsPage = (character) => {
    const renderSpellSlots = (spellSlots) => {
        const slots = Array.isArray(spellSlots) ? spellSlots : [];
        const visibleSlots = slots
            .map((slot, level) => ({ ...slot, level }))
            .filter(slot => slot.level > 0 && slot.total > 0);

        if (visibleSlots.length === 0) {
            return `
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6">
                    <h3 class="text-xl font-semibold mb-3">Spell Slots</h3>
                    <p class="text-gray-500 italic">No spell slots available. Add a class with spellcasting in the Character Editor.</p>
                </div>
            `;
        }
        
        return `
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm mb-6">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-xl font-semibold">Spell Slots</h3>
                    <button data-action="long-rest" class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">Long Rest</button>
                </div>
                <div id="spell-slots-container" class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    ${visibleSlots.map(slot => {
                        // MODIFIED: Calculate the remaining slots
                        const remaining = slot.total - slot.used;
                        return `
                        <div class="bg-white p-3 rounded-lg shadow-inner text-center">
                            <label class="font-bold text-lg">Lvl ${slot.level}</label>
                            <div class="flex items-center justify-center mt-1">
                                <input type="number" data-action="update-remaining-slots" data-level="${slot.level}" class="w-12 p-1 border rounded-md text-center font-semibold" value="${remaining}">
                                <span class="mx-1 text-gray-500">/</span>
                                <span class="w-12 p-1 font-semibold">${slot.total}</span>
                            </div>
                            <div class="flex items-center justify-center text-xs text-gray-400 mt-1">
                                <span class="w-12 text-center">Rem.</span>
                                <span class="mx-1"></span>
                                <span class="w-12 text-center">Total</span>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    };

    const renderSpellsList = (spellsByLevel) => {
        const favoriteSvg = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        
        return Object.keys(spellsByLevel).map(level => {
            const spells = spellsByLevel[level];
            return `
                <div class="mb-4">
                    <h4 class="text-lg font-semibold border-b pb-1 mb-2">${level === 'Cantrips' ? 'Cantrips' : `Level ${level} Spells`}</h4>
                    <div class="space-y-2">
                        ${spells.map(spell => `
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="flex justify-between items-center">
                                    <div class="flex-grow">
                                        <h4 class="font-semibold text-lg">${spell.name} <span class="text-sm text-gray-500 font-normal">(Lvl ${spell.level})</span></h4>
                                        <p class="text-xs text-gray-500">${spell.school || 'N/A'}</p>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <button data-action="cast-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">Cast</button>
                                        <button data-action="toggle-favorite-spell" data-spell-id="${spell.id}" class="text-gray-400 hover:text-yellow-500 transition-colors" title="Favorite">${favoriteSvg}</button>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-700 pt-2 border-t mt-2">${spell.description || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    };
    
    const allSpells = Object.values(character.spells || {});
    const spellsByLevel = allSpells.reduce((acc, spell) => {
        const level = spell.level === 0 ? "Cantrips" : spell.level;
        if (!acc[level]) acc[level] = [];
        acc[level].push(spell);
        return acc;
    }, {});

    return `
        <div>
            ${renderSpellSlots(character.spellcasting.spellSlots)}
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Known Spells</h3>
                ${renderSpellsList(spellsByLevel)}
            </div>
        </div>
    `;
};