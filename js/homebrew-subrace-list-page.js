// js/homebrew-subrace-list-page.js

DndSheet.pages.HomebrewSubraceListPage = () => {
    const homebrewSubraces = JSON.parse(localStorage.getItem('homebrewSubraces') || '{}');
    const baseRaceNames = Object.keys(homebrewSubraces);

    if (baseRaceNames.length === 0) {
        return '<p class="text-gray-500 italic">You haven\'t created any homebrew subraces yet. Go to the Character Editor to get started!</p>';
    }

    return `
        <div class="space-y-4">
            ${baseRaceNames.map(baseRaceName => `
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h3 class="text-lg font-semibold border-b pb-2 mb-2">Subraces for ${baseRaceName}</h3>
                    <div class="space-y-2">
                        ${homebrewSubraces[baseRaceName].map(subrace => `
                            <div class="flex items-center justify-between py-1">
                                <span class="text-gray-800">${subrace.name}</span>
                                <div class="space-x-2">
                                    <button data-action="edit-homebrew-subrace" data-race-name="${baseRaceName}" data-subrace-name="${subrace.name}" class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Edit</button>
                                    <button data-action="delete-homebrew-subrace" data-race-name="${baseRaceName}" data-subrace-name="${subrace.name}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};