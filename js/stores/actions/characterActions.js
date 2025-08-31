// js/stores/actions/characterActions.js

DndSheet.stores.characterActions = {

    // These functions now accept 'character' as an argument and return the modified 'character'
    
    _calculateSpellSlots: function(character) {
        let newSpellSlots = Array(10).fill(null).map(() => ({ total: 0, used: 0 }));
        if (character.classes && character.classes.length === 1) {
            const charClass = character.classes[0];
            const classData = DndSheet.data.classes[charClass.name];
            if (classData && classData.spellSlots) {
                let progressionTable = classData.spellSlots;
                if ((charClass.name === 'Fighter' && charClass.subclassName !== 'Eldritch Knight') ||
                    (charClass.name === 'Rogue' && charClass.subclassName !== 'Arcane Trickster')) {
                    progressionTable = {};
                }
                const slotsForLevel = progressionTable[charClass.level];
                if (slotsForLevel) {
                    slotsForLevel.forEach((numSlots, i) => {
                        const spellLevel = i + 1;
                        newSpellSlots[spellLevel].total = numSlots;
                        if (character.spellcasting.spellSlots[spellLevel]) {
                           newSpellSlots[spellLevel].used = Math.min(numSlots, character.spellcasting.spellSlots[spellLevel].used);
                        }
                    });
                }
            }
        }
        character.spellcasting.spellSlots = newSpellSlots;
        return character;
    },

    _applyClassFeatures: function(character) {
        if (!character.classes) return character;
        const currentAbilities = Object.values(character.abilities || {});
        const nonClassAbilities = currentAbilities.filter(ability => ability.source !== 'Class Feature');
        const newClassFeatures = [];
        character.classes.forEach(charClass => {
            const classData = DndSheet.data.classes[charClass.name];
            if (!classData || !classData.features) return;
            for (let level = 1; level <= charClass.level; level++) {
                if (classData.features[level]) {
                    classData.features[level].forEach(feature => {
                        newClassFeatures.push({ ...feature, id: DndSheet.helpers.uuid(), source: 'Class Feature', type: 'Class' });
                    });
                }
            }
        });
        const finalAbilities = {};
        [...nonClassAbilities, ...newClassFeatures].forEach(ability => {
            finalAbilities[ability.id] = ability;
        });
        character.abilities = finalAbilities;
        return character;
    },

    _updateProficiencyBonus: function(character) {
        const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0);
        character.proficiencyBonus = Math.ceil(1 + totalLevel / 4);
        return character;
    },

    applyRace: function(character) {
        const raceData = DndSheet.data.races[character.race.name]; // MODIFIED to use character.race.name
        if (!raceData) return character;

        const subraceData = (raceData.subraces || []).find(sub => sub.name === character.subrace.name); // MODIFIED
        
        // This logic can be simplified as other actions will handle adding traits
        // For now, let's focus on the ability scores
        const finalScores = JSON.parse(JSON.stringify(character.abilityScores));
        for (const score in finalScores) { finalScores[score].racial = 0; }
        
        const applyAsi = (asi) => {
            if (!asi) return;
            for (const [stat, value] of Object.entries(asi)) {
                if (finalScores[stat] && typeof value === 'number') { finalScores[stat].racial += value; }
            }
        };

        applyAsi(raceData.abilityScoreIncrease);
        applyAsi(subraceData?.abilityScoreIncrease);

        character.abilityScores = finalScores;
        return character;
    }

    // NOTE: The other functions in your old file (addClass, removeClass, etc.) will also need to be
    // refactored to this new pattern, but let's get the app loading first.
};