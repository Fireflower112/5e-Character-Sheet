// js/dashboard-skills.js
DndSheet.pages.DashboardSkillsPage = (character) => {
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityScoreCard = (ability) => {
        const finalScore = DndSheet.helpers.getFinalAbilityScore(character, ability);
        const modifier = DndSheet.helpers.getAbilityModifier(finalScore);

        return `
            <div class="bg-white p-4 rounded-lg shadow-sm text-center">
                <div class="font-bold text-2xl uppercase">${ability}</div>
                <div class="font-extrabold text-5xl text-indigo-600 my-2">${modifier >= 0 ? '+' : ''}${modifier}</div>
                <div class="text-lg font-semibold">Score: ${finalScore}</div>
            </div>
        `;
    };
    
    const renderSavingThrowCard = (ability) => {
        const modifier = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, ability));
        const isProficient = character.savingThrows[ability]?.proficient || false;
        const totalBonus = modifier + (isProficient ? character.proficiencyBonus : 0);
        const proficiencyColor = isProficient ? 'text-green-600' : 'text-gray-800';

        return `
            <div class="bg-white p-3 rounded-lg shadow-sm text-center">
                <div class="font-medium capitalize mb-1">${ability}</div>
                <div class="font-bold text-3xl ${proficiencyColor}">${totalBonus >= 0 ? '+' : ''}${totalBonus}</div>
            </div>
        `;
    };

    const renderSkillColumn = (ability, title, allSkills) => {
        const filteredSkills = allSkills.filter(([name, data]) => data.ability === ability);

        return `
            <div>
                <h4 class="font-semibold text-gray-800 capitalize border-b pb-1 mb-2">${title}</h4>
                ${filteredSkills.length > 0 ? `
                    <div class="space-y-1 mt-2">
                        ${filteredSkills.map(([skillName, skillData]) => {
                            const totalBonus = DndSheet.helpers.calculateSkillBonus(character, skillName, skillData);
                            const formatName = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return `
                                <div class="flex justify-between items-baseline py-1">
                                    <span class="font-medium text-gray-700 text-sm">${formatName(skillName)}</span>
                                    <span class="font-bold text-lg text-indigo-600">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                                </div>`;
                        }).join('')}
                    </div>
                ` : '<p class="text-xs text-gray-400 italic mt-2">No Skills</p>'}
            </div>
        `;
    };

    const skillEntries = Object.entries(character.skills || {});

    return `
        <div class="space-y-6">
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Ability Scores</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${abilityScores.map(ability => renderAbilityScoreCard(ability)).join('')}
                </div>
            </div>
            
            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Saving Throws</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${abilityScores.map(ability => renderSavingThrowCard(ability)).join('')}
                </div>
            </div>

            <div>
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
                <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
                        ${renderSkillColumn('str', 'Strength', skillEntries)}
                        ${renderSkillColumn('dex', 'Dexterity', skillEntries)}
                        ${renderSkillColumn('con', 'Constitution', skillEntries)}
                        ${renderSkillColumn('int', 'Intelligence', skillEntries)}
                        ${renderSkillColumn('wis', 'Wisdom', skillEntries)}
                        ${renderSkillColumn('cha', 'Charisma', skillEntries)}
                    </div>
                </div>
            </div>
        </div>
    `;
};