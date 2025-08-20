// js/character-editor-page.js

document.addEventListener('DOMContentLoaded', () => {
    window.CharacterEditorPage = (character, subPage) => {
        // Determine which sub-tab is active for styling
        const isBasicActive = subPage === 'basic';
        const isSkillsActive = subPage === 'skills';
        const isAbilitiesActive = subPage === 'abilities';
        const isFeatsActive = subPage === 'feats';
        const isSpellsActive = subPage === 'spells'; // New active state

        let subContent = '';
        switch(subPage) {
            case 'basic':
                subContent = window.InfoPage(character); 
                break;
            case 'skills':
                subContent = window.SkillsPage(character);
                break;
            case 'abilities':
                subContent = window.AbilitiesEditorPage(character);
                break;
            case 'feats':
                subContent = `<h3 class="text-xl font-semibold">Feats</h3><p>This is where you'll add and view feats.</p>`;
                break;
            // NEW: Case for the spells editor tab
            case 'spells':
                subContent = window.SpellsEditorPage(character);
                break;
        }

        return `
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Character Editor</h2>
                <div class="flex space-x-2 border-b mb-4">
                    <button data-action="sub-tab" data-subpage="basic" class="sub-tab-button ${isBasicActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Basic Info</button>
                    <button data-action="sub-tab" data-subpage="skills" class="sub-tab-button ${isSkillsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Skills</button>
                    <button data-action="sub-tab" data-subpage="abilities" class="sub-tab-button ${isAbilitiesActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Abilities</button>
                    <button data-action="sub-tab" data-subpage="feats" class="sub-tab-button ${isFeatsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Feats</button>
                    {/* NEW: Spells tab button */}
                    <button data-action="sub-tab" data-subpage="spells" class="sub-tab-button ${isSpellsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Spells</button>
                </div>

                <div id="sub-content-area">
                    ${subContent}
                </div>
            </div>
        `;
    };
});