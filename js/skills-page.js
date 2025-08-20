// js/skills-page.js
window.SkillsPage = (character) => {
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
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
            <div class="space-y-2">
                ${Object.entries(character.skills).map(([name, data]) => renderSkill(name, data)).join('')}
            </div>
        </div>
    `;
};

window.attachSkillsPageHandlers = () => {
    const skillsContainer = document.querySelector('#content-area');
    if (skillsContainer) {
        skillsContainer.addEventListener('change', (e) => {
            const skillName = e.target.dataset.skill;
            const type = e.target.dataset.type;

            if (skillName && type) {
                const character = window.stores.character.get();
                const newSkills = { ...character.skills };
                newSkills[skillName][type] = e.target.checked;
                window.stores.character.set({ skills: newSkills });
            }
        });
    }
};