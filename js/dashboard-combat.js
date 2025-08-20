// js/dashboard-combat.js
window.DashboardCombatPage = (character) => {
    const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
    const strMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'str'));
    const totalAC = window.calculateTotalAC(character);
    const totalInitiative = dexMod + (character.initiative.other || 0);

    const renderSavingThrows = () => {
        return ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(ability => {
            const abilityMod = window.getAbilityModifier(window.getFinalAbilityScore(character, ability));
            const isProficient = character.savingThrows[ability]?.proficient || false;
            const totalBonus = abilityMod + (isProficient ? character.proficiencyBonus : 0);
            const displayName = ability.charAt(0).toUpperCase() + ability.slice(1);

            return `
                <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner">
                    <span class="text-xl font-bold">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                    <span class="text-sm font-medium">${displayName} Save</span>
                </div>`;
        }).join('');
    };

    // --- UPDATED: Calculates and displays 5e attack and damage bonuses ---
    const renderFavoritedWeapons = () => {
        const favoritedWeapons = Object.values(character.inventory.items).filter(item => item.itemType === 'weapon' && item.favorited && item.equippedSlot);
        if (favoritedWeapons.length === 0) {
            return '<p class="text-gray-500 italic text-center">No favorited weapons are equipped.</p>';
        }

        return favoritedWeapons.map(weapon => {
            const isFinesse = weapon.properties?.finesse;
            const abilityMod = isFinesse ? Math.max(strMod, dexMod) : strMod;
            const attackBonus = abilityMod + character.proficiencyBonus;
            const damageBonus = abilityMod;

            return `
                <div class="bg-white p-3 rounded-md shadow-inner text-center">
                    <h4 class="font-semibold text-lg">${weapon.name}</h4>
                    <div class="flex justify-center items-center space-x-6 mt-2">
                        <div>
                            <div class="text-xs text-gray-500 uppercase font-semibold">Attack</div>
                            <div class="font-bold text-gray-800">${attackBonus >= 0 ? '+' : ''}${attackBonus}</div>
                        </div>
                         <div>
                            <div class="text-xs text-gray-500 uppercase font-semibold">Damage</div>
                            <div class="font-bold text-gray-800">${weapon.numDice}d${weapon.dieType} ${damageBonus >= 0 ? `+ ${damageBonus}` : `- ${Math.abs(damageBonus)}`}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const renderFavoritedSpells = () => {
        const favoritedSpells = Object.values(character.spells || {}).filter(spell => spell.favorited);
        if (favoritedSpells.length === 0) return '<p class="text-gray-500 italic text-center">No spells favorited.</p>';
        return favoritedSpells.map(spell => `
            <div class="bg-white p-3 rounded-md shadow-inner">
                <h4 class="font-semibold text-lg">${spell.name} <span class="text-gray-500 font-medium">(Lvl ${spell.level})</span></h4>
            </div>
        `).join('');
    };

    return `
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-2">Armor Class</h3>
                <span class="text-6xl font-extrabold text-indigo-600">${totalAC}</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-2">Initiative</h3>
                <span class="text-6xl font-extrabold text-indigo-600">${totalInitiative >= 0 ? '+' : ''}${totalInitiative}</span>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-2">Health</h3>
                <div class="text-4xl font-extrabold text-gray-800">${character.hp} / ${character.maxHp}</div>
                ${character.tempHp > 0 ? `<div class="text-lg font-medium text-purple-500 mt-1">(+${character.tempHp} Temp)</div>` : ''}
            </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xl font-semibold mb-3 text-center">Saving Throws</h3>
            <div class="flex flex-col md:flex-row gap-4 text-center justify-center">
                ${renderSavingThrows()}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h4 class="text-lg font-semibold mb-2 text-gray-700">Favorited & Equipped Weapons</h4>
                <div class="space-y-2 mb-4">${renderFavoritedWeapons()}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h4 class="text-lg font-semibold mb-2 text-gray-700">Favorite Spells</h4>
                <div class="space-y-2">${renderFavoritedSpells()}</div>
            </div>
        </div>
    </div>
    `;
};

window.attachDashboardCombatHandlers = () => {
    // This page is currently view-only, but the handler is kept for future features.
};