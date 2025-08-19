// js/character-editor-page.js

window.CharacterEditorPage = (character, subPage) => {
    // Determine which sub-tab is active for styling
    const isBasicActive = subPage === 'basic';
    const isSkillsActive = subPage === 'skills';
    const isAbilitiesActive = subPage === 'abilities';
    const isFeatsActive = subPage === 'feats';

    let subContent = '';
    // Based on the active sub-page, call your OLD rendering functions!
    switch(subPage) {
        case 'basic':
            // Reusing your existing "Character Info" page code!
            subContent = window.InfoPage(character); 
            break;
        case 'skills':
            // Reusing your existing "Skills" page code!
            subContent = window.SkillsPage(character);
            break;
        case 'abilities':
            subContent = `<h3 class="text-xl font-semibold">Racial & Class Abilities</h3><p>This is where you'll add and view class and racial abilities.</p>`;
            break;
        case 'feats':
            subContent = `<h3 class="text-xl font-semibold">Feats</h3><p>This is where you'll add and view feats.</p>`;
            break;
    }

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Character Editor</h2>
            <div class="flex space-x-2 border-b mb-4">
                <button data-subpage="basic" class="sub-tab-button ${isBasicActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Basic Info</button>
                <button data-subpage="skills" class="sub-tab-button ${isSkillsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Skills</button>
                <button data-subpage="abilities" class="sub-tab-button ${isAbilitiesActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Abilities</button>
                <button data-subpage="feats" class="sub-tab-button ${isFeatsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Feats</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};