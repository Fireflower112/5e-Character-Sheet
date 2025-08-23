// js/dashboard-combat.js
DndSheet.pages.DashboardCombatPage = (character) => {
    const dexMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'dex'));
    const strMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'str'));
    const totalAC = DndSheet.helpers.calculateTotalAC(character);
    const totalInitiative = dexMod + (character.initiative?.other || 0);

    const renderSavingThrows = () => {
        return ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(ability => {
            const abilityMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, ability));
            const isProficient = character.savingThrows[ability]?.proficient || false;
            const totalBonus = abilityMod + (isProficient ? character.proficiencyBonus : 0);
            const displayName = ability.charAt(0).toUpperCase() + ability.slice(1);

            return `
                <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner">
                    <span class="text-xl font-bold">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                    <span class="text-sm font-medium">${displayName}</span>
                </div>`;
        }).join('');
    };

    const renderFavoritedWeapons = () => {
        const allItems = Object.values(character.inventory.items || {});
        const favWeapons = allItems.filter(item => item.itemType === 'weapon' && item.favorited);

        if (favWeapons.length === 0) {
            return '<p class="text-gray-500 italic text-center p-4">No favorited weapons. You can favorite a weapon from the Inventory -> All Items tab.</p>';
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
            return '<p class="text-gray-500 italic text-center p-4">No favorited spells. You can favorite a spell from the Spells tab.</p>';
        }

        return favSpells.map(spell => `
             <div class="bg-white p-3 rounded-lg shadow-inner">
                <h5 class="font-semibold text-indigo-700">${spell.name} (Lvl ${spell.level})</h5>
                <p class="text-sm text-gray-600"><strong>Damage:</strong> ${spell.damageNumDice || 0}d${spell.damageDieType || 0}</p>
                ${spell.description ? `<p class="text-xs text-gray-500 mt-1 truncate">${spell.description}</p>` : ''}
            </div>
        `).join('');
    };

    return `
    <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Armor Class</h3>
                <p class="text-7xl font-bold text-gray-800">${totalAC}</p>
           </div>
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Initiative</h3>
                <p class="text-7xl font-bold text-gray-800">${totalInitiative >= 0 ? '+' : ''}${totalInitiative}</p>
           </div>
           <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-lg font-semibold text-gray-500 uppercase">Health</h3>
                <div class="text-5xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <span>${character.hp}</span> / <span>${character.maxHp}</span>
                </div>
                <p class="text-sm text-gray-500 mt-2">Current / Max</p>
           </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xl font-semibold mb-3 text-center">Saving Throws</h3>
            <div class="flex flex-wrap gap-2 text-center justify-center">
                ${renderSavingThrows()}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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