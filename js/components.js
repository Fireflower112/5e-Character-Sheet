// js/components.js

window.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

window.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    const equippedItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot);
    
    // Check for override bonuses from equipped items (e.g., Gauntlets of Ogre Power)
    const overrideBonuses = equippedItems
        .flatMap(item => item.bonuses || [])
        .filter(bonus => bonus.field === ability && bonus.type === 'override');

    if (overrideBonuses.length > 0) {
        // If there are overrides, return the highest one
        return Math.max(...overrideBonuses.map(b => b.value));
    }

    // If no overrides, calculate the total from enhancements
    const enhancementBonuses = equippedItems
        .flatMap(item => item.bonuses || [])
        .filter(bonus => bonus.field === ability && bonus.type === 'enhancement')
        .reduce((sum, bonus) => sum + bonus.value, 0);

    return (scores.base || 0) + (scores.racial || 0) + (scores.other || 0) + enhancementBonuses;
};

window.calculateTotalAC = (character) => {
    const equippedItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot);
    const equippedArmor = equippedItems.find(item => item.itemType === 'armor');
    const equippedShield = equippedItems.find(item => item.itemType === 'shield');
    const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
    let totalAC = 0;

    if (equippedArmor) {
        switch (equippedArmor.armorType) {
            case 'light': totalAC = equippedArmor.acBase + dexMod; break;
            case 'medium': totalAC = equippedArmor.acBase + Math.min(dexMod, 2); break;
            case 'heavy': totalAC = equippedArmor.acBase; break;
            default: totalAC = 10 + dexMod; break;
        }
    } else {
        totalAC = 10 + dexMod;
    }

    if (equippedShield) {
        totalAC += equippedShield.acBonus || 0;
    }
    
    // Add bonuses from any other equipped items
    const acBonuses = equippedItems
        .flatMap(item => item.bonuses || [])
        .filter(bonus => bonus.field === 'ac')
        .reduce((sum, bonus) => sum + bonus.value, 0);

    return totalAC + acBonuses;
};

window.calculateSkillBonus = (character, skillName, skillData) => {
    const abilityMod = window.getAbilityModifier(window.getFinalAbilityScore(character, skillData.ability));
    const proficiencyBonus = character.proficiencyBonus || 0;
    
    let totalBonus = abilityMod;
    if (skillData.proficient) totalBonus += proficiencyBonus;
    if (skillData.expertise) totalBonus += proficiencyBonus;

    // Add bonuses from any equipped items
    const skillBonuses = Object.values(character.inventory.items || {})
        .filter(item => item.equippedSlot)
        .flatMap(item => item.bonuses || [])
        .filter(bonus => bonus.field === skillName)
        .reduce((sum, bonus) => sum + bonus.value, 0);
    
    return totalBonus + skillBonuses;
};