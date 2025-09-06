// js/dashboard-combat.js

DndSheet.pages.DashboardCombatPage = (character) => {
    const dexMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'dex'));
    const totalAC = DndSheet.helpers.calculateTotalAC(character);
    const totalInitiative = dexMod + (character.initiative?.other || 0);

    const renderSavingThrows = () => {
        return ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(ability => {
            const abilityMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, ability));
            const isProficient = character.savingThrows[ability]?.proficient || false;
            const totalBonus = abilityMod + (isProficient ? (character.proficiencyBonus || 0) : 0);
            const displayName = ability.charAt(0).toUpperCase() + ability.slice(1);

            return `
                <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner min-w-[50px]">
                    <span class="text-xl font-bold">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                    <span class="text-sm font-medium">${displayName}</span>
                </div>`;
        }).join('');
    };

    const renderFavoritedWeapons = () => {
        const allItems = Object.values(character.inventory.items || {});
        const favWeapons = allItems.filter(item => item.itemType === 'weapon' && item.favorited);

        if (favWeapons.length === 0) {
            return '<p class="text-gray-500 italic text-center p-4">No favorited weapons.</p>';
        }

        return favWeapons.map(item => `
            <div class="bg-white p-3 rounded-lg shadow-inner">
                <h5 class="font-semibold text-indigo-700">${item.name}</h5>
                <p class="text-sm text-gray-600"><strong>Damage:</strong> ${item.numDice || 1}d${item.dieType || 6}</p>
                ${item.description ? `<p class="text-xs text-gray-500 mt-1">${item.description}</p>` : ''}
            </div>
        `).join('');
    };
    
    const renderFavoritedSpells = () => {
        const allSpells = Object.values(character.spells || {});
        const favSpells = allSpells.filter(spell => spell.favorited);

        if (favSpells.length === 0) {
            return '<p class="text-gray-500 italic text-center p-4">No favorited spells.</p>';
        }

        return favSpells.map(spell => {
            let damageHtml = '';
            if (spell.damageNumDice && spell.damageDieType) {
                damageHtml = `<p class="text-sm text-gray-600"><strong>Damage:</strong> ${spell.damageNumDice}d${spell.damageDieType} ${spell.damageType || ''}</p>`;
            }

        return `
            <div class="bg-white p-3 rounded-lg shadow-inner flex items-center justify-between">
                <div class="flex-grow">
                    <h5 class="font-semibold text-indigo-700">${spell.name} (${spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`})</h5>
                    ${damageHtml}
                    ${spell.description ? `<p class="text-xs text-gray-500 mt-1">${spell.description}</p>` : ''}
                </div>
                <div class="flex items-center">
                    <button data-action="cast-spell" data-spell-id="${spell.id}" class="bg-indigo-500 text-white text-xs px-2 py-1 rounded hover:bg-indigo-600">Cast</button>
                    <button data-action="toggle-favorite-spell" data-spell-id="${spell.id}" class="text-yellow-500 text-2xl pl-3 pr-1">${spell.favorited ? '★' : '☆'}</button>
                </div>
            </div>
        `;
        }).join('');
    };

    const renderTracker = () => {
    const timers = character.activeTimers || [];
    const timerListHtml = timers.length > 0 ? timers.map(timer => `
        <div class="flex items-center justify-between bg-white p-2 rounded-md shadow-inner">
            <div class="flex-grow">
                <div class="font-semibold">${timer.name}</div>
                ${timer.description ? `<div class="text-xs text-gray-500 italic">${timer.description}</div>` : ''}
            </div>
            <div class="flex items-center gap-3">
                <span class="text-lg font-semibold text-gray-700">${timer.duration} ${timer.unit}</span>
                <button data-action="decrement-timer" data-timer-id="${timer.id}" data-timer-unit="${timer.unit}" class="px-2 font-bold text-lg bg-gray-200 rounded hover:bg-gray-300">-</button>
                <button data-action="delete-timer" data-timer-id="${timer.id}" class="text-red-500 font-bold hover:text-red-700">✕</button>
            </div>
        </div>
    `).join('') : '<p class="text-gray-500 italic p-4 text-center">No active effects.</p>';

    return `
        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xl font-semibold mb-3">Temporary Effects & Timers</h3>
            <div class="space-y-2 mb-4">${timerListHtml}</div>
            <div class="border-t pt-3 space-y-2">
                <div class="flex items-end gap-2">
                    <div class="flex-grow">
                        <label for="timer-name" class="text-xs font-medium">Effect Name</label>
                        <input type="text" id="timer-name" class="w-full p-1 border rounded-md">
                    </div>
                    <div>
                        <label for="timer-duration" class="text-xs font-medium">#</label>
                        <input type="number" id="timer-duration" class="w-20 p-1 border rounded-md">
                    </div>
                    <div>
                        <label for="timer-unit" class="text-xs font-medium">Unit</label>
                        <select id="timer-unit" class="w-full p-1 border rounded-md">
                            <option>Rounds</option>
                            <option>Minutes</option>
                            <option>Hours</option>
                        </select>
                    </div>
                    <button data-action="add-timer" class="px-4 py-1 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 self-end">Add</button>
                </div>
                <div>
                    <label for="timer-description" class="text-xs font-medium">Description (Optional)</label>
                    <input type="text" id="timer-description" placeholder="e.g., Disadvantage on attack rolls" class="w-full p-1 border rounded-md">
                </div>
            </div>
        </div>
    `;
};

    return `
    <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Armor Class</h3>
                <p class="text-7xl font-bold text-gray-800">${totalAC || 0}</p>
           </div>
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Initiative</h3>
                <p class="text-7xl font-bold text-gray-800">${totalInitiative >= 0 ? '+' : ''}${totalInitiative || 0}</p>
           </div>
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Health</h3>
                <div class="text-5xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <span>${character.hp || 0}</span> / <span>${character.maxHp || 0}</span>
                </div>
                <p class="text-sm text-gray-500 mt-2">Current / Max</p>
           </div>
        </div>
        <div class="text-center">
            <button data-action="next-turn" class="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-700 transition-colors">
                Next Turn
            </button>
        </div>
        ${renderTracker()}
        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xl font-semibold mb-3 text-center">Saving Throws</h3>
            <div class="flex flex-wrap gap-2 text-center justify-center">
                ${renderSavingThrows()}
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Favorited Weapons</h3>
                <div class="space-y-2">${renderFavoritedWeapons()}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Favorited Spells</h3>
                <div class="space-y-2">${renderFavoritedSpells()}</div>
            </div>
        </div>
    </div>
    `;
};