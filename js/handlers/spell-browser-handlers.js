// js/handlers/spell-browser-handlers.js

(function() {
    let searchResults = [];

    const renderSearchResults = () => {
        const resultsContainer = document.getElementById('spell-browser-results');
        if (!resultsContainer) return;

        if (searchResults.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500 italic p-4 text-center">No spells found.</p>';
            return;
        }

        resultsContainer.innerHTML = searchResults.map(spell => `
            <div class="p-2 border-b flex justify-between items-center">
                <div>
                    <div class="font-semibold">${spell.name}</div>
                    <div class="text-xs text-gray-500">${spell.properties.School} | Lvl ${spell.properties.Level}</div>
                </div>
                <button data-action="add-premade-spell" data-spell-name="${spell.name}" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600">Add</button>
            </div>
        `).join('');
    };

    const searchSpells = () => {
        const query = document.getElementById('spell-search-input').value.toLowerCase();
        
        // MODIFIED: Get the character's current class to filter the spell list.
        const character = DndSheet.stores.character.get();
        // Assuming single class for now. Gets the first class name.
        const characterClass = character.classes && character.classes.length > 0 ? character.classes[0].name : null;

        const allSpells = DndSheet.data.allSpells || [];
        
        if (!query || !characterClass) {
            searchResults = [];
        } else {
            searchResults = allSpells
                .filter(spell => {
                    const nameMatch = spell.name.toLowerCase().includes(query);
                    // MODIFIED: Also check if the spell's class list includes the character's class.
                    const classMatch = spell.properties.Classes && spell.properties.Classes.includes(characterClass);
                    return nameMatch && classMatch;
                })
                .slice(0, 50);
        }
        renderSearchResults();
    };

    DndSheet.handlers.spellBrowserClickHandlers = {
        'add-premade-spell': (target) => {
            const spellName = target.dataset.spellName;
            // MODIFIED: Look in DndSheet.spells (the map) instead of DndSheet.data.allSpells (the array).
            const spellData = DndSheet.spells[spellName];

            if (spellData) {
                DndSheet.stores.characterActions.addPremadeSpell(spellData);
                DndSheet.helpers.showMessage(`${spellName} added to your spellbook!`, 'green');
            } else {
                console.error("Could not find spell data for:", spellName);
                DndSheet.helpers.showMessage(`Error adding ${spellName}.`, 'red');
            }
        }
    };

    DndSheet.app.attachSpellBrowserSearch = () => {
        const searchInput = document.getElementById('spell-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', searchSpells);
            // Also run a search immediately in case there's already text in the box
            searchSpells();
        }
    };

})();