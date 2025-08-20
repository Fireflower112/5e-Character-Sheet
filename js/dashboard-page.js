// js/dashboard-page.js
window.DashboardPage = (character, subPage) => {
    const isCombatActive = subPage === 'combat';
    const isBackgroundActive = subPage === 'background';
    const isSkillsActive = subPage === 'skills';
    const isSpellsActive = subPage === 'spells';

    let subContent = '';
    switch (subPage) {
        case 'skills':
            subContent = window.DashboardSkillsPage(character);
            break;
        case 'spells':
            subContent = window.SpellsPage(character);
            break;
        case 'combat':
            subContent = window.DashboardCombatPage(character);
            break;
        case 'background':
            subContent = window.DashboardBackgroundPage(character);
            break;
        default:
            subContent = window.DashboardSkillsPage(character);
    }

    // --- NEW: Calculation for class/level display ---
    const classAndLevel = character.class2 ? `${character.class1} ${character.level1} / ${character.class2} ${character.level2}` : `${character.class1} ${character.level1}`;
    
    return `
        <div class="space-y-4">
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

            <div>
                <div class="flex space-x-2 border-b mb-4">
                    <button data-action="sub-tab" data-subpage="skills" class="sub-tab-button ${isSkillsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Skills</button>
                    <button data-action="sub-tab" data-subpage="spells" class="sub-tab-button ${isSpellsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Spells</button>
                    <button data-action="sub-tab" data-subpage="combat" class="sub-tab-button ${isCombatActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Combat</button>
                    <button data-action="sub-tab" data-subpage="background" class="sub-tab-button ${isBackgroundActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Feats & Abilities</button>
                </div>
                <div id="sub-content-area">
                    ${subContent}
                </div>
            </div>
        </div>
    `;
};