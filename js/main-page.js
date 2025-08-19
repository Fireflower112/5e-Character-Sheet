// js/main-page.js
window.MainPage = (character) => {
    // Core Calculations
    const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
    
    // Total AC
    const totalAC = window.calculateTotalAC(character);
    
    // Get Armor/Shield bonuses for subtractions
    const { armorBonus, shieldBonus } = window.stores.character.calculateACBonuses();

    // Touch AC (Total AC - Armor, Shield, Natural Armor)
    const touchAC = totalAC - armorBonus - shieldBonus - character.armorClassComponents.naturalArmor;

    // Flat-Footed AC (Total AC - Dex (if positive) and Dodge)
    const flatFootedAC = totalAC - (dexMod > 0 ? dexMod : 0) - (character.armorClassComponents.dodge || 0);

    const sizeMod = window.getSizeModifier(character.size);
    const fortitudeTotal = character.savingThrows.fortitude.base + window.getAbilityModifier(window.getFinalAbilityScore(character, 'con')) + character.savingThrows.fortitude.other;
    const reflexTotal = character.savingThrows.reflex.base + dexMod + character.savingThrows.reflex.other;
    const willTotal = character.savingThrows.will.base + window.getAbilityModifier(window.getFinalAbilityScore(character, 'wis')) + character.savingThrows.will.other;
    const cmd = 10 + character.baseAttackBonus + window.getAbilityModifier(window.getFinalAbilityScore(character, 'str')) + dexMod + sizeMod;
    const totalInitiative = dexMod + character.initiative.other;
    const classAndLevel = character.class2 ? `${character.class1} ${character.level1} / ${character.class2} ${character.level2}` : `${character.class1} ${character.level1}`;

    return `
        <div class="flex flex-col gap-4">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <div class="text-center mb-4"><h2 class="text-3xl font-bold text-gray-900">${character.name}</h2></div>
                <div class="flex flex-wrap md:flex-nowrap justify-between text-center divide-x divide-gray-300">
                    <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Race</div><div class="font-medium text-gray-800">${character.race}</div></div>
                    <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Class</div><div class="font-medium text-gray-800">${classAndLevel}</div></div>
                    <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Alignment</div><div class="font-medium text-gray-800">${character.alignment}</div></div>
                    <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Size</div><div class="font-medium text-gray-800">${character.size}</div></div>
                </div>
                <div class="flex items-center justify-center mt-4 space-x-4 text-md font-medium text-gray-700"><span>Level: <span class="font-semibold">${character.level1 + character.level2}</span></span><span>XP: <span class="font-semibold">${character.experience.current} / ${character.experience.toNext}</span></span></div>
            </div>
            <div class="flex flex-wrap md:flex-nowrap gap-4">
                <div class="w-full md:w-1/3">
                    <div class="flex flex-col space-y-4 bg-gray-50 p-4 rounded-2xl shadow-sm h-full">
                        <h3 class="text-xl font-semibold text-center text-gray-800 mb-2">Health</h3>
                        <div class="flex flex-col items-center space-y-2 flex-1 justify-center">
                            <div class="text-center"><span class="text-5xl font-extrabold text-indigo-600">${character.hp}</span><span class="text-2xl font-semibold text-gray-500"> / ${character.maxHp}</span>${character.tempHp > 0 ? `<span class="text-lg font-medium text-purple-500 ml-2">(+${character.tempHp} Temp)</span>` : ''}</div>
                            <div class="flex items-center space-x-2"><input id="hp-value-input" type="number" value="1" class="w-20 p-2 text-center text-lg bg-white border border-gray-300 rounded-md shadow-sm" /><button id="hp-add-btn" class="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors">Add</button><button id="hp-subtract-btn" class="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors">Subtract</button></div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-2/3 flex flex-col gap-4">
                    <div class="flex flex-row gap-4 h-full">
                        <div class="w-1/2"><div class="bg-gray-50 p-4 rounded-2xl shadow-sm h-full"><h3 class="text-xl font-semibold mb-2 text-center">Initiative</h3><div class="flex flex-col justify-center h-full"><div class="text-center"><span class="text-5xl font-extrabold text-indigo-600">${totalInitiative >= 0 ? '+' : ''}${totalInitiative}</span></div></div></div></div>
                        <div class="w-1/2"><div class="bg-gray-50 p-4 rounded-2xl shadow-sm h-full"><h3 class="text-xl font-semibold mb-2 text-center">Armor Class</h3><div class="flex flex-col justify-center h-full"><div class="text-center"><span class="text-5xl font-extrabold text-indigo-600">${totalAC}</span></div><div class="flex justify-around mt-4"><div><span class="text-lg font-bold">${touchAC}</span><div class="text-sm">Touch</div></div><div><span class="text-lg font-bold">${flatFootedAC}</span><div class="text-sm">Flat-Footed</div></div><div><span class="text-lg font-bold">${cmd}</span><div class="text-sm">CMD</div></div></div></div></div></div>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap md:flex-nowrap gap-4">
                <div class="w-full md:w-1/3">
                    <div class="bg-gray-50 p-4 rounded-2xl shadow-sm h-full">
                        <h3 class="text-xl font-semibold mb-2 text-center">Speed</h3>
                        <div class="flex-1 flex flex-col justify-center items-center">
                            ${Object.entries(character.speed).filter(([, value]) => value > 0).map(([type, value]) => `
                                <div key="${type}" class="flex justify-between items-center mb-2 w-full max-w-[150px]">
                                    <span class="capitalize text-lg">${type}</span>
                                    <input
                                        type="number"
                                        value="${value}"
                                        readonly
                                        class="w-16 p-1 text-center bg-gray-200 text-gray-600 border border-gray-300 rounded-md cursor-not-allowed"
                                    />
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-2/3 flex flex-col gap-4">
                    <div class="flex flex-col space-y-2 bg-gray-50 p-4 rounded-2xl shadow-sm">
                        <h3 class="text-xl font-semibold mb-2 text-center">Ability Scores</h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                            ${Object.keys(character.abilityScores).map(ability => {
                                const finalScore = window.getFinalAbilityScore(character, ability);
                                const modifier = window.getAbilityModifier(finalScore);
                                return `
                                    <div key="${ability}" class="flex flex-col items-center">
                                        <span class="text-lg font-bold uppercase">${ability}</span>
                                        <span class="text-center text-xl font-bold p-1 my-1">
                                            ${modifier >= 0 ? '+' : ''}${modifier}
                                        </span>
                                        <span class="text-md font-medium text-gray-600">
                                            Score: ${finalScore}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-2xl shadow-sm h-full">
                        <h3 class="text-xl font-semibold mb-2 text-center">Saving Throws</h3>
                        <div class="flex flex-col md:flex-row gap-4 text-center">
                            <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner">
                                <span class="text-xl font-bold">${fortitudeTotal}</span>
                                <span class="text-sm font-medium">Fortitude</span>
                            </div>
                            <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner">
                                <span class="text-xl font-bold">${reflexTotal}</span>
                                <span class="text-sm font-medium">Reflex</span>
                            </div>
                            <div class="flex-1 flex flex-col items-center p-2 bg-white rounded-md shadow-inner">
                                <span class="text-xl font-bold">${willTotal}</span>
                                <div class="text-sm font-medium">Will</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.attachMainPageHandlers = () => {
    const hpInput = document.getElementById('hp-value-input');
    const hpAddBtn = document.getElementById('hp-add-btn');
    const hpSubtractBtn = document.getElementById('hp-subtract-btn');

    if (hpAddBtn) {
        hpAddBtn.onclick = () => {
            const value = parseInt(hpInput.value, 10) || 0;
            const currentHp = window.stores.character.get().hp;
            window.stores.character.set({ hp: currentHp + value });
        };
    }

    if (hpSubtractBtn) {
        hpSubtractBtn.onclick = () => {
            const value = parseInt(hpInput.value, 10) || 0;
            const currentHp = window.stores.character.get().hp;
            window.stores.character.set({ hp: currentHp - value });
        };
    }
};