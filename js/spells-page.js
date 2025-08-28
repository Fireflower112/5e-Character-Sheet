// js/spells-page.js
DndSheet.pages.SpellsPage = (character) => {
    const renderSpellSlots = (spellSlots) => {
        const slots = Array.isArray(spellSlots) ? spellSlots : [];
        const visibleSlots = slots
            .map((slot, level) => ({ ...slot, level }))
            .filter(slot => slot.level > 0 && slot.total > 0); // Also filter out level 0

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
                                <span class="w-12 text-center p-1 text-2xl font-bold">${slot.used}</span>
                                <span class="mx-1 text-gray-400">/</span>
                                <span class="w-12 text-center p-1 text-lg">${slot.total}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

     const renderSpells = (spells) => {
        const spellArray = Object.values(spells).sort((a,b) => a.level - b.level || a.name.localeCompare(b.name));
        if (spellArray.length === 0) return '<p class="text-gray-500 italic">No spells learned. Add them in the Character Editor > Spells tab.</p>';
        
        return spellArray.map(spell => {
            const rangeString = spell.range || 'N/A';
            const favoriteSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" viewBox="0 0 20 20" fill="${spell.favorited ? 'currentColor' : 'none'}" stroke="currentColor" style="color: ${spell.favorited ? '#FBBF24' : 'inherit'}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;

            return `
                <div id="spell-${spell.id}" class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-grow">
                            <h4 class="font-semibold text-lg">${spell.name} <span class="text-sm text-gray-500 font-normal">(Lvl ${spell.level})</span></h4>
                            <p class="text-xs text-gray-500">${spell.school || 'N/A'}</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button data-action="cast-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">Cast</button>
                            <button data-action="toggle-favorite-spell" data-spell-id="${spell.id}" class="text-gray-400 hover:text-yellow-500 transition-colors" title="Favorite">${favoriteSvg}</button>
                            <button data-action="delete-spell" data-spell-id="${spell.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-700 pt-2 border-t">${spell.description || ''}</p>
                </div>
            `;
        }).join('');
    };

    return `
        <div>
            ${renderSpellSlots(character.spellcasting.spellSlots)}
            <div class="space-y-3">
                ${renderSpells(character.spells)}
            </div>
        </div>
    `;
};

DndSheet.pages.attachSpellsPageHandlers = () => {};