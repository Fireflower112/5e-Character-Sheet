// js/abilities-editor-page.js

window.AbilitiesEditorPage = (character) => {
    // Data for bonus forms
    const skillList = [ "Acrobatics", "Appraise", "Bluff", "Climb", "Diplomacy", "Disable Device", "Disguise", "Escape Artist", "Fly", "Handle Animal", "Heal", "Intimidate", "Knowledge (Arcana)", "Knowledge (Dungeoneering)", "Knowledge (Engineering)", "Knowledge (Geography)", "Knowledge (History)", "Knowledge (Local)", "Knowledge (Nature)", "Knowledge (Nobility)", "Knowledge (Planes)", "Knowledge (Religion)", "Linguistics", "Perception", "Perform", "Profession", "Ride", "Sense Motive", "Sleight of Hand", "Spellcraft", "Stealth", "Survival", "Swim", "Use Magic Device" ].map(name => ({ key: name.toLowerCase().replace(' (', '').replace(')', '').replace(/ /g, '-').replace(/-(\w)/g, (match, letter) => letter.toUpperCase()).replace(/Knowledge(\w)/, (_, c) => `knowledge${c.toUpperCase()}`), label: name }));
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

    // --- NEW: Helper function to render a section of abilities ---
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

    // --- NEW: Filter abilities by type ---
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
                            <div id="ability-bonus-category-selector" class="flex flex-wrap gap-2">
                                <button type="button" data-bonus-category="ability" class="bonus-cat-btn px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">Ability Score</button>
                                <button type="button" data-bonus-category="skill" class="bonus-cat-btn px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">Skill</button>
                            </div>
                            <div id="ability-bonus-details-area" class="hidden items-center gap-4">
                                <div id="ability-details-ability-selector" class="hidden flex-grow">
                                    <label for="ability-bonus-type-select" class="block text-sm font-medium">Ability</label>
                                    <select id="ability-bonus-type-select" class="w-full p-2 border rounded-md">${abilityScores.map(score => `<option value="${score}">${score.toUpperCase()}</option>`).join('')}</select>
                                </div>
                                <div id="ability-details-skill-selector" class="hidden flex-grow">
                                    <label for="ability-skill-bonus-type" class="block text-sm font-medium">Skill</label>
                                    <select id="ability-skill-bonus-type" class="w-full p-2 border rounded-md">${skillList.map(skill => `<option value="${skill.key}">${skill.label}</option>`).join('')}</select>
                                </div>
                                <div class="flex items-end space-x-2">
                                    <div class="flex items-center space-x-2 pr-2">
                                        <input type="radio" id="ability-bonus-type-enhance" name="ability-bonus-type" value="enhancement" checked><label for="ability-bonus-type-enhance" class="text-sm">Augment (+)</label>
                                        <input type="radio" id="ability-bonus-type-override" name="ability-bonus-type" value="override"><label for="ability-bonus-type-override" class="text-sm">Set (=)</label>
                                    </div>
                                    <div class="flex-grow">
                                        <label for="ability-bonus-value" class="block text-sm font-medium">Value</label>
                                        <input type="number" id="ability-bonus-value" placeholder="+1" class="w-24 p-2 border rounded-md">
                                    </div>
                                    <button type="button" id="add-ability-bonus-btn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 h-10">Add</button>
                                </div>
                            </div>
                            <ul id="ability-bonuses-list" class="flex flex-wrap gap-2 pt-2"></ul>
                        </div>
                        
                        <button type="button" id="add-ability-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Ability</button>
                    </form>
                </div>
            </div>
        </div>`;
};

window.attachAbilitiesEditorHandlers = () => {
    const addAbilityForm = document.getElementById('add-ability-form');
    if (!addAbilityForm) return;

    let abilityBonuses = [];
    const addAbilityBtn = document.getElementById('add-ability-btn');
    const bonusesList = document.getElementById('ability-bonuses-list');
    
    // --- NEW: Logic for the inventory-style bonus UI ---
    const bonusCategorySelector = document.getElementById('ability-bonus-category-selector');
    const bonusDetailsArea = document.getElementById('ability-bonus-details-area');
    const abilitySelector = document.getElementById('ability-details-ability-selector');
    const skillSelector = document.getElementById('ability-details-skill-selector');
    const addBonusBtn = document.getElementById('add-ability-bonus-btn');
    let activeBonusCategory = null;

    bonusCategorySelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('bonus-cat-btn')) {
            const category = e.target.dataset.bonusCategory;
            activeBonusCategory = category;
            bonusCategorySelector.querySelectorAll('.bonus-cat-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            e.target.classList.add('bg-indigo-600', 'text-white');
            e.target.classList.remove('bg-gray-200', 'text-gray-700');
            
            bonusDetailsArea.classList.remove('hidden');
            bonusDetailsArea.classList.add('flex');
            abilitySelector.classList.add('hidden');
            skillSelector.classList.add('hidden');
            
            if (category === 'ability') {
                abilitySelector.classList.remove('hidden');
            } else if (category === 'skill') {
                skillSelector.classList.remove('hidden');
            }
        }
    });

    addBonusBtn.onclick = () => {
        const bonusValueInput = document.getElementById('ability-bonus-value');
        const value = parseInt(bonusValueInput.value, 10);
        const type = document.querySelector('input[name="ability-bonus-type"]:checked').value;
        let field = null;
        let fieldLabel = '';

        if (activeBonusCategory === 'ability') {
            const selector = document.getElementById('ability-bonus-type-select');
            field = selector.value;
            fieldLabel = selector.options[selector.selectedIndex].text;
        } else if (activeBonusCategory === 'skill') {
            const selector = document.getElementById('ability-skill-bonus-type');
            field = selector.value;
            fieldLabel = selector.options[selector.selectedIndex].text;
        }

        if (field && !isNaN(value)) {
            abilityBonuses.push({ field, value, type });
            const symbol = type === 'override' ? '=' : (value > 0 ? '+' : '');
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
            type: document.getElementById('ability-type').value, // Get the ability type
            description: document.getElementById('ability-description').value,
            bonuses: [...abilityBonuses],
        };

        if (newAbilityData.name) {
            window.stores.character.addAbility(newAbilityData);
            window.showMessage('Ability added successfully!', 'green');
            addAbilityForm.reset();
            bonusesList.innerHTML = '';
            abilityBonuses = [];

            // Reset bonus UI
            bonusDetailsArea.classList.add('hidden');
            bonusDetailsArea.classList.remove('flex');
            bonusCategorySelector.querySelectorAll('.bonus-cat-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            activeBonusCategory = null;

        } else {
            window.showMessage('Please enter an ability name.', 'red');
        }
    };
};