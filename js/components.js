// js/components.js
window.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

window.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    
    // MODIFIED: Get processed bonuses (both enhancement and overrides)
    const { enhancement, overrides } = window.stores.character.processBonusesForAbility(ability);
    
    // Check for the highest override from items, abilities, or a manual character override
    const highestOverride = Math.max(scores.override || 0, ...overrides);
    if (highestOverride > 0) {
        return highestOverride;
    }
    
    // If no override, calculate the score by adding all components
    return (scores.base || 0) + (scores.racial || 0) + (scores.feat || 0) + (enhancement || 0) + (scores.status || 0);
};

window.getSizeModifier = (size) => {
    switch (size) {
        case 'Fine': return 8;
        case 'Diminutive': return 4;
        case 'Tiny': return 2;
        case 'Small': return 1;
        case 'Medium': return 0;
        case 'Large': return -1;
        case 'Huge': return -2;
        case 'Gargantuan': return -4;
        case 'Colossal': return -8;
        default: return 0;
    }
};

// --- NEW: Helper function to format skill names into Title Case ---
window.formatSkillName = (skillName) => {
    const spaced = skillName.replace(/([A-Z])/g, ' $1');
    const titleCased = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    
    // Handle specific cases for Pathfinder naming conventions
    if (titleCased.includes('Knowledge')) {
        return titleCased.replace(/Knowledge\s/, 'Knowledge (').trim() + ')';
    }
    if (titleCased.includes('Disable Device')) {
        return 'Disable Device';
    }
     if (titleCased.includes('Handle Animal')) {
        return 'Handle Animal';
    }
    if (titleCased.includes('Escape Artist')) {
        return 'Escape Artist';
    }
     if (titleCased.includes('Sense Motive')) {
        return 'Sense Motive';
    }
    if (titleCased.includes('Sleight Of Hand')) {
        return 'Sleight of Hand';
    }
    if (titleCased.includes('Use Magic Device')) {
        return 'Use Magic Device';
    }
    
    return titleCased;
};


window.calculateTotalAC = (character) => {
    const ac = character.armorClassComponents;
    if (ac.override > 0) {
        return ac.override;
    }
    
    const { armorBonus, shieldBonus } = window.stores.character.calculateACBonuses();
    const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
    const sizeMod = window.getSizeModifier(character.size);

    return 10 + armorBonus + shieldBonus + dexMod + sizeMod + ac.naturalArmor + ac.deflection + (ac.dodge || 0);
};

// --- MODIFIED: Central function to calculate the total bonus for a skill ---
/**
 * Calculates the total bonus for a specific skill, including bonuses from items and abilities.
 * @param {object} character - The main character object.
 * @param {string} skillName - The key name of the skill (e.g., 'acrobatics').
 * @param {object} skillData - The data object for the skill.
 * @returns {number} The final calculated bonus for the skill.
 */
window.calculateSkillBonus = (character, skillName, skillData) => {
    const finalAbilityScore = window.getFinalAbilityScore(character, skillData.ability);
    const abilityMod = window.getAbilityModifier(finalAbilityScore);
    const sizeMod = (['stealth', 'fly'].includes(skillName)) ? window.getSizeModifier(character.size) : 0;
    
    // UPDATED: Now gets bonuses from both items and abilities
    const skillBonuses = window.stores.character.calculateBonusesForSkill(skillName);
    
    // A skill gets a +3 bonus if it has at least one rank.
    const classSkillBonus = skillData.ranks > 0 ? 3 : 0;
    
    const totalBonus = skillData.ranks + abilityMod + sizeMod + (skillData.racial || 0) + (skillData.feat || 0) + skillBonuses + (skillData.status || 0) + (skillData.misc || 0) + classSkillBonus;
    return totalBonus;
};