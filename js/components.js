// js/components.js

window.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

window.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    // MODIFIED: An item's bonuses apply if it has an equippedSlot OR if it is attuned
    const activeItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot || item.attuned);
    
    const overrideBonuses = activeItems
        .flatMap(item => item.bonuses || [])
        .filter(bonus => bonus.field === ability && bonus.type === 'override');

    if (overrideBonuses.length > 0) {
        return Math.max(...overrideBonuses.map(b => b.value));
    }

    const enhancementBonuses = activeItems
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
    let totalAC = 10 + dexMod; // Start with base AC

    if (equippedArmor) {
        switch (equippedArmor.armorType) {
            case 'light': totalAC = equippedArmor.acBase + dexMod; break;
            case 'medium': totalAC = equippedArmor.acBase + Math.min(dexMod, 2); break;
            case 'heavy': totalAC = equippedArmor.acBase; break;
        }
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