// js/character-summary-header.js
window.renderCharacterSummaryHeader = (character) => {
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
        
    const languages = (character.languages || []).join(', ');

    return `
        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm mb-6">
            <div class="text-center mb-4"><h2 class="text-3xl font-bold text-gray-900">${character.name}</h2></div>
            <div class="flex flex-wrap md:flex-nowrap justify-between text-center divide-x divide-gray-300">
                <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Race / Subrace</div><div class="font-medium text-gray-800">${raceAndSubrace}</div></div>
                <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Class</div><div class="font-medium text-gray-800">${classAndLevel}</div></div>
                <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Alignment</div><div class="font-medium text-gray-800">${character.alignment}</div></div>
                <div class="w-1/2 md:w-1/4 px-2 py-1"><div class="text-sm font-semibold text-gray-500 uppercase">Languages</div><div class="font-medium text-gray-800">${languages}</div></div>
            </div>
            <div class="flex items-center justify-center mt-4 space-x-4 text-md font-medium text-gray-700">
                <span>Level: <span class="font-semibold">${totalLevel}</span></span>
                <span>XP: <span class="font-semibold">${character.experience.current} / ${character.experience.toNext}</span></span>
            </div>
        </div>
    `;
};