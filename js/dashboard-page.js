// js/dashboard-page.js

// This helper function renders the content for the "Combat" tab
const renderCombatInfo = (character) => {
    const cbm = character.baseAttackBonus + window.getAbilityModifier(window.getFinalAbilityScore(character, 'str')) + window.getSizeModifier(character.size);
    const castingStat = character.spellcasting?.castingStat || 'int';
    const castingStatMod = window.getAbilityModifier(window.getFinalAbilityScore(character, castingStat));
    const casterLevel = character.level1 + character.level2;
    const concentrationItemBonus = window.stores.character.calculateItemBonusesForField('concentration');
    const concentrationBonus = casterLevel + castingStatMod + concentrationItemBonus;

    const renderFavoritedWeapons = () => {
        const favoritedWeapons = Object.values(character.inventory.items).filter(item => item.itemType === 'weapon' && item.favorited && item.equippedSlot);
        if (favoritedWeapons.length === 0) {
            return '<p class="text-gray-500 italic text-center">No favorited weapons are equipped.</p>';
        }
        const strMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'str'));
        const damageBonus = strMod >= 0 ? `+${strMod}` : strMod;
        return favoritedWeapons.map(weapon => `
            <div class="bg-white p-3 rounded-md shadow-inner flex items-center justify-between">
                <h4 class="font-semibold text-lg flex-grow">${weapon.name}</h4>
                <div class="flex items-center space-x-6 text-center">
                    <div>
                        <div class="text-xs text-gray-500 uppercase font-semibold">Damage</div>
                        <div class="font-bold text-gray-800">${weapon.numDice}d${weapon.dieType}${damageBonus}</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 uppercase font-semibold">Crit</div>
                        <div class="font-bold text-gray-800">x${weapon.critMultiplier}</div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 uppercase font-semibold">Range</div>
                        <div class="font-bold text-gray-800">${weapon.range > 0 ? `${weapon.range} ft.` : 'Melee'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    };

    const renderFavoritedSpells = () => {
        const favoritedSpells = Object.values(character.spells || {}).filter(spell => spell.favorited);
        if (favoritedSpells.length === 0) {
            return '<p class="text-gray-500 italic text-center">No spells favorited.</p>';
        }
        return favoritedSpells.map(spell => {
            const damageString = (spell.damageNumDice || 0) > 0 ? `${spell.damageNumDice}d${spell.damageDieType || 0}` : 'N/A';
            let rangeString;
            const rawRange = spell.range;
            if (rawRange && !isNaN(parseInt(rawRange, 10))) {
                rangeString = `${rawRange} ft.`;
            } else {
                rangeString = rawRange || 'N/A';
            }
            const shapeStatBlock = (spell.shape && spell.shape !== 'None')
                ? `<div>
                       <div class="text-xs text-gray-500 uppercase font-semibold">Shape</div>
                       <div class="font-bold text-gray-800">${spell.shape}</div>
                   </div>`
                : '';
            return `
                <div class="bg-white p-3 rounded-md shadow-inner flex items-center justify-between">
                    <h4 class="font-semibold text-lg flex-grow">${spell.name} <span class="text-gray-500 font-medium">(Lvl ${spell.level})</span></h4>
                    <div class="flex items-center space-x-4 text-center">
                        <div>
                            <div class="text-xs text-gray-500 uppercase font-semibold">Damage</div>
                            <div class="font-bold text-gray-800">${damageString}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 uppercase font-semibold">Range</div>
                            <div class="font-bold text-gray-800">${rangeString}</div>
                        </div>
                        ${shapeStatBlock}
                        <div>
                            <div class="text-xs text-gray-500 uppercase font-semibold">Cast Time</div>
                            <div class="font-bold text-gray-800">${spell.castingTime}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    return `
        <div class="grid grid-cols-1 gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-2">Combat Stats</h3>
                <div class="flex flex-col md:flex-row gap-4 text-center mb-4">
                    <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner"><span class="text-xl font-bold">${cbm >= 0 ? '+' : ''}${cbm}</span><span class="text-sm font-medium">CMB</span></div>
                    <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner"><span class="text-xl font-bold">${concentrationBonus >= 0 ? '+' : ''}${concentrationBonus}</span><span class="text-sm font-medium">Concentration</span></div>
                    <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner"><span class="text-xl font-bold">${character.spellcasting?.spellResistance || 0}</span><span class="text-sm font-medium">Spell Resist</span></div>
                </div>
                <h4 class="text-lg font-semibold mb-2 text-gray-700">Favorited & Equipped Weapons</h4>
                <div class="space-y-2 mb-4">${renderFavoritedWeapons()}</div>
                <h4 class="text-lg font-semibold mb-2 text-gray-700">Favorite Spells</h4>
                <div class="space-y-2">${renderFavoritedSpells()}</div>
            </div>
        </div>
    `;
};

// This helper function renders the content for the "Background" tab
const renderBackgroundInfo = (character) => {
    const feats = Object.values(character.feats || {});
    const abilities = Object.values(character.abilities || {});

    const renderFeats = () => {
        if (feats.length === 0) return '<p class="text-gray-500 italic">No feats added yet.</p>';
        return feats.map(feat => `
            <div class="bg-white p-3 rounded-lg shadow-inner">
                <h4 class="font-semibold">${feat.name}</h4>
                <p class="text-sm text-gray-600">${feat.description}</p>
            </div>
        `).join('');
    };

    const renderAbilities = () => {
        if (abilities.length === 0) return '<p class="text-gray-500 italic">No abilities added yet.</p>';
        return abilities.map(ability => `
            <div class="bg-white p-3 rounded-lg shadow-inner">
                <h4 class="font-semibold">${ability.name} <span class="text-sm text-gray-500">(${ability.type})</span></h4>
                <p class="text-sm text-gray-600">${ability.description}</p>
            </div>
        `).join('');
    };

    return `
        <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Feats</h3>
                <div class="space-y-2">${renderFeats()}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Racial & Class Abilities</h3>
                <div class="space-y-2">${renderAbilities()}</div>
            </div>
        </div>
    `;
};


// This is the main function that builds the Dashboard page
window.DashboardPage = (character, subPage) => {
    const isBasicActive = subPage === 'basic';
    const isCombatActive = subPage === 'combat';
    const isBackgroundActive = subPage === 'background';

    let subContent = '';
    switch (subPage) {
        case 'basic':
            subContent = window.MainPage(character);
            break;
        case 'combat':
            subContent = renderCombatInfo(character);
            break;
        case 'background':
            subContent = renderBackgroundInfo(character);
            break;
    }
    
    return `
        <div>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="basic" class="sub-tab-button ${isBasicActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Basic Info</button>
                <button data-action="sub-tab" data-subpage="combat" class="sub-tab-button ${isCombatActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Combat</button>
                <button data-action="sub-tab" data-subpage="background" class="sub-tab-button ${isBackgroundActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Background</button>
            </div>
            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};