// js/handlers/spell-handlers.js

DndSheet.handlers.spellClickHandlers = {
    'delete-spell': (target) => {
        const spellId = target.dataset.spellId;
        if (spellId && confirm('Are you sure you want to delete this spell?')) {
            DndSheet.stores.characterActions.deleteSpell(spellId);
        }
    },
    'toggle-favorite-spell': (target) => {
        const spellId = target.dataset.spellId;
        if (spellId) {
            DndSheet.stores.characterActions.toggleFavoriteSpell(spellId);
        }
    },
    'cast-spell': (target) => {
        const spellId = target.dataset.spellId;
        if (spellId) {
            DndSheet.stores.characterActions.castSpell(spellId);
        }
    },
    'long-rest': () => {
        DndSheet.stores.characterActions.longRest();
    }
};

DndSheet.handlers.spellChangeHandlers = {
    // MODIFIED: This is the old handler, renamed for clarity
    'update-used-slots': (target) => {
        const level = target.dataset.level;
        const value = target.value;
        if (level) {
            DndSheet.stores.characterActions.updateSpellSlot(level, 'used', value);
        }
    },
    // MODIFIED: Added a new handler for the "remaining" slots input
    'update-remaining-slots': (target) => {
        const level = parseInt(target.dataset.level, 10);
        const remaining = parseInt(target.value, 10);
        
        const character = DndSheet.stores.character.get();
        const total = character.spellcasting.spellSlots[level].total;
        
        if (level && !isNaN(remaining)) {
            // Calculate the 'used' value from the 'remaining' value
            const newUsedValue = total - remaining;
            DndSheet.stores.characterActions.updateSpellSlot(level, 'used', newUsedValue);
        }
    }
};