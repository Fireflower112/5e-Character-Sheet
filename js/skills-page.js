// js/skills-page.js
window.SkillsPage = (character) => {
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderSkill = (skillName, skillData) => {
        const totalBonus = window.calculateSkillBonus(character, skillName, skillData);
        const formatName = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        return `
            <div class="bg-gray-50 p-2 rounded-md flex items-center justify-between">
                <span class="font-medium text-gray-800 text-sm">${formatName(skillName)}</span>
                <div class="flex items-center space-x-3">
                    <span class="font-bold text-lg w-8 text-center">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                    <input type="checkbox" title="Proficient" id="prof-${skillName}" data-skill="${skillName}" data-type="proficient" ${skillData.proficient ? 'checked' : ''} class="h-4 w-4 rounded text-indigo-600"/>
                    <input type="checkbox" title="Expertise" id="exp-${skillName}" data-skill="${skillName}" data-type="expertise" ${skillData.expertise ? 'checked' : ''} class="h-4 w-4 rounded text-indigo-600"/>
                </div>
            </div>
        `;
    };

    const renderAbilityCard = (ability, allSkills) => {
        const scores = character.abilityScores[ability];
        const finalScore = window.getFinalAbilityScore(character, ability);
        const modifier = window.getAbilityModifier(finalScore);
        const relevantSkills = allSkills.filter(([name, data]) => data.ability === ability);

        return `
            <div class="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <div class="text-center">
                    <div class="font-bold text-2xl uppercase">${ability}</div>
                    <div class="font-extrabold text-5xl text-indigo-600">${modifier >= 0 ? '+' : ''}${modifier}</div>
                    <div class="text-lg font-semibold">Score: ${finalScore}</div>
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

                ${relevantSkills.length > 0 ? `
                    <div class="border-t pt-3">
                        <div class="flex justify-between items-center mb-2">
                           <h4 class="font-semibold text-center w-full">Skills</h4>
                           <div class="flex items-center space-x-1 text-xs">
                                <span title="Proficient">P</span>
                                <span title="Expertise">E</span>
                           </div>
                        </div>
                        <div class="space-y-1">
                            ${relevantSkills.map(([name, data]) => renderSkill(name, data)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    };
    
    const renderSavingThrow = (ability) => {
        const modifier = window.getAbilityModifier(window.getFinalAbilityScore(character, ability));
        const isProficient = character.savingThrows[ability]?.proficient || false;
        const totalBonus = modifier + (isProficient ? character.proficiencyBonus : 0);

        return `
             <div class="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="save-prof-${ability}" data-save="${ability}" ${isProficient ? 'checked' : ''} class="h-5 w-5 rounded text-indigo-600"/>
                    <label for="save-prof-${ability}" class="font-medium capitalize">${ability}</label>
                </div>
                <span class="font-bold text-xl">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
            </div>
        `;
    };

    const allSkillEntries = Object.entries(character.skills);

    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-2 border-b pb-2">General</h2>
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                    <div class="flex items-center justify-between">
                        <label class="font-medium">Proficiency Bonus:</label>
                        <input type="number" data-field="proficiencyBonus" value="${character.proficiencyBonus}" class="w-20 p-1 border rounded text-center" />
                    </div>
                </div>
            </div>
            
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Saving Throws</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    ${abilityScores.map(ability => renderSavingThrow(ability)).join('')}
                </div>
            </div>
            
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Abilities & Skills</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${abilityScores.map(ability => renderAbilityCard(ability, allSkillEntries)).join('')}
                </div>
            </div>
        </div>
    `;
};