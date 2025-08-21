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
                    <span class="text-sm font-medium">${displayName}</span>
                </div>`;
        }).join('');
    };

    const renderFavoritedWeapons = () => { /* ... function is unchanged ... */ };
    const renderFavoritedSpells = () => { /* ... function is unchanged ... */ };

    return `
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
           {/*... AC, Initiative, Health ...*/}
        </div>

        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xl font-semibold mb-3 text-center">Saving Throws</h3>
            <div class="flex flex-col md:flex-row gap-4 text-center justify-center">
                ${renderSavingThrows()}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/*... Favorited Weapons and Spells ...*/}
        </div>
    </div>
    `;
};