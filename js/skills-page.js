// skills-page.js
window.SkillsPage = (character) => {
    const renderSkillSection = (title, skills) => {
        return `
            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-700 mb-2 border-b-2 pb-1">${title}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${skills.map(([skillName, skillData]) => {
                        const finalAbilityScore = window.getFinalAbilityScore(character, skillData.ability);
                        const abilityMod = window.getAbilityModifier(finalAbilityScore);
                        const sizeMod = (skillName === 'stealth' || skillName === 'acrobatics' || skillName === 'fly') ? window.getSizeModifier(character.size) : 0;
                        // MODIFIED: Calculate item bonus automatically
                        const itemBonus = window.stores.character.calculateItemBonusesForSkill(skillName);
                        const totalBonus = skillData.ranks + abilityMod + sizeMod + (skillData.racial || 0) + (skillData.feat || 0) + itemBonus + (skillData.status || 0) + (skillData.misc || 0);
                        const displayName = skillName.replace(/([A-Z])/g, ' $1').trim().replace(/knowledge/g, 'Knowledge (');
                        const displayNameFinal = displayName.includes('Knowledge') ? displayName + ')' : displayName;
    
                        return `
                            <div key="${skillName}" class="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div class="flex items-center space-x-4 mb-2">
                                    <div class="flex-1">
                                        <span class="capitalize text-lg font-medium text-gray-700">${displayNameFinal}</span>
                                        <span class="text-sm text-gray-500 ml-2">(${skillData.ability.toUpperCase()})</span>
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
                                        <input type="number" value="${itemBonus}" class="w-16 p-1 text-center bg-gray-200 border rounded-md" readonly />
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

window.attachSkillsPageHandlers = () => {
    const skillsContainer = document.querySelector('#content-area');
    if (skillsContainer) {
        skillsContainer.addEventListener('input', (e) => {
            const skillName = e.target.dataset.skill;
            const field = e.target.dataset.field;
            const value = parseInt(e.target.value, 10) || 0;

            if (skillName && field) {
                const character = window.stores.character.get();
                const newCharacter = { ...character };
                newCharacter.skills[skillName][field] = value;
                window.stores.character.set(newCharacter);
            }
        });
    }
};