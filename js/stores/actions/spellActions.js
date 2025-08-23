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
        const newSpell = { ...spellData, id: uuid(), favorited: false };
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

    Object.assign(actions, {
        addSpell,
        deleteSpell,
        toggleFavoriteSpell,
        updateSpellSlot
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);