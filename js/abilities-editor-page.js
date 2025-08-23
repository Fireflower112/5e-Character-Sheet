// js/abilities-editor-page.js

DndSheet.pages.AbilitiesEditorPage = (character) => {
    const skillList = [
        "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", 
        "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
        "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
    ].map(name => ({ 
        key: name.toLowerCase().replace(/ /g, ''), 
        label: name 
    }));
    const skillLabelMap = new Map(skillList.map(skill => [skill.key, skill.label]));
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityCard = (ability) => {
        const bonusesHtml = (ability.bonuses && ability.bonuses.length > 0) 
            ? `<div class="mt-2 pt-2 border-t flex flex-wrap gap-2">${ability.bonuses.map(bonus => { 
                  const label = skillLabelMap.get(bonus.field) || bonus.field.toUpperCase(); 
                  const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : ''); 
                  return `<span class="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">${label}: ${symbol}${bonus.value}</span>`; 
              }).join('')}</div>` 
            : '';

        return `
            <div id="ability-card-${ability.id}" class="bg-white p-4 rounded-lg shadow-sm">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex-grow">
                        <h4 class="font-semibold text-lg">${ability.name}</h4>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button data-action="delete-ability" data-ability-id="${ability.id}" class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Delete</button>
                    </div>
                </div>
                ${ability.description ? `<p class="text-gray-600 text-sm mt-2">${ability.description}</p>` : ''}
                ${bonusesHtml}
            </div>`;
    };

    const renderAbilitySection = (title, abilities) => {
        if (abilities.length === 0) return '';
        return `
            <div class="bg-gray-50 p-4 rounded-xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">${title}</h3>
                <div class="space-y-3">
                    ${abilities.map(renderAbilityCard).join('')}
                </div>
            </div>`;
    };

    const allAbilities = Object.values(character.abilities || {});
    const racialAbilities = allAbilities.filter(a => a.type === 'Racial');
    const classAbilities = allAbilities.filter(a => a.type === 'Class');
    const otherAbilities = allAbilities.filter(a => !['Racial', 'Class'].includes(a.type));

    return `
        <div>
            <div class="space-y-4">
                ${renderAbilitySection('Racial Abilities', racialAbilities)}
                ${renderAbilitySection('Class Abilities', classAbilities)}
                ${renderAbilitySection('Other Abilities', otherAbilities)}

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add New Ability</h3>
                    <form id="add-ability-form" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                           <div><label for="ability-name" class="block text-sm font-medium">Ability Name</label><input type="text" id="ability-name" required class="w-full p-2 border rounded-md"></div>
                           <div>
                                <label for="ability-type" class="block text-sm font-medium">Ability Type</label>
                                <select id="ability-type" class="w-full p-2 border rounded-md">
                                    <option value="Racial">Racial</option>
                                    <option value="Class">Class</option>
                                    <option value="Other">Other</option>
                                </select>
                           </div>
                        </div>
                        <textarea id="ability-description" placeholder="Ability Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                        
                        <div id="bonuses-container" class="space-y-3 border-t pt-4">
                            <h4 class="font-medium text-gray-700">Bonuses (Optional):</h4>
                            <div class="flex items-end gap-2 text-sm">
                                <select id="add-ability-bonus-field" class="p-1 border rounded flex-grow">
                                    <optgroup label="Ability Scores">
                                        ${abilityScores.map(score => `<option value="${score}">${score.toUpperCase()}</option>`).join('')}
                                    </optgroup>
                                    <optgroup label="Skills">
                                        ${skillList.map(skill => `<option value="${skill.key}">${skill.label}</option>`).join('')}
                                    </optgroup>
                                </select>
                                <div>
                                    <label class="block font-medium">Value</label>
                                    <input type="number" id="add-ability-bonus-value" class="w-20 p-1 border rounded" placeholder="+1">
                                </div>
                                <button type="button" id="add-ability-bonus-btn" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
                            </div>
                            <ul id="ability-bonuses-list" class="flex flex-wrap gap-2 pt-2"></ul>
                        </div>
                        
                        <button type="button" id="add-ability-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Ability</button>
                    </form>
                </div>
            </div>
        </div>`;
};

DndSheet.pages.attachAbilitiesEditorHandlers = () => {
    const addAbilityForm = document.getElementById('add-ability-form');
    if (!addAbilityForm) return;

    let abilityBonuses = [];
    const addAbilityBtn = document.getElementById('add-ability-btn');
    const bonusesList = document.getElementById('ability-bonuses-list');
    const addBonusBtn = document.getElementById('add-ability-bonus-btn');

    addBonusBtn.onclick = () => {
        const bonusValueInput = document.getElementById('add-ability-bonus-value');
        const value = parseInt(bonusValueInput.value, 10);
        const fieldSelect = document.getElementById('add-ability-bonus-field');
        const field = fieldSelect.value;
        const fieldLabel = fieldSelect.options[fieldSelect.selectedIndex].text;
        const type = 'enhancement';

        if (field && !isNaN(value)) {
            abilityBonuses.push({ field, value, type });
            const symbol = value > 0 ? '+' : '';
            const listItem = document.createElement('li');
            listItem.textContent = `${fieldLabel}: ${symbol}${value}`;
            listItem.className = 'inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded-full';
            bonusesList.appendChild(listItem);
            bonusValueInput.value = '';
        }
    };

    addAbilityBtn.onclick = () => {
        const newAbilityData = {
            name: document.getElementById('ability-name').value,
            type: document.getElementById('ability-type').value,
            description: document.getElementById('ability-description').value,
            bonuses: [...abilityBonuses],
        };

        if (newAbilityData.name) {
            DndSheet.stores.character.addAbility(newAbilityData);
            DndSheet.helpers.showMessage('Ability added successfully!', 'green');
            addAbilityForm.reset();
            bonusesList.innerHTML = '';
            abilityBonuses = [];
        } else {
            DndSheet.helpers.showMessage('Please enter an ability name.', 'red');
        }
    };
};