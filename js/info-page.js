// js/info-page.js
window.InfoPage = (character) => {
    const pathfinderSizes = ['Fine', 'Diminutive', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal'];
    const pathfinderAlignments = [ 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil' ];
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    const renderAbilityScoreRow = (ability) => {
        const scores = character.abilityScores[ability];
        
        const itemBonus = window.stores.character.calculateItemBonusesForAbility(ability);
        const abilityBonus = window.stores.character.calculateAbilityBonusesForAbility(ability);
        const totalRacialBonus = (scores.racial || 0) + abilityBonus;
        
        return `
            <div class="grid grid-cols-7 gap-2 items-center">
                <span class="font-medium text-left col-span-1">${ability.toUpperCase()}:</span>
                <input type="number" data-field="abilityScores" data-subfield="${ability}.base" value="${scores.base}" class="p-1 border rounded text-center" />
                
                <input type="number" value="${totalRacialBonus}" class="p-1 border rounded bg-gray-200 text-center" readonly title="Base Racial: ${scores.racial} + Ability Bonuses: ${abilityBonus}" />
                
                <input type="number" data-field="abilityScores" data-subfield="${ability}.feat" value="${scores.feat || 0}" class="p-1 border rounded text-center" />
                <input type="number" value="${itemBonus}" class="p-1 border rounded bg-gray-200 text-center" readonly />
                <input type="number" data-field="abilityScores" data-subfield="${ability}.status" value="${scores.status}" class="p-1 border rounded text-center" />
                <input type="number" data-field="abilityScores" data-subfield="${ability}.override" value="${scores.override}" class="p-1 border rounded text-center" />
            </div>
        `;
    };
    
    const renderAcComponents = () => {
        const ac = character.armorClassComponents;
        const { armorBonus, shieldBonus } = window.stores.character.calculateACBonuses();
        const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
        const sizeMod = window.getSizeModifier(character.size);

        return `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-gray-50 p-4 rounded-lg">
                <div class="flex flex-col items-center"><label class="font-medium">Base AC</label><input type="number" value="10" class="w-20 p-1 text-center bg-gray-200 border rounded-md" readonly></div>
                <div class="flex flex-col items-center"><label class="font-medium">Dex Mod</label><input type="number" value="${dexMod}" class="w-20 p-1 text-center bg-gray-200 border rounded-md" readonly></div>
                <div class="flex flex-col items-center"><label class="font-medium">Armor Bonus</label><input type="number" value="${armorBonus}" class="w-20 p-1 text-center bg-gray-200 border rounded-md" readonly></div>
                <div class="flex flex-col items-center"><label class="font-medium">Shield Bonus</label><input type="number" value="${shieldBonus}" class="w-20 p-1 text-center bg-gray-200 border rounded-md" readonly></div>
                <div class="flex flex-col items-center"><label class="font-medium">Natural Armor</label><input type="number" data-field="armorClassComponents" data-subfield="naturalArmor" value="${ac.naturalArmor}" class="w-20 p-1 text-center border rounded-md"></div>
                <div class="flex flex-col items-center"><label class="font-medium">Dodge Bonus</label><input type="number" data-field="armorClassComponents" data-subfield="dodge" value="${ac.dodge || 0}" class="w-20 p-1 text-center border rounded-md"></div>
                <div class="flex flex-col items-center"><label class="font-medium">Deflection Bonus</label><input type="number" data-field="armorClassComponents" data-subfield="deflection" value="${ac.deflection}" class="w-20 p-1 text-center border rounded-md"></div>
                <div class="flex flex-col items-center"><label class="font-medium">Size Modifier</label><input type="number" value="${sizeMod}" class="w-20 p-1 text-center bg-gray-200 border rounded-md" readonly></div>
                <div class="flex flex-col items-center col-span-full"><label class="font-medium">Temporary Override</label><input type="number" data-field="armorClassComponents" data-subfield="override" value="${ac.override || 0}" class="w-20 p-1 text-center border rounded-md"></div>
            </div>
        `;
    };

    const renderSpeedInputs = (speed) => {
        const speedTypes = ['land', 'fly', 'swim', 'climb', 'burrow'];
        return speedTypes.map(type => `
            <div class="flex items-center space-x-2">
                <label for="speed-${type}" class="w-20 text-lg font-medium text-gray-700 capitalize">${type}:</label>
                <input
                    type="number"
                    id="speed-${type}"
                    value="${speed[type] || 0}"
                    data-field="speed"
                    data-subfield="${type}"
                    class="w-24 p-2 text-lg bg-gray-50 border border-gray-300 rounded-md"
                />
            </div>
        `).join('');
    };

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Character Information</h2>
            <div class="flex flex-col space-y-6">
                <div class="flex items-center space-x-2"><label for="charName" class="text-lg font-medium text-gray-700">Name:</label><input id="charName" value="${character.name}" data-field="name" class="flex-1 p-2 text-lg bg-gray-50 border rounded-md"/></div>
                <div class="flex items-center space-x-2"><label for="race" class="text-lg font-medium text-gray-700">Race:</label><input id="race" value="${character.race}" data-field="race" class="flex-1 p-2 text-lg bg-gray-50 border rounded-md"/></div>
                <div class="flex items-center space-x-2"><label for="alignment" class="text-lg font-medium text-gray-700">Alignment:</label><select id="alignment" data-field="alignment" class="flex-1 p-2 text-lg bg-gray-50 border rounded-md">${pathfinderAlignments.map(a => `<option value="${a}" ${character.alignment === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
                <div class="flex items-center space-x-2"><label for="size" class="text-lg font-medium text-gray-700">Size:</label><select id="size" data-field="size" class="flex-1 p-2 text-lg bg-gray-50 border rounded-md">${pathfinderSizes.map(s => `<option value="${s}" ${character.size === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Ability Scores</h3>
                <div class="space-y-2 text-sm">
                    <div class="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-600 text-center"><div class="text-left"></div><div>Base</div><div>Racial</div><div>Feat</div><div>Item</div><div>Status</div><div>Override</div></div>
                    ${abilityScores.map(renderAbilityScoreRow).join('')}
                </div>
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Armor Class</h3>
                ${renderAcComponents()}

                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Speed</h3>
                <div class="grid grid-cols-2 gap-4">
                    ${renderSpeedInputs(character.speed)}
                </div>
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Class & Level</h3>
                <div class="flex space-x-4">
                    <div class="flex-1 flex flex-col space-y-2"><label for="class1" class="font-medium text-gray-700">Class 1:</label><input id="class1" value="${character.class1}" data-field="class1" class="p-2 border rounded-md"/><label for="level1" class="font-medium text-gray-700">Level 1:</label><input type="number" id="level1" value="${character.level1}" data-field="level1" class="p-2 border rounded-md"/></div>
                    <div class="flex-1 flex flex-col space-y-2"><label for="class2" class="font-medium text-gray-700">Class 2:</label><input id="class2" value="${character.class2 || ''}" data-field="class2" class="p-2 border rounded-md"/><label for="level2" class="font-medium text-gray-700">Level 2:</label><input type="number" id="level2" value="${character.level2 || 0}" data-field="level2" class="p-2 border rounded-md"/></div>
                </div>
                
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-1">Spellcasting</h3>
                <div class="flex items-center space-x-2"><label for="spellResistance" class="text-lg font-medium text-gray-700">Spell Resistance:</label><input type="number" id="spellResistance" value="${character.spellcasting?.spellResistance || 0}" data-field="spellcasting" data-subfield="spellResistance" class="w-24 p-2 text-lg bg-gray-50 border rounded-md"/></div>
            
                <div class="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-2 text-center">Experience</h3>
                    <div class="flex justify-center items-center space-x-4">
                        <div class="flex items-center space-x-2"><label for="expCurrent" class="font-medium">Current:</label><input type="number" id="expCurrent" value="${character.experience.current}" data-field="experience" data-subfield="current" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                        <div class="flex items-center space-x-2"><label for="expToNext" class="font-medium">To Next:</label><input type="number" id="expToNext" value="${character.experience.toNext}" data-field="experience" data-subfield="toNext" class="w-24 p-1 text-center bg-white border rounded-md"/></div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.attachInfoPageHandlers = () => {
    const infoContainer = document.querySelector('#content-area');
    if (infoContainer) {
        infoContainer.addEventListener('input', (e) => {
            if (e.target.tagName !== 'INPUT') return;
            const field = e.target.dataset.field;
            const subField = e.target.dataset.subfield;
            if (field) {
                window.stores.character.updateCharacterProperty(field, e.target.value, subField);
            }
        });
         infoContainer.addEventListener('change', (e) => {
            if (e.target.tagName !== 'SELECT') return;
            const field = e.target.dataset.field;
            if (field) {
                window.updateCharacterInfo(field, e.target.value);
            }
        });
    }
};