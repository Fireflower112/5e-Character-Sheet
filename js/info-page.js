// js/info-page.js
DndSheet.pages.InfoPage = (character) => {
    const dndAlignments = [ 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil' ];
    
    const raceNames = Object.keys(DndSheet.data.races || {});
    const homebrewRaceNames = Object.keys(JSON.parse(localStorage.getItem('homebrewRaces') || '{}'));
    const selectedRaceData = DndSheet.data.races[character.race];
    const subraces = selectedRaceData?.subraces || [];
    const classNames = Object.keys(DndSheet.data.classes || {});

    // This function renders the detailed HP calculation section
    const renderHpSection = () => {
        const conMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'con'));
        const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0);
        let levelRows = '';

        if (totalLevel > 0) {
            const levelMap = [];
            (character.classes || []).forEach(cls => {
                for (let i = 1; i <= (cls.level || 1); i++) {
                    levelMap.push({ level: levelMap.length + 1, className: cls.name });
                }
            });
            levelMap.sort((a, b) => a.level - b.level);
            
            const firstClass = DndSheet.data.classes[levelMap[0].className];
            if (firstClass) {
                const level1Hp = (firstClass.hitDie || 0) + conMod;
                levelRows += `<div class="p-2 flex justify-between items-center bg-gray-200 rounded"><span>Level 1 (${levelMap[0].className}):</span> <span class="font-bold">${level1Hp} HP</span></div>`;
            }

            for (let i = 1; i < totalLevel; i++) {
                const currentLevel = levelMap[i].level;
                const currentClass = DndSheet.data.classes[levelMap[i].className];
                const rollValue = character.hpRolls[currentLevel] || '';
                const average = (currentClass?.hitDie / 2) + 1;
                const totalHpFromRoll = (parseInt(rollValue, 10) || average) + conMod;

                levelRows += `
                    <div class="p-2 flex justify-between items-center bg-gray-100 rounded">
                        <span>Level ${currentLevel} (${levelMap[i].className}):</span>
                        <div class="flex items-center gap-2">
                            <input type="number" placeholder="Avg: ${average}" value="${rollValue}" data-field="hpRolls" data-subfield="${currentLevel}" class="w-28 p-1 border rounded text-center" />
                            <span>+ ${conMod} (CON) = <span class="font-bold">${totalHpFromRoll}</span></span>
                        </div>
                    </div>
                `;
            }
        }
        
        return `
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm space-y-3">
                <h3 class="text-xl font-semibold mb-2 text-center">Health</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2"><label class="font-medium">Current HP:</label><input type="number" value="${character.hp}" data-field="hp" class="w-full p-1 text-center bg-white border rounded-md"/></div>
                    <div class="flex items-center space-x-2"><label class="font-medium">Temp HP:</label><input type="number" value="${character.tempHp}" data-field="tempHp" class="w-full p-1 text-center bg-white border rounded-md"/></div>
                </div>
                <div class="border-t pt-3 space-y-2">
                    <h4 class="font-semibold text-gray-700">Max HP Calculation</h4>
                    <div class="space-y-1">${levelRows}</div>
                </div>
                <div class="border-t pt-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="hp-override-toggle" data-action="toggle-hp-override" ${character.hpOverride !== null ? 'checked' : ''} class="h-4 w-4 rounded text-indigo-600"/>
                            <label for="hp-override-toggle" class="font-medium">Manual Override</label>
                        </div>
                        <input type="number" id="hp-override-value" placeholder="Set Max HP" value="${character.hpOverride || ''}" data-field="hpOverride" class="w-28 p-1 border rounded text-center ${character.hpOverride === null ? 'hidden' : ''}" />
                    </div>
                </div>
                <div class="border-t pt-2 text-center">
                    <label class="font-semibold text-gray-500">TOTAL MAX HP</label>
                    <p class="text-4xl font-bold text-gray-800">${character.maxHp}</p>
                </div>
            </div>
        `;
    };

    return `
        <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <select id="race" data-field="race" data-action="change-race" class="flex-1 p-2 bg-white border rounded-md">
					<option value="">-- Select a Race --</option>
                        ${raceNames.map(name => {
                            const displayName = homebrewRaceNames.includes(name) ? `${name} (HB)` : name;
                            return `<option value="${name}" ${character.race === name ? 'selected' : ''}>${displayName}</option>`;
                        }).join('')}
                    </select>
                    <button data-action="open-homebrew-modal" class="px-3 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600">Homebrew</button>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="flex-1 flex items-center space-x-2">
                        <label for="subrace" class="font-medium text-gray-700">Subrace:</label>
                        <select id="subrace" data-field="subrace" data-action="change-subrace" class="flex-1 p-2 bg-white border rounded-md" ${subraces.length === 0 ? 'disabled' : ''}>
						<option value="">-- None --</option>
                            ${subraces.map(sub => `<option value="${sub.name}" ${character.subrace === sub.name ? 'selected' : ''}>${sub.name}</option>`).join('')}
                        </select>
                    </div>
                    <button data-action="open-homebrew-subrace-modal" data-race-name="${character.race}" class="px-3 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600">Homebrew</button>
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
                            const selectedClassData = DndSheet.data.classes[cls.name];
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
                ${renderHpSection()}
            </div>
        </div>
    `;
};