// js/stores/actions/characterActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function _applyClassFeatures() {
        const character = store.get();
        if (!character.classes) return;
        const currentAbilities = Object.values(character.abilities || {});
        const nonClassAbilities = currentAbilities.filter(ability => ability.source !== 'Class Feature');
        const newClassFeatures = [];
        character.classes.forEach(charClass => {
            const classData = DndSheet.data.classes[charClass.name];
            if (!classData || !classData.features) return;
            for (let level = 1; level <= charClass.level; level++) {
                if (classData.features[level]) {
                    classData.features[level].forEach(feature => {
                        newClassFeatures.push({ ...feature, id: uuid(), source: 'Class Feature', type: 'Class' });
                    });
                }
            }
        });
        const finalAbilities = {};
        [...nonClassAbilities, ...newClassFeatures].forEach(ability => {
            finalAbilities[ability.id] = ability;
        });
        store.set({ abilities: finalAbilities });
    }

     function _updateProficiencyBonus() {
        const character = store.get();
        const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 0), 0);
        const proficiencyBonus = Math.ceil(1 + totalLevel / 4);
        store.set({ proficiencyBonus: proficiencyBonus });
    }
	function applyRace() {
        const character = store.get();
        const raceData = DndSheet.data.races[character.race];
        if (!raceData) return;
        const subraceData = (raceData.subraces || []).find(sub => sub.name === character.subrace);
        const currentAbilities = Object.values(character.abilities || {});
        const nonRacialAbilities = currentAbilities.filter(ability => !ability.source?.startsWith('Racial'));
        const newRacialTraits = (raceData.traits || []).map(trait => ({ ...trait, id: uuid(), source: 'Racial Trait', type: 'Racial' }));
        if (subraceData && subraceData.traits) {
            newRacialTraits.push(...subraceData.traits.map(trait => ({ ...trait, id: uuid(), source: 'Racial Subrace Trait', type: 'Racial' })));
        }
        const finalAbilities = {};
        [...nonRacialAbilities, ...newRacialTraits].forEach(ability => { finalAbilities[ability.id] = ability; });
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
        const finalLanguages = ['Common'];
        if (raceData.languages) {
            raceData.languages.split(',').map(l => l.trim()).forEach(lang => {
                if (!finalLanguages.includes(lang)) finalLanguages.push(lang);
            });
        }
        store.set({ abilities: finalAbilities, abilityScores: finalScores, languages: finalLanguages });
    }

    function applySubrace(subraceName) {
        store.set({ subrace: subraceName });
        applyRace();
    }
    
    function handleRaceChange(raceName) {
        store.set({ race: raceName, subrace: '' });
        applyRace();
    }

    function recalculateMaxHp() {
        const character = store.get();
        const conMod = DndSheet.helpers.getAbilityModifier(DndSheet.helpers.getFinalAbilityScore(character, 'con'));
        const totalLevel = (character.classes || []).reduce((sum, cls) => sum + (cls.level || 1), 0);
        let newMaxHp = 0;
        if (character.hpOverride !== null && !isNaN(parseInt(character.hpOverride, 10))) {
            newMaxHp = parseInt(character.hpOverride, 10);
        } else {
            if (totalLevel > 0) {
                const levelMap = [];
                (character.classes || []).forEach(cls => {
                    for (let i = 1; i <= (cls.level || 1); i++) {
                        levelMap.push({ level: levelMap.length + 1, className: cls.name });
                    }
                });
                levelMap.sort((a, b) => a.level - b.level);
                const firstClass = DndSheet.data.classes[levelMap[0].className];
                if(firstClass) newMaxHp += (firstClass.hitDie || 0) + conMod;
                for (let i = 1; i < totalLevel; i++) {
                    const currentLevel = levelMap[i].level;
                    const currentClass = DndSheet.data.classes[levelMap[i].className];
                    const average = (currentClass?.hitDie / 2) + 1;
                    const roll = parseInt(character.hpRolls?.[currentLevel], 10);
                    newMaxHp += (isNaN(roll) ? average : roll) + conMod;
                }
            }
        }
        store.set({ maxHp: newMaxHp });
    }

    function updateClass(index, field, value) {
        const character = store.get();
        if (!character.classes?.[index]) return;
        const newClasses = JSON.parse(JSON.stringify(character.classes));
        const isLevel = field === 'level';
        const parsedValue = isLevel ? parseInt(value, 10) : value;
        newClasses[index][field] = isLevel ? (isNaN(parsedValue) ? 1 : parsedValue) : value;
        if (field === 'name') newClasses[index].subclassName = '';
        store.set({ classes: newClasses });
        _applyClassFeatures(); 
        recalculateMaxHp();
		_updateProficiencyBonus(); // <-- ADD THIS LINE
    }
    
    function updateCharacterProperty(field, value, subField) {
        const character = store.get();
        const newCharacterState = JSON.parse(JSON.stringify(character));
        const newValue = isNaN(parseInt(value, 10)) || !isFinite(value) ? value : parseInt(value, 10);
        if (subField) {
            let path = subField.split('.');
            let obj = newCharacterState[field];
            if (!obj) { obj = newCharacterState[field] = {}; }
            for (let i = 0; i < path.length - 1; i++) {
                if (!obj[path[i]]) obj[path[i]] = {};
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]] = newValue;
        } else {
            newCharacterState[field] = newValue;
        }
        store.set(newCharacterState);
        if ((field === 'abilityScores' && subField?.startsWith('con.')) || field === 'hpRolls' || field === 'hpOverride') {
            recalculateMaxHp();
        }
    }

    function addClass() {
        const character = store.get();
        const newClasses = [...(character.classes || [])];
        newClasses.push({ name: '', level: 1, subclassName: '' });
        store.set({ classes: newClasses });
        recalculateMaxHp();
		_updateProficiencyBonus(); // <-- ADD THIS LINE
    }
    
    function removeClass(index) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = [...character.classes];
            newClasses.splice(index, 1);
            store.set({ classes: newClasses });
            _applyClassFeatures(); 
            recalculateMaxHp();
			_updateProficiencyBonus(); // <-- ADD THIS LINE
        }
    }
    
    function addLanguage(language) {
        const character = store.get();
        const lang = language.trim();
        if (lang && !character.languages.includes(lang)) {
            const newLanguages = [...character.languages, lang];
            store.set({ languages: newLanguages });
        }
    }

    function removeLanguage(language) {
        const character = store.get();
        const newLanguages = character.languages.filter(l => l !== language);
        store.set({ languages: newLanguages });
    }

    function updateSubclass(index, subclassName) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = JSON.parse(JSON.stringify(character.classes));
            newClasses[index].subclassName = subclassName;
            store.set({ classes: newClasses });
        }
    }
    
    function applyHpChange(amount) {
        const character = store.get();
        let newHp = character.hp;
        let newTempHp = character.tempHp;

        if (amount < 0) { // Damage
            const damage = Math.abs(amount);
            const damageToTempHp = Math.min(newTempHp, damage);
            newTempHp -= damageToTempHp;
            const remainingDamage = damage - damageToTempHp;
            newHp -= remainingDamage;
        } else { // Healing
            newHp += amount;
        }
        newHp = Math.max(0, Math.min(newHp, character.maxHp));
        store.set({ hp: newHp, tempHp: newTempHp });
    }

    Object.assign(actions, {
        _applyClassFeatures,
        applyRace,
        applySubrace,
        handleRaceChange,
        recalculateMaxHp,
        updateClass,
        updateCharacterProperty,
        addClass,
        removeClass,
        addLanguage,
        removeLanguage,
        updateSubclass,
        applyHpChange,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);