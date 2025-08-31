// js/abilities-editor-page.js
DndSheet.pages.AbilitiesEditorPage = (character) => {
    const renderAbilityCard = (ability) => {
        return `
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex items-start justify-between gap-2">
                    <h4 class="font-semibold text-lg">${ability.name}</h4>
                    <button data-action="delete-ability" data-ability-id="${ability.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                </div>
                <p class="text-gray-600 text-sm mt-2">${ability.description || ''}</p>
            </div>`;
    };

    const renderAbilitySection = (title, abilities) => {
        if (abilities.length === 0) return '';
        return `
            <div class="bg-gray-50 p-4 rounded-xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">${title}</h3>
                <div class="space-y-3">${abilities.map(renderAbilityCard).join('')}</div>
            </div>`;
    };

    const allAbilities = Object.values(character.abilities || {});
    const racialAbilities = allAbilities.filter(a => a.source?.startsWith('Racial'));
    const classAbilities = allAbilities.filter(a => a.source === 'Class Feature');
    const otherAbilities = allAbilities.filter(a => !a.source);

    return `
        <div class="space-y-4">
            ${renderAbilitySection('Racial Abilities', racialAbilities)}
            ${renderAbilitySection('Class Abilities', classAbilities)}
            ${renderAbilitySection('Other Abilities', otherAbilities)}

            <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                <h3 class="text-lg font-semibold mb-3">Add New Ability</h3>
                <form id="add-ability-form" class="space-y-4">
                    <input type="text" id="ability-name" required class="w-full p-2 border rounded-md" placeholder="Ability Name">
                    <textarea id="ability-description" placeholder="Ability Description" class="w-full p-2 border rounded-md"></textarea>
                    <button type="button" data-action="add-ability" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Ability</button>
                </form>
            </div>
        </div>`;
};