// js/skills-page.js
window.SkillsPage = (character) => {
    const renderSkillSection = (title, skills) => {
        return `
            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-700 mb-2 border-b-2 pb-1">${title}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${skills.map(([skillName, skillData]) => {
                        const totalBonus = window.calculateSkillBonus(character, skillName, skillData);
                        const displayNameFinal = window.formatSkillName(skillName);
    
                        const classSkillCheckbox = skillData.ranks > 0 
                            ? `<div class="flex items-center space-x-1 ml-4">
                                 <input type="checkbox" checked disabled class="h-4 w-4 rounded-full text-indigo-600 cursor-not-allowed">
                                 <label class="text-xs text-gray-600">Class Skill (+3)</label>
                               </div>`
                            : '';

                        return `
                            <div key="${skillName}" class="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div class="flex items-center space-x-4 mb-2">
                                    <div class="flex-1">
                                        <div class="flex items-center">
                                            <span class="text-lg font-medium text-gray-700">${displayNameFinal}</span>
                                            <span class="text-sm text-gray-500 ml-2">(${skillData.ability.toUpperCase()})</span>
                                            ${classSkillCheckbox}
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-lg font-bold text-gray-900">Total: ${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-5 gap-2 text-center text-sm">
                                    <div class="flex flex-col items-center">
                                        <label class="font-medium">Ranks</label>
                                        <input type="number" data-skill="${skillName}" data-field="ranks" value="${skillData.ranks}" class="w-16 p-1 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <label class="font-medium">Feats</label>
                                        <input type="number" data-skill="${skillName}" data-field="feat" value="${skillData.feat || 0}" class="w-16 p-1 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <label class="font-medium">Racial</label>
                                        <input type="number" data-skill="${skillName}" data-field="racial" value="${skillData.racial || 0}" class="w-16 p-1 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <label class="font-medium">Item</label>
                                        {/* --- UPDATED: Uses the new bonus calculation function --- */}
                                        <input type="number" value="${window.stores.character.calculateBonusesForSkill(skillName)}" class="w-16 p-1 text-center bg-gray-200 border rounded-md" readonly />
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <label class="font-medium">Misc</label>
                                        <input type="number" data-skill="${skillName}" data-field="misc" value="${skillData.misc || 0}" class="w-16 p-1 text-center bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    };

    const allSkills = Object.entries(character.skills);
    const regularSkills = allSkills.filter(([name]) => !name.startsWith('knowledge') && !['appraise', 'spellcraft', 'useMagicDevice', 'linguistics'].includes(name));
    const trainedSkills = allSkills.filter(([name]) => ['appraise', 'spellcraft', 'useMagicDevice', 'linguistics'].includes(name));
    const knowledgeSkills = allSkills.filter(([name]) => name.startsWith('knowledge'));

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
            ${renderSkillSection('Regular Skills', regularSkills)}
            ${renderSkillSection('Skills that require training', trainedSkills)}
            ${renderSkillSection('Knowledge Skills', knowledgeSkills)}
        </div>
    `;
};

// ... attachSkillsPageHandlers function is unchanged ...