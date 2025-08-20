// js/info-page.js
window.InfoPage = (character) => {
    const dndSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
    const dndAlignments = [ 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil' ];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityScoreRow = (ability) => {
        const scores = character.abilityScores[ability];
        const finalScore = window.getFinalAbilityScore(character, ability);
        const modifier = window.getAbilityModifier(finalScore);

        return `
            <div class="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
                <div class="text-2xl font-bold uppercase">${ability}</div>
                <div class="text-5xl font-extrabold text-indigo-600 my-2">${modifier >= 0 ? '+' : ''}${modifier}</div>
                <div class="font-semibold text-gray-800">${finalScore}</div>
                <div class="grid grid-cols-3 gap-1 mt-3 text-sm">
                    <div><label class="text-xs font-medium">Base</label><input type="number" data-field="abilityScores" data-subfield="${ability}.base" value="${scores.base}" class="w-full p-1 border rounded text-center" /></div>
                    <div><label class="text-xs font-medium">Racial</label><input type="number" data-field="abilityScores" data-subfield="${ability}.racial" value="${scores.racial || 0}" class="w-full p-1 border rounded text-center" /></div>
                    <div><label class="text-xs font-medium">Other</label><input type="number" data-field="abilityScores" data-subfield="${ability}.other" value="${scores.other || 0}" class="w-full p-1 border rounded text-center" /></div>
                </div>
            </div>
        `;
    };

    const renderSavingThrows = () => {
        return abilityScores.map(ability => {
            const abilityMod = window.getAbilityModifier(window.getFinalAbilityScore(character, ability));
            const isProficient = character.savingThrows[ability]?.proficient || false;
            const totalBonus = abilityMod + (isProficient ? character.proficiencyBonus : 0);

            return `
                <div class="flex items-center justify-between p-2 border-b">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="save-prof-${ability}" data-save="${ability}" ${isProficient ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-600"/>
                        <label for="save-prof-${ability}" class="font-medium capitalize">${ability}</label>
                    </div>
                    <span class="font-bold text-lg">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                </div>
            `;
        }).join('');
    };
    
    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Character Information</h2>
            <div class="flex flex-col space-y-6">

                <div class="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center space-x-2"><label for="charName" class="font-medium text-gray-700">Name:</label><input id="charName" value="${character.name}" data-field="name" class="flex-1 p-2 bg-white border rounded-md"/></div>
                    <div class="flex items-center space-x-2"><label for="race" class="font-medium text-gray-700">Race:</label><input id="race" value="${character.race}" data-field="race" class="flex-1 p-2 bg-white border rounded-md"/></div>
                    <div class="flex items-center space-x-2"><label for="alignment" class="font-medium text-gray-700">Alignment:</label><select id="alignment" data-field="alignment" class="flex-1 p-2 bg-white border rounded-md">${dndAlignments.map(a => `<option value="${a}" ${character.alignment === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
                    <div class="flex items-center space-x-2"><label for="size" class="font-medium text-gray-700">Size:</label><select id="size" data-field="size" class="flex-1 p-2 bg-white border rounded-md">${dndSizes.map(s => `<option value="${s}" ${character.size === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${abilityScores.map(renderAbilityScoreRow).join('')}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                        <h3 class="text-xl font-semibold mb-2 text-center">Saving Throws</h3>
                        ${renderSavingThrows()}
                    </div>
                    <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                        <h3 class="text-xl font-semibold mb-2 text-center">General</h3>
                        <div class="flex items-center space-x-2"><label class="font-medium">Proficiency Bonus:</label><input type="number" data-field="proficiencyBonus" value="${character.proficiencyBonus}" class="w-20 p-1 border rounded text-center" /></div>
                    </div>
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
            if (field) {
                window.updateCharacterInfo(field, e.target.value, subField);
            }
        });
        
        infoContainer.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT') {
                const field = e.target.dataset.field;
                if (field) {
                    window.updateCharacterInfo(field, e.target.value);
                }
            } else if (e.target.dataset.save) {
                const character = window.stores.character.get();
                const newSaves = { ...character.savingThrows };
                newSaves[e.target.dataset.save].proficient = e.target.checked;
                window.stores.character.set({ savingThrows: newSaves });
            }
        });
    }
};