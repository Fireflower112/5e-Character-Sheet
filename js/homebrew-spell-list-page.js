// js/homebrew-spell-list-page.js
DndSheet.pages.HomebrewSpellListPage = () => {
    const homebrewSpells = JSON.parse(localStorage.getItem('homebrewSpells') || '{}');
    const spellEntries = Object.values(homebrewSpells);

    if (spellEntries.length === 0) {
        return `<p class="text-gray-500 italic">You haven't created any homebrew spells yet.</p>`;
    }

    return `
        <div class="space-y-4">
            ${spellEntries.map(spell => `
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between">
                        <h4 class="font-semibold text-lg">${spell.name} (Lvl ${spell.properties.Level})</h4>
                        <div class="space-x-2">
                            <button data-action="edit-homebrew-spell" data-spell-name="${spell.name}" class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Edit</button>
                            <button data-action="delete-homebrew-spell" data-spell-name="${spell.name}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};