// js/components.js
window.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

window.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    return (scores.base || 0) + (scores.racial || 0) + (scores.other || 0);
};

// --- UPDATED: Full D&D 5e AC Calculation ---
window.calculateTotalAC = (character) => {
    const equippedItems = Object.values(character.inventory.items || {}).filter(item => item.equippedSlot);
    const equippedArmor = equippedItems.find(item => item.itemType === 'armor');
    const equippedShield = equippedItems.find(item => item.itemType === 'shield');

    const dexMod = window.getAbilityModifier(window.getFinalAbilityScore(character, 'dex'));
    let totalAC = 0;

    if (equippedArmor) {
        switch (equippedArmor.armorType) {
            case 'light':
                totalAC = equippedArmor.acBase + dexMod;
                break;
            case 'medium':
                totalAC = equippedArmor.acBase + Math.min(dexMod, 2); // Dex bonus capped at +2
                break;
            case 'heavy':
                totalAC = equippedArmor.acBase; // No Dex bonus
                break;
            default:
                totalAC = 10 + dexMod; // Fallback for improperly typed armor
                break;
        }
    } else {
        // No armor equipped
        totalAC = 10 + dexMod;
    }

    if (equippedShield) {
        totalAC += equippedShield.acBonus || 0;
    }

    return totalAC;
};

window.calculateSkillBonus = (character, skillName, skillData) => {
    const abilityMod = window.getAbilityModifier(window.getFinalAbilityScore(character, skillData.ability));
    const proficiencyBonus = character.proficiencyBonus || 0;
    
    let totalBonus = abilityMod;
    if (skillData.proficient) {
        totalBonus += proficiencyBonus;
    }
    if (skillData.expertise) {
        totalBonus += proficiencyBonus;
    }
    
    return totalBonus;
};