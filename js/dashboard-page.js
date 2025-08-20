// js/dashboard-page.js
window.DashboardPage = (character, subPage) => {
    const isBasicActive = subPage === 'basic';
    const isCombatActive = subPage === 'combat';
    const isBackgroundActive = subPage === 'background';
    const isSkillsActive = subPage === 'skills';
    const isSpellsActive = subPage === 'spells'; // New

    let subContent = '';
    switch (subPage) {
        case 'basic':
            subContent = window.MainPage(character);
            break;
        case 'combat':
            subContent = window.DashboardCombatPage(character);
            break;
        case 'background':
            subContent = window.DashboardBackgroundPage(character);
            break;
        case 'skills':
            subContent = window.DashboardSkillsPage(character);
            break;
        case 'spells': // New
            subContent = window.SpellsPage(character); // Renders the main spellbook view
            break;
    }
    
    return `
        <div>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="basic" class="sub-tab-button ${isBasicActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Basic Info</button>
                <button data-action="sub-tab" data-subpage="combat" class="sub-tab-button ${isCombatActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Combat</button>
                <button data-action="sub-tab" data-subpage="background" class="sub-tab-button ${isBackgroundActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Background</button>
                <button data-action="sub-tab" data-subpage="skills" class="sub-tab-button ${isSkillsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Skills</button>
                <button data-action="sub-tab" data-subpage="spells" class="sub-tab-button ${isSpellsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Spells</button>
            </div>
            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};