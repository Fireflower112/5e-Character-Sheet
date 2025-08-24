// js/character-summary-header.js
DndSheet.pages.renderCharacterSummaryHeader = (character) => {
    if (!character || !character.name) {
        return '';
    }

    const classAndLevel = (character.classes || [])
        .map(c => `${c.name || 'Class'} ${c.level || 1}`)
        .join(' / ');
    
    const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0);

    const raceAndSubrace = character.subrace
        ? `${character.race} (${character.subrace})`
        : character.race;
        
    return `
        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div class="text-center mb-4"><h2 class="text-3xl font-bold text-gray-900">${character.name}</h2></div>
                    <div class="flex flex-wrap md:flex-nowrap justify-between text-center divide-x divide-gray-300">
                        <div class="w-1/2 md:w-1/3 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Race</div><div class="font-medium text-gray-800">${raceAndSubrace}</div></div>
                        <div class="w-1/2 md:w-1/3 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Class & Level</div><div class="font-medium text-gray-800">${classAndLevel} (Lvl ${totalLevel})</div></div>
                        <div class="w-1/2 md:w-1/3 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Alignment</div><div class="font-medium text-gray-800">${character.alignment}</div></div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-inner flex flex-col justify-center">
                    <div class="flex items-center justify-around text-center mb-3">
                        <div>
                            <div class="text-sm font-semibold text-gray-500 uppercase">Current HP</div>
                            <div class="font-bold text-3xl text-gray-800">${character.hp} / ${character.maxHp}</div>
                        </div>
                        <div>
                            <div class="text-sm font-semibold text-gray-500 uppercase">Temp HP</div>
                            <div class="font-bold text-3xl text-gray-800">${character.tempHp || 0}</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <input type="number" id="hp-change-input" class="w-24 p-2 border rounded-md text-center" placeholder="Amt">
                        <button data-action="apply-healing" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md">Heal</button>
                        <button data-action="apply-damage" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md">Damage</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};