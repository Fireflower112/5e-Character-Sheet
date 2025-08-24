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
    
    const languages = (character.languages || ['Common']).join(', ');
        
    return `
        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm mb-6 space-y-3">
            <div class="text-center"><h2 class="text-3xl font-bold text-gray-900">${character.name}</h2></div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center border-y border-gray-200 py-2 items-center">
                
                <div class="py-1">
                    <div class="text-sm font-semibold text-gray-500 uppercase">Race</div>
                    <div class="font-medium text-gray-800 truncate">${raceAndSubrace}</div>
                </div>

                <div class="py-1">
                    <div class="text-sm font-semibold text-gray-500 uppercase">Class & Level</div>
                    <div class="font-medium text-gray-800 truncate">${classAndLevel} (Lvl ${totalLevel})</div>
                </div>

                <div class="py-1">
                    <div class="text-sm font-semibold text-gray-500 uppercase">Alignment</div>
                    <div class="font-medium text-gray-800 truncate">${character.alignment}</div>
                </div>

                <div class="py-1">
                    <div class="text-sm font-semibold text-gray-500 uppercase">Languages</div>
                    <div class="font-medium text-gray-800 truncate" title="${languages}">${languages}</div>
                </div>

                <div class="bg-white p-3 rounded-lg shadow-inner space-y-2">
                    <div class="flex items-center justify-around">
                        <div>
                            <div class="text-xs font-semibold text-gray-500 uppercase">Current HP</div>
                            <div class="font-bold text-lg text-gray-800">${character.hp} / ${character.maxHp}</div>
                        </div>
                        <div>
                            <div class="text-xs font-semibold text-gray-500 uppercase">Temp HP</div>
                            <input type="number" data-field="tempHp" value="${character.tempHp || 0}" class="w-16 p-0 font-bold text-lg text-gray-800 bg-transparent border-0 text-center">
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-1">
                        <button data-action="apply-healing" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-md text-sm">Heal</button>
                        <input type="number" id="hp-change-input" class="w-16 p-1 border rounded-md text-center text-sm" placeholder="Amt">
                        <button data-action="apply-damage" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-sm">Damage</button>
                    </div>
                </div>

            </div>
        </div>
    `;
};