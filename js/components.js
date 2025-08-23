// js/components.js

DndSheet.helpers.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

DndSheet.helpers.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    const activeItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot || item.attuned === true);
    const eligibleBonuses = activeItems.flatMap(item => 
        (!item.requiresAttunement || item.attuned) ? (item.bonuses || []) : []
    );
     const overrideBonuses = eligibleBonuses.filter(bonus => bonus.field === ability && bonus.type === 'override');

    if (overrideBonuses.length > 0) {
        return Math.max(...overrideBonuses.map(b => b.value));
    }

    const enhancementBonuses = eligibleBonuses
        .filter(bonus => bonus.field === ability && bonus.type === 'enhancement')
        .reduce((sum, bonus) => sum + bonus.value, 0);

    return (scores.base || 0) + (scores.racial || 0) + (scores.other || 0) + enhancementBonuses;
};

DndSheet.helpers.calculateTotalAC = (character) => {
    const activeItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot || item.attuned === true);
    const equippedArmor = activeItems.find(item => item.itemType === 'armor' && item.equippedSlot === 'Armor');
    const equippedShield = activeItems.find(item => item.itemType === 'shield' && item.equippedSlot === 'Shield');
    const dexMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'dex'));
    let totalAC = 10 + dexMod;

    if (equippedArmor) {
        switch (equippedArmor.armorType) {
            case 'light': totalAC = equippedArmor.acBase + dexMod; break;
            case 'medium': totalAC = equippedArmor.acBase + Math.min(dexMod, 2); break;
            case 'heavy': totalAC = equippedArmor.acBase; break;
            default: totalAC = equippedArmor.acBase + dexMod; break; // Default for custom armor
        }
    }

    if (equippedShield) {
        totalAC += equippedShield.acBonus || 0;
    }
    
    const acBonuses = activeItems
        .flatMap(item => (!item.requiresAttunement || item.attuned) ? (item.bonuses || []) : [])
        .filter(bonus => bonus.field === 'ac')
        .reduce((sum, bonus) => sum + bonus.value, 0);

    return totalAC + acBonuses;
};

DndSheet.helpers.calculateSkillBonus = (character, skillName, skillData) => {
    const abilityMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, skillData.ability));
    const proficiencyBonus = character.proficiencyBonus || 0;
    
    let totalBonus = abilityMod;
    if (skillData.proficient) totalBonus += proficiencyBonus;
    if (skillData.expertise) totalBonus += proficiencyBonus;

    const skillBonuses = Object.values(character.inventory.items || {})
        .filter(item => item.equippedSlot || item.attuned === true)
        .flatMap(item => (!item.requiresAttunement || item.attuned) ? (item.bonuses || []) : [])
        .filter(bonus => bonus.field === skillName)
        .reduce((sum, bonus) => sum + bonus.value, 0);
    
    return totalBonus + skillBonuses;
};