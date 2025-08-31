// js/helpers.js

DndSheet.helpers = {
    /**
     * Calculates the ability score modifier for a given score.
     * @param {number} score - The ability score (e.g., 16).
     * @returns {number} The modifier (e.g., +3).
     */
    getAbilityModifier: function(score) {
        return Math.floor((score - 10) / 2);
    },

    /**
     * Gets the final ability score, accounting for future bonuses.
     * @param {object} character - The character data object.
     * @param {string} ability - The key for the ability score (e.g., 'str').
     * @returns {number} The final score.
     */
    getFinalAbilityScore: function(character, ability) {
        // This can be expanded later to include racial bonuses, feats, etc.
        return character.abilityScores[ability]?.value || 10;
    },

    /**
     * A simplified AC calculation.
     * @param {object} character - The character data object.
     * @returns {number} The calculated Armor Class.
     */
    calculateTotalAC: function(character) {
        let baseAC = 10;
        const dexMod = this.getAbilityModifier(this.getFinalAbilityScore(character, 'dex'));
        const equippedItems = Object.values(character.inventory.items || {}).filter(i => i.equipped);
        const armor = equippedItems.find(i => i.itemType === 'armor');
        const shield = equippedItems.find(i => i.itemType === 'shield');
        let shieldBonus = shield ? (shield.acBonus || 2) : 0;

        if (armor) {
            baseAC = armor.baseAC || 10;
            if (armor.addDexMod) {
                const maxDex = armor.maxDexBonus !== undefined ? armor.maxDexBonus : 99;
                return baseAC + Math.min(dexMod, maxDex) + shieldBonus;
            }
            return baseAC + shieldBonus;
        }

        // Example for Barbarian Unarmored Defense
        const hasBarbarianUnarmoredDefense = (character.classes || []).some(c => c.name === 'Barbarian');
        if (hasBarbarianUnarmoredDefense) {
            const conMod = this.getAbilityModifier(this.getFinalAbilityScore(character, 'con'));
            return 10 + dexMod + conMod + shieldBonus;
        }

        return 10 + dexMod + shieldBonus;
    },

    /**
     * Displays a temporary message on the screen.
     * @param {string} message - The text to display.
     * @param {string} color - The color theme (e.g., 'green', 'red').
     */
    showMessage: function(message, color = 'blue') {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box bg-${color}-500`;
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        setTimeout(() => { messageBox.classList.add('show'); }, 10);

        setTimeout(() => {
            messageBox.classList.remove('show');
            setTimeout(() => { document.body.removeChild(messageBox); }, 500);
        }, 3000);
    },

    /**
     * Gets the initial character state, trying to load from localStorage first.
     * @returns {object} The character data object.
     */
    getInitialState: function() {
        try {
            const savedData = localStorage.getItem('pathfinderCharacterSheet');
            if (savedData) {
                return JSON.parse(savedData);
            }
        } catch (e) {
            console.error("Failed to load character from localStorage", e);
        }
        return DndSheet.stores.defaultCharacter;
    }
};