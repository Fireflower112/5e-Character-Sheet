// js/skills-page.js
window.SkillsPage = (character) => {
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityScoreRow = (ability) => {
        const scores = character.abilityScores[ability];
        const finalScore = window.getFinalAbilityScore(character, ability);
        const modifier = window.getAbilityModifier(finalScore);

        return `
            <div class="p-3 bg-white rounded-lg shadow-inner text-center">
                <div class="font-bold text-lg uppercase">${ability}</div>
                <div class="font-extrabold text-3xl text-indigo-600">${modifier >= 0 ? '+' : ''}${modifier}</div>
                <div class="text-sm font-semibold">${finalScore}</div>
                <div class="flex gap-1 mt-2 text-left">
                    <div>
                        <label class="text-xs font-medium text-gray-500">Base</label>
                        <input type="number" data-field="abilityScores" data-subfield="${ability}.base" value="${scores.base}" class="w-full p-1 text-xs border rounded text-center" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">Racial</label>
                        <input type="number" data-field="abilityScores" data-subfield="${ability}.racial" value="${scores.racial || 0}" class="w-full p-1 text-xs border rounded text-center" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500">Other</label>
                        <input type="number" data-field="abilityScores" data-subfield="${ability}.other" value="${scores.other || 0}" class="w-full p-1 text-xs border rounded text-center" />
                    </div>
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
                <div class="flex items-center justify-between p-2 bg-white rounded">
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

    const renderSkillCategory = (ability, title, allSkills) => {
        const filteredSkills = allSkills.filter(([name, data]) => data.ability === ability);
        if (filteredSkills.length === 0) return '';

        return `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-700 capitalize border-b pb-1 mb-2">${title}</h4>
                <div class="space-y-2">
                    ${filteredSkills.map(([name, data]) => renderSkill(name, data)).join('')}
                </div>
            </div>
        `;
    };

    const allSkillEntries = Object.entries(character.skills);

    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Ability Scores</h2>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                    ${abilityScores.map(renderAbilityScoreRow).join('')}
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-4">
                       <div>
                           ${renderSkillCategory('str', 'Strength', allSkillEntries)}
                           ${renderSkillCategory('dex', 'Dexterity', allSkillEntries)}
                           ${renderSkillCategory('con', 'Constitution', allSkillEntries)}
                       </div>
                       <div>
                           ${renderSkillCategory('int', 'Intelligence', allSkillEntries)}
                           ${renderSkillCategory('wis', 'Wisdom', allSkillEntries)}
                           ${renderSkillCategory('cha', 'Charisma', allSkillEntries)}
                       </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Saving Throws</h2>
                        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                            <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                ${renderSavingThrows()}
                            </div>
                        </div>
                    </div>
                     <div>
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">General</h2>
                        <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                            <div class="p-2 bg-white rounded flex items-center justify-between">
                                <label class="font-medium">Proficiency Bonus:</label>
                                <input type="number" data-field="proficiencyBonus" value="${character.proficiencyBonus}" class="w-20 p-1 border rounded text-center" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// This function is no longer needed and can be safely removed.
window.attachSkillsPageHandlers = () => {};