// js/stores/actions/characterActions.js
DndSheet.stores.characterActions = {

    _recalculateAll: function(character) {
        character = this._applyClassFeatures(character);
        character = this.applyRace(character);
        character = this._updateProficiencyBonus(character);
        character = this.recalculateMaxHp(character);
        character = this._calculateSpellSlots(character);
        return character;
    },
    updateCharacterProperty: function(character, { field, value, subfield }) {
        const newCharacter = { ...character };
        const newValue = (typeof value === 'string' && !isNaN(parseInt(value, 10))) ? parseInt(value, 10) : value;
        if (subfield) {
            let current = newCharacter;
            const path = subfield.split('.');
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]] = { ...(current[path[i]] || {}) };
            }
            current[path[path.length - 1]] = newValue;
        } else {
            newCharacter[field] = newValue;
        }
        return newCharacter;
    },
    applyRace: function(character) {
        const raceData = DndSheet.data.races[character.race.name];
        if (!raceData) return character;
        const subraceData = (raceData.subraces || []).find(sub => sub.name === character.subrace.name);
        for (const score in character.abilityScores) {
            character.abilityScores[score].racial = 0;
        }
        const applyAsi = (asi) => {
            if (!asi) return;
            for (const [stat, value] of Object.entries(asi)) {
                if (character.abilityScores[stat]) character.abilityScores[stat].racial += value;
            }
        };
        applyAsi(raceData.abilityScoreIncrease);
        applyAsi(subraceData?.abilityScoreIncrease);
        const nonRacialAbilities = Object.values(character.abilities || {}).filter(ability => !ability.source?.startsWith('Racial'));
        const newRacialTraits = (raceData.traits || []).map(trait => ({ ...trait, id: DndSheet.helpers.uuid(), source: 'Racial Trait' }));
        if (subraceData && subraceData.traits) {
            newRacialTraits.push(...subraceData.traits.map(trait => ({ ...trait, id: DndSheet.helpers.uuid(), source: 'Racial Subrace Trait' })));
        }
        const finalAbilities = {};
        [...nonRacialAbilities, ...newRacialTraits].forEach(ability => { finalAbilities[ability.id] = ability; });
        character.abilities = finalAbilities;
        return character;
    },
    _applyClassFeatures: function(character) {
        if (!character.classes) return character;
        for (const save in character.savingThrows) {
            character.savingThrows[save].proficient = false;
        }
        character.classes.forEach(cls => {
            const classData = DndSheet.data.classes[cls.name];
            if (classData && classData.savingThrows) {
                classData.savingThrows.forEach(save => {
                    if (character.savingThrows[save]) {
                        character.savingThrows[save].proficient = true;
                    }
                });
            }
        });
        const nonClassAbilities = Object.values(character.abilities || {}).filter(ability => ability.source !== 'Class Feature');
        const newClassFeatures = [];
        character.classes.forEach(charClass => {
            const classData = DndSheet.data.classes[charClass.name];
            if (!classData || !classData.features) return;
            for (let level = 1; level <= charClass.level; level++) {
                if (classData.features[level]) {
                    classData.features[level].forEach(feature => {
                        newClassFeatures.push({ ...feature, id: DndSheet.helpers.uuid(), source: 'Class Feature' });
                    });
                }
            }
        });
        const finalAbilities = {};
        [...nonClassAbilities, ...newClassFeatures].forEach(ability => { finalAbilities[ability.id] = ability; });
        character.abilities = finalAbilities;
        return character;
    },
    recalculateMaxHp: function(character) {
        if (character.hpOverride !== null && !isNaN(character.hpOverride)) {
            character.maxHp = parseInt(character.hpOverride, 10);
            return character;
        }
        const conMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'con'));
        let newMaxHp = 0;
        const levelMap = [];
        (character.classes || []).forEach(cls => {
            if (!cls.name) return; // Skip classes that haven't been selected yet
            for (let i = 1; i <= (cls.level || 1); i++) {
                levelMap.push({ className: cls.name });
            }
        });
        if (levelMap.length > 0) {
            const firstClass = DndSheet.data.classes[levelMap[0].className];
            if (firstClass) newMaxHp += (firstClass.hitDie || 0) + conMod;
            for (let i = 1; i < levelMap.length; i++) {
                const currentClass = DndSheet.data.classes[levelMap[i].className];
                const average = (currentClass?.hitDie / 2) + 1;
                const roll = parseInt(character.hpRolls?.[i + 1], 10);
                newMaxHp += (isNaN(roll) ? average : roll) + conMod;
            }
        }
        character.maxHp = newMaxHp;
        return character;
    },
    _updateProficiencyBonus: function(character) {
        const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0);
        character.proficiencyBonus = Math.ceil(1 + totalLevel / 4);
        return character;
    },
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
    addClass: function(character) {
        character.classes.push({ name: '', level: 1, subclassName: '' });
        return character;
    },
    removeClass: function(character, index) {
        character.classes.splice(index, 1);
        return character;
    },
    updateClass: function(character, { index, field, value }) {
        if (!character.classes?.[index]) return character;
        const isLevel = field === 'level';
        character.classes[index][field] = isLevel ? (parseInt(value, 10) || 1) : value;
        if (field === 'name') character.classes[index].subclassName = '';
        return character;
    },
};