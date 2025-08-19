// components.js
window.getAbilityModifier = (score) => Math.floor((score - 10) / 2);

window.getFinalAbilityScore = (character, ability) => {
    const scores = character.abilityScores[ability];
    const equippedItemBonus = window.stores.character.calculateItemBonusesForAbility(ability);
    if (scores.override > 0) {
        return scores.override;
    }
    return (scores.base || 0) + (scores.racial || 0) + (scores.feat || 0) + (equippedItemBonus || 0) + (scores.status || 0);
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
