// js/stores/actions/spellActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addSpell(spellData) {
        const character = store.get();
        const newSpell = { 
            ...spellData, 
            id: uuid(), 
            favorited: false,
            // Add the new damage fields
            damageNumDice: parseInt(spellData.damageNumDice, 10) || null,
            damageDieType: parseInt(spellData.damageDieType, 10) || null,
            damageType: spellData.damageType || ''
        };
        const newSpells = { ...character.spells, [newSpell.id]: newSpell };
        store.set({ spells: newSpells });
    }

    function deleteSpell(spellId) {
        const character = store.get();
        const newSpells = { ...character.spells };
        delete newSpells[spellId];
        store.set({ spells: newSpells });
    }

    function toggleFavoriteSpell(spellId) {
        const character = store.get();
        const newSpells = JSON.parse(JSON.stringify(character.spells));
        if (newSpells[spellId]) {
            newSpells[spellId].favorited = !newSpells[spellId].favorited;
            store.set({ spells: newSpells });
        }
    }

    function updateSpellSlot(level, type, value) {
        const character = store.get();
        const newSlots = JSON.parse(JSON.stringify(character.spellcasting.spellSlots));
        const parsedValue = parseInt(value, 10);
        if (newSlots[level]) {
            newSlots[level][type] = isNaN(parsedValue) ? 0 : parsedValue;
            store.set({ spellcasting: { ...character.spellcasting, spellSlots: newSlots } });
        }
    }
	
	function castSpell(spellId) {
        const character = store.get();
        const spell = character.spells[spellId];
        if (!spell) return;

        const level = spell.level;
        if (level === 0) { // Cantrips don't use slots, but we might still track them
            if (spell.durationValue > 0) {
                DndSheet.stores.characterActions.addTimer({ name: spell.name, duration: spell.durationValue, unit: spell.durationUnit });
            }
            return;
        }

        const newSlots = JSON.parse(JSON.stringify(character.spellcasting.spellSlots));
        if (newSlots[level] && newSlots[level].used < newSlots[level].total) {
            newSlots[level].used += 1;
            
            // If the spell has a duration, create a timer for it
            if (spell.durationValue > 0) {
                DndSheet.stores.characterActions.addTimer({ name: spell.name, duration: spell.durationValue, unit: spell.durationUnit });
            }

            store.set({ spellcasting: { ...character.spellcasting, spellSlots: newSlots } });
        } else {
            DndSheet.helpers.showMessage(`No level ${level} spell slots remaining.`, 'red');
        }
    }


   Object.assign(actions, {
        addSpell,
        deleteSpell,
        toggleFavoriteSpell,
        updateSpellSlot,
        castSpell, // <-- Add the new action
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);