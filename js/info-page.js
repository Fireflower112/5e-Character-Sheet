// js/info-page.js
window.InfoPage = (character) => {
    const dndAlignments = [ 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil' ];
    
    const raceNames = Object.keys(window.dndData.races || {});
    const selectedRaceData = window.dndData.races[character.race];
    const subraces = selectedRaceData?.subraces || [];
    
    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Character Information</h2>
            <div class="flex flex-col space-y-6">

                <div class="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2">
                        <label for="charName" class="font-medium text-gray-700">Name:</label>
                        <input id="charName" value="${character.name}" data-field="name" class="flex-1 p-2 bg-white border rounded-md"/>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label for="alignment" class="font-medium text-gray-700">Alignment:</label>
                        <select id="alignment" data-field="alignment" class="flex-1 p-2 bg-white border rounded-md">${dndAlignments.map(a => `<option value="${a}" ${character.alignment === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
                    </div>

                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div class="flex items-center space-x-2">
                            <label for="race" class="font-medium text-gray-700">Race:</label>
                            <select id="race" data-field="race" class="flex-1 p-2 bg-white border rounded-md">
                                <option value="">-- Select a Race --</option>
                                ${raceNames.map(name => `<option value="${name}" ${character.race === name ? 'selected' : ''}>${name}</option>`).join('')}
                            </select>
                            <button data-action="open-homebrew-modal" class="px-3 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300">Homebrew</button>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="flex-1 flex items-center space-x-2">
                                <label for="subrace" class="font-medium text-gray-700">Subrace:</label>
                                <select id="subrace" data-field="subrace" class="flex-1 p-2 bg-white border rounded-md">
                                    <option value="">-- Select --</option>
                                    ${subraces.map(sub => `<option value="${sub.name}" ${character.subrace === sub.name ? 'selected' : ''}>${sub.name}</option>`).join('')}
                                </select>
                            </div>
                            <button data-action="open-homebrew-subrace-modal" class="px-3 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300">New</button>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                    <label for="language-input" class="font-medium text-gray-700">Languages</label>
                    <div id="language-tags-container" class="flex flex-wrap gap-2 mt-2 mb-2">
                        ${(character.languages || []).map(lang => `
                            <span class="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                ${lang}
                                <button data-action="remove-language" data-lang="${lang}" class="ml-1.5 text-indigo-500 hover:text-indigo-700">&times;</button>
                            </span>
                        `).join('')}
                    </div>
                    <input id="language-input" list="language-options" class="w-full p-2 bg-white border rounded-md" placeholder="Type or select a language..."/>
                    <datalist id="language-options">
                        ${(window.dndData.languages || []).map(lang => `<option value="${lang}"></option>`).join('')}
                    </datalist>
                </div>
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Class & Level</h3>
                <div class="flex space-x-4">
                    <div class="flex-1 flex flex-col space-y-2"><label for="class1" class="font-medium text-gray-700">Class 1:</label><input id="class1" value="${character.class1}" data-field="class1" class="p-2 border rounded-md"/><label for="level1" class="font-medium text-gray-700">Level 1:</label><input type="number" id="level1" value="${character.level1}" data-field="level1" class="p-2 border rounded-md"/></div>
                    <div class="flex-1 flex flex-col space-y-2"><label for="class2" class="font-medium text-gray-700">Class 2:</label><input id="class2" value="${character.class2 || ''}" data-field="class2" class="p-2 border rounded-md"/><label for="level2" class="font-medium text-gray-700">Level 2:</label><input type="number" id="level2" value="${character.level2 || 0}" data-field="level2" class="p-2 border rounded-md"/></div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-2 text-center">Experience</h3>
                    <div class="flex justify-center items-center space-x-4">
                        <div class="flex items-center space-x-2"><label for="expCurrent" class="font-medium">Current:</label><input type="number" id="expCurrent" value="${character.experience.current}" data-field="experience" data-subfield="current" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                        <div class="flex items-center space-x-2"><label for="expToNext" class="font-medium">To Next:</label><input type="number" id="expToNext" value="${character.experience.toNext}" data-field="experience" data-subfield="toNext" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.attachInfoPageHandlers = () => {
    const infoContainer = document.querySelector('#content-area');
    if (infoContainer) {
        infoContainer.addEventListener('input', (e) => {
            if (e.target.tagName !== 'INPUT') return;
            const field = e.target.dataset.field;
            const subField = e.target.dataset.subfield;
            if (field && field !== 'languages') {
                window.stores.character.updateCharacterProperty(field, e.target.value, subField);
            }
        });
        
        infoContainer.addEventListener('change', (e) => {
            const field = e.target.dataset.field;

            if (field === 'race') {
                window.stores.character.applyRace(e.target.value);
            } else if (field === 'subrace') {
                window.stores.character.applySubrace(e.target.value);
            } else if (e.target.tagName === 'SELECT' && field) {
                window.updateCharacterInfo(field, e.target.value);
            }
        });

        infoContainer.addEventListener('click', (e) => {
            const actionTarget = e.target.closest('[data-action]');
            if (!actionTarget) return;
            
            const { action, lang } = actionTarget.dataset;

            if (action === 'open-homebrew-modal') {
                const modalContainer = document.getElementById('modal-container');
                modalContainer.innerHTML = window.renderHomebrewRaceModal();
                window.attachHomebrewRaceModalHandlers();
            } else if (action === 'open-homebrew-subrace-modal') {
                const modalContainer = document.getElementById('modal-container');
                modalContainer.innerHTML = window.renderHomebrewSubraceModal();
                window.attachHomebrewSubraceModalHandlers();
            } else if (action === 'remove-language') {
                window.stores.character.removeLanguage(lang);
            }
        });
        
        const langInput = document.getElementById('language-input');
        if (langInput) {
            langInput.addEventListener('change', (e) => {
                window.stores.character.addLanguage(e.target.value);
                e.target.value = '';
            });
        }
    }
};