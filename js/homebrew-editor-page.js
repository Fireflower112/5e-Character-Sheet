// js/homebrew-editor-page.js

window.HomebrewEditorPage = () => {
    const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
    const raceEntries = Object.values(homebrewRaces);

    const renderSubraceEntry = (baseRaceName, subrace) => {
        return `
            <div class="ml-8 pl-4 border-l flex items-center justify-between py-1">
                <span class="italic text-gray-700">${subrace.name}</span>
                <div class="space-x-2">
                    <button data-action="edit-homebrew-subrace" data-race-name="${baseRaceName}" data-subrace-name="${subrace.name}" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600">Edit</button>
                    <button data-action="delete-homebrew-subrace" data-race-name="${baseRaceName}" data-subrace-name="${subrace.name}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                </div>
            </div>
        `;
    };

    const renderRaceEntry = (race) => {
        return `
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-lg">${race.name}</h4>
                    <div class="space-x-2">
                        <button data-action="edit-homebrew-race" data-race-name="${race.name}" class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">Edit</button>
                        <button data-action="delete-homebrew-race" data-race-name="${race.name}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                    </div>
                </div>
                ${(race.subraces && race.subraces.length > 0) ? `
                    <div class="mt-2 pt-2 border-t">
                        <h5 class="font-medium text-sm text-gray-500 mb-1">Subraces:</h5>
                        ${race.subraces.map(sub => renderSubraceEntry(race.name, sub)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    };

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Homebrew Creations</h2>
            <div class="space-y-4">
                ${raceEntries.length > 0 
                    ? raceEntries.map(renderRaceEntry).join('') 
                    : '<p class="text-gray-500 italic">You haven\'t created any homebrew races yet. Go to the Character Editor to get started!</p>'
                }
            </div>
        </div>
    `;
};