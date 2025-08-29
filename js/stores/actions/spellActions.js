// js/stores/actions/spellActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addNewBlankSpell(level) {
        const spellData = {
            name: 'New Spell',
            description: '',
            level: parseInt(level, 10) || 0,
            school: 'Abjuration',
            castingTime: '1 Action',
            durationUnit: 'Instantaneous'
        };
        addSpell(spellData);
    }

    function addSpell(spellData) {
        const character = store.get();
        const newSpell = { 
            ...spellData, 
            id: uuid(), 
            favorited: false,
            durationEffect: spellData.durationEffect || '',
            damageNumDice: parseInt(spellData.damageNumDice, 10) || null,
            damageDieType: parseInt(spellData.damageDieType, 10) || null,
            damageType: spellData.damageType || ''
        };
        const newSpells = { ...character.spells, [newSpell.id]: newSpell };
        store.set({ spells: newSpells });
    }

    function addPremadeSpell(spellData) {
        const newSpell = {
            name: spellData.name,
            description: spellData.description,
            level: spellData.properties.Level,
            school: spellData.properties.School,
        };
        const durationStr = spellData.properties.Duration || 'Instantaneous';
        const durationMatch = durationStr.match(/(\d+)\s*(round|minute|hour)/i);
        if (durationMatch) {
            newSpell.durationValue = parseInt(durationMatch[1], 10);
            newSpell.durationUnit = durationMatch[2].charAt(0).toUpperCase() + durationMatch[2].slice(1) + 's';
        } else {
            newSpell.durationValue = 0;
            newSpell.durationUnit = 'Instantaneous';
        }
        addSpell(newSpell);
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
        if (level === 0) {
            if (spell.durationValue > 0) {
                DndSheet.stores.characterActions.addTimer({ name: spell.name, description: spell.description, duration: spell.durationValue, unit: spell.durationUnit });
            }
            return;
        }

        const newSlots = JSON.parse(JSON.stringify(character.spellcasting.spellSlots));
        if (newSlots[level] && newSlots[level].used < newSlots[level].total) {
            newSlots[level].used += 1;
            
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
        addNewBlankSpell,
        addPremadeSpell,
        deleteSpell,
        toggleFavoriteSpell,
        updateSpellSlot,
        castSpell,
    });
    
})(DndSheet.stores.character, DndSheet.stores.characterActions);