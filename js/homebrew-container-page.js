// js/homebrew-container-page.js

DndSheet.pages.HomebrewContainerPage = (character, subPage) => {
    const isRaceActive = subPage === 'race';
    const isSubraceActive = subPage === 'subrace';
    const isSpellsActive = subPage === 'spells'; // This is the new functional tab
    
    let subContent = '';
    switch(subPage) {
        case 'race':
            subContent = DndSheet.pages.HomebrewRaceListPage();
            break;
        case 'subrace':
            subContent = DndSheet.pages.HomebrewSubraceListPage();
            break;
        case 'spells':
            subContent = DndSheet.pages.HomebrewSpellListPage();
            break;
        default:
            // Default now points to the first tab
            subContent = DndSheet.pages.HomebrewRaceListPage();
            break;
    }

    return `
        <div>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="race" class="sub-tab-button ${isRaceActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Race</button>
                <button data-action="sub-tab" data-subpage="subrace" class="sub-tab-button ${isSubraceActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Subrace</button>
                <button data-action="sub-tab" data-subpage="spells" class="sub-tab-button ${isSpellsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Spells</button>
                
                <button data-action="sub-tab" data-subpage="class" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Class</button>
                <button data-action="sub-tab" data-subpage="subclass" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Subclass</button>
                <button data-action="sub-tab" data-subpage="background" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Background</button>
                <button data-action="sub-tab" data-subpage="items" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Items</button>
                <button data-action="sub-tab" data-subpage="feats" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Feats</button>
                <button data-action="sub-tab" data-subpage="abilities" class="sub-tab-button text-gray-500 px-4 py-2 font-medium">Other</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};