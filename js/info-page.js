// js/info-page.js
window.InfoPage = (character) => {
    const dndAlignments = [ 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil' ];
    
    const raceNames = Object.keys(window.dndData.races || {});
    const homebrewRaceNames = Object.keys(JSON.parse(localStorage.getItem('homebrewRaces') || '{}'));
    const selectedRaceData = window.dndData.races[character.race];
    const subraces = selectedRaceData?.subraces || [];
    
    const classNames = Object.keys(window.dndData.classes || {});

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

                    <div class="flex items-center space-x-2">
                        <label for="race" class="font-medium text-gray-700">Race:</label>
                        <select id="race" data-field="race" class="flex-1 p-2 bg-white border rounded-md">
                            <option value="">-- Select a Race --</option>
                            ${raceNames.map(name => {
                                const displayName = homebrewRaceNames.includes(name) ? `${name} (HB)` : name;
                                return `<option value="${name}" ${character.race === name ? 'selected' : ''}>${displayName}</option>`;
                            }).join('')}
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
                        <button data-action="open-homebrew-subrace-modal" class="px-3 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300">Homebrew</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <div class="flex justify-between items-center border-b pb-1">
                            <h3 class="text-xl font-semibold text-gray-800">Class & Level</h3>
                            <button data-action="add-class" class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">Add Class</button>
                        </div>
                        <div id="class-level-container" class="space-y-2">
                            ${(character.classes || []).map((cls, index) => {
                                const selectedClassData = window.dndData.classes[cls.name];
                                const classSubclasses = selectedClassData?.subclasses || [];
                                
                                return `
                                <div class="p-3 border rounded-md bg-white space-y-2">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="text-sm font-medium">Class</label>
                                            <select data-action="update-class" data-index="${index}" data-field="name" class="w-full p-2 border rounded-md bg-white">
                                                <option value="">-- Select Class --</option>
                                                ${classNames.map(name => `<option value="${name}" ${cls.name === name ? 'selected' : ''}>${name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="text-sm font-medium">Level</label>
                                            <div class="flex items-center">
                                                <input type="number" value="${cls.level}" data-action="update-class" data-index="${index}" data-field="level" class="w-full p-2 border rounded-md"/>
                                                <button data-action="remove-class" data-index="${index}" class="ml-2 px-3 py-2 bg-red-500 text-white self-end rounded-md hover:bg-red-600">&times;</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium">${selectedClassData?.subclassTitle || 'Subclass'}</label>
                                        <select data-action="update-subclass" data-index="${index}" class="w-full p-2 border rounded-md bg-white" ${!cls.name || classSubclasses.length === 0 ? 'disabled' : ''}>
                                            <option value="">-- Select Subclass --</option>
                                            ${classSubclasses.map(sub => `<option value="${sub.name}" ${cls.subclassName === sub.name ? 'selected' : ''}>${sub.name}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                    <div class="space-y-3">
                         <div class="bg-gray-50 p-4 rounded-2xl shadow-sm h-full">
                            <h3 class="text-xl font-semibold mb-2 text-center">Health</h3>
                            <div class="flex flex-row items-center justify-center space-x-4 h-full">
                                <div class="flex items-center space-x-2"><label for="hpCurrent" class="font-medium">Current HP:</label><input type="number" id="hpCurrent" value="${character.hp}" data-field="hp" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                                <div class="flex items-center space-x-2"><label for="hpMax" class="font-medium">Max HP:</label><input type="number" id="hpMax" value="${character.maxHp}" data-field="maxHp" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};