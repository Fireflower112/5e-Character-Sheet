// js/stores/actions/spellActions.js
DndSheet.stores.spellActions = {
    addSpell: function(character, spellData) {
        const newSpell = { 
            ...spellData, 
            id: DndSheet.helpers.uuid(), 
            favorited: false,
        };
        character.spells[newSpell.id] = newSpell;
        return character;
    },

    addPremadeSpell: function(character, spellData) {
        const newSpell = {
            name: spellData.name,
            description: spellData.description,
            level: spellData.properties.Level,
            school: spellData.properties.School,
        };
        return this.addSpell(character, newSpell);
    },

    deleteSpell: function(character, spellId) {
        if (character.spells[spellId]) {
            delete character.spells[spellId];
        }
        return character;
    },

    toggleFavoriteSpell: function(character, spellId) {
        if (character.spells[spellId]) {
            character.spells[spellId].favorited = !character.spells[spellId].favorited;
        }
        return character;
    },

    castSpell: function(character, spellId) {
        const spell = character.spells[spellId];
        if (!spell || spell.level === 0) return character;

        if (character.spellcasting.spellSlots[spell.level]?.used < character.spellcasting.spellSlots[spell.level]?.total) {
            character.spellcasting.spellSlots[spell.level].used += 1;
        } else {
            DndSheet.helpers.showMessage(`No level ${spell.level} spell slots remaining.`, 'red');
        }
        return character;
    }
};