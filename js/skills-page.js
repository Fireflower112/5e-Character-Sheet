// js/skills-page.js
window.SkillsPage = (character) => {
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityScoreRow = (ability) => {
        const scores = character.abilityScores[ability];
        const finalScore = window.getFinalAbilityScore(character, ability);
        const modifier = window.getAbilityModifier(finalScore);

        return `
            <div class="p-4 bg-white rounded-lg shadow-inner text-center">
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
                <div class="flex items-center justify-between p-2 border-b bg-white rounded">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="save-prof-${ability}" data-save="${ability}" ${isProficient ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-600"/>
                        <label for="save-prof-${ability}" class="font-medium capitalize">${ability}</label>
                    </div>
                    <span class="font-bold text-lg">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                </div>
            `;
        }).join('');
    };

    const renderSkill = (skillName, skillData) => {
        const totalBonus = window.calculateSkillBonus(character, skillName, skillData);
        const formatName = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        return `
            <div class="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center justify-between">
                <div class="flex-1 flex items-center space-x-3">
                    <span class="font-bold text-lg w-12 text-center">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                    <span class="font-medium text-gray-800 w-40">${formatName(skillName)} <span class="text-sm text-gray-500">(${skillData.ability.toUpperCase()})</span></span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-1.5">
                        <input type="checkbox" id="prof-${skillName}" data-skill="${skillName}" data-type="proficient" ${skillData.proficient ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-600"/>
                        <label for="prof-${skillName}">Proficient</label>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <input type="checkbox" id="exp-${skillName}" data-skill="${skillName}" data-type="expertise" ${skillData.expertise ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-600"/>
                        <label for="exp-${skillName}">Expertise</label>
                    </div>
                </div>
            </div>
        `;
    };

    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Ability Scores</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${abilityScores.map(renderAbilityScoreRow).join('')}
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-2 text-center">Saving Throws</h3>
                    <div class="space-y-1">${renderSavingThrows()}</div>
                </div>
                <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-2 text-center">General</h3>
                    <div class="p-2 bg-white rounded flex items-center justify-between">
                        <label class="font-medium">Proficiency Bonus:</label>
                        <input type="number" data-field="proficiencyBonus" value="${character.proficiencyBonus}" class="w-20 p-1 border rounded text-center" />
                    </div>
                </div>
            </div>
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
                <div class="space-y-2">
                    ${Object.entries(character.skills).map(([name, data]) => renderSkill(name, data)).join('')}
                </div>
            </div>
        </div>
    `;
};

window.attachSkillsPageHandlers = () => {
    const skillsContainer = document.querySelector('#content-area');
    if (skillsContainer) {
        skillsContainer.addEventListener('input', (e) => {
            if (e.target.tagName !== 'INPUT') return;
            const field = e.target.dataset.field;
            const subField = e.target.dataset.subfield;
            if (field) {
                window.stores.character.updateCharacterProperty(field, e.target.value, subField);
            }
        });

        skillsContainer.addEventListener('change', (e) => {
            const skillName = e.target.dataset.skill;
            const type = e.target.dataset.type;
            const saveAbility = e.target.dataset.save;

            if (skillName && type) {
                const character = window.stores.character.get();
                const newSkills = { ...character.skills };
                newSkills[skillName][type] = e.target.checked;
                window.stores.character.set({ skills: newSkills });
            } else if (saveAbility) {
                const character = window.stores.character.get();
                const newSaves = { ...character.savingThrows };
                newSaves[saveAbility].proficient = e.target.checked;
                window.stores.character.set({ savingThrows: newSaves });
            }
        });
    }
};