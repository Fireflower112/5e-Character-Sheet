// js/stores/actions/spellActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // MODIFIED: This function is now smarter and handles both custom and premade spells.
    function addSpell(spellData) {
        const character = store.get();
        // If it's a premade spell, the core data is in a 'properties' object.
        const props = spellData.properties || spellData;

        const newSpell = { 
            ...spellData, // This copies everything from the source, including trackerInfo
            id: uuid(), 
            favorited: false,
            // Ensure top-level properties exist for easy access in your render functions
            level: props.Level || spellData.level,
            school: props.School || spellData.school,
            description: spellData.description
        };

        const newSpells = { ...character.spells, [newSpell.id]: newSpell };
        store.set({ spells: newSpells });
    }

    // MODIFIED: This function is now much simpler.
    function addPremadeSpell(spellData) {
        // It just passes the full, original spell object to our smarter addSpell function.
        addSpell(spellData);
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
    
    function addNewBlankSpell(level) {
        const spellData = {
            name: 'New Spell',
            description: '',
            level: parseInt(level, 10) || 0,
            school: 'Abjuration'
        };
        addSpell(spellData);
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
        if (level > 0) {
            const slots = character.spellcasting.spellSlots || [];
            if (!slots[level] || slots[level].used >= slots[level].total) {
                DndSheet.helpers.showMessage(`No level ${level} spell slots remaining.`, 'red');
                return;
            }
        }

        DndSheet.helpers.showMessage(`Casting ${spell.name}!`, 'purple');

        if (spell.trackerInfo && spell.trackerInfo.duration.value > 0) {
            const unit = spell.trackerInfo.duration.unit || 'Rounds';
            actions.addTimer({
                name: spell.name,
                description: spell.trackerInfo.effectDescription,
                duration: spell.trackerInfo.duration.value,
                unit: unit.charAt(0).toUpperCase() + unit.slice(1)
            });
        }

        if (level > 0) {
            const newSlots = JSON.parse(JSON.stringify(character.spellcasting.spellSlots));
            newSlots[level].used += 1;
            store.set({ spellcasting: { ...character.spellcasting, spellSlots: newSlots } });
        }
    }

    Object.assign(actions, {
        addSpell,
        addNewBlankSpell,
        addPremadeSpell,
        deleteSpell,
        toggleFavoriteSpell,
        updateSpellSlot,
        castSpell,
    });
    
})(DndSheet.stores.character, DndSheet.stores.characterActions);