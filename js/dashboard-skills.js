// js/dashboard-skills.js
window.DashboardSkillsPage = (character) => {
    const allSkills = Object.entries(character.skills);
    
    const regularSkills = allSkills.filter(([name]) => !name.startsWith('knowledge') && !['appraise', 'spellcraft', 'useMagicDevice', 'linguistics'].includes(name));
    const trainedOnlySkills = allSkills.filter(([name, data]) => ['appraise', 'spellcraft', 'useMagicDevice', 'linguistics'].includes(name) && data.ranks > 0);
    const knowledgeSkills = allSkills.filter(([name]) => name.startsWith('knowledge'));
    const combinedSkills = [...regularSkills, ...trainedOnlySkills];

    const renderSimpleSkillList = (skills, title) => {
        if (skills.length === 0) return '';
        return `
            <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">${title}</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    ${skills.map(([skillName, skillData]) => {
                        const totalBonus = window.calculateSkillBonus(character, skillName, skillData);
                        // --- FIX: Correctly formats Knowledge skills without extra parenthesis ---
                        const displayName = window.formatSkillName(skillName).replace(' (', ': ').replace(')', '');
                        return `
                            <div class="flex justify-between items-baseline border-b border-gray-200 py-1">
                                <span class="font-medium text-gray-700">${displayName}</span>
                                <span class="font-bold text-lg text-indigo-600">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                            </div>`;
                    }).join('')}
                </div>
            </div>`;
    };

    return `
        <div class="space-y-4">
            <div class="flex flex-col space-y-2 bg-gray-50 p-4 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-2 text-center">Ability Scores</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    ${Object.keys(character.abilityScores).map(ability => {
                        const finalScore = window.getFinalAbilityScore(character, ability);
                        const modifier = window.getAbilityModifier(finalScore);
                        return `
                            <div key="${ability}" class="flex flex-col items-center">
                                <span class="text-lg font-bold uppercase">${ability}</span>
                                <span class="text-center text-xl font-bold p-1 my-1">
                                    ${modifier >= 0 ? '+' : ''}${modifier}
                                </span>
                                <span class="text-md font-medium text-gray-600">
                                    Score: ${finalScore}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            ${renderSimpleSkillList(combinedSkills, 'General Skills')}
            ${renderSimpleSkillList(knowledgeSkills, 'Knowledge Skills')}
        </div>`;
};