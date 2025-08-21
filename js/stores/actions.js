// js/stores/actions.js
window.stores = window.stores || {};
window.stores.characterActions = (function(store) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function _applyClassFeatures() {
        const character = store.get();
        if (!character.classes || !window.dndData.classes) return;

        let newAbilities = { ...(character.abilities || {}) };
        for (const abilityId in newAbilities) {
            if (newAbilities[abilityId].source === 'Class Feature') {
                delete newAbilities[abilityId];
            }
        }

        character.classes.forEach(charClass => {
            const classData = window.dndData.classes[charClass.name];
            if (classData && classData.features) {
                for (let level = 1; level <= charClass.level; level++) {
                    if (classData.features[level]) {
                        classData.features[level].forEach(feature => {
                            const newAbility = { ...feature, id: uuid(), source: 'Class Feature', type: 'Class' };
                            newAbilities[newAbility.id] = newAbility;
                        });
                    }
                }
            }
        });
        store.set({ abilities: newAbilities });
    }

    function applyRace(raceName) {
        const character = store.get();
        let newAbilities = { ...(character.abilities || {}) };
        const newScores = JSON.parse(JSON.stringify(character.abilityScores));
        let newLanguages = ['Common'];

        for (const abilityId in newAbilities) {
            if (newAbilities[abilityId].source?.startsWith('Racial')) {
                delete newAbilities[abilityId];
            }
        }
        for (const ability in newScores) { newScores[ability].racial = 0; }

        const raceData = window.dndData.races[raceName];
        if (raceData) {
            if (raceData.languages) {
                const racialLangs = raceData.languages.split(',').map(l => l.trim());
                racialLangs.forEach(lang => {
                    if (!newLanguages.includes(lang)) newLanguages.push(lang);
                });
            }

            if (raceData.abilityScoreIncrease) {
                for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                    if (newScores[stat] && typeof value === 'number') {
                        newScores[stat].racial = (newScores[stat].racial || 0) + value;
                    }
                }
            }

            if (raceData.traits) {
                raceData.traits.forEach(trait => {
                    const newTrait = { ...trait, id: uuid(), source: 'Racial Trait', type: 'Racial' };
                    newAbilities[newTrait.id] = newTrait;
                });
            }
        }
        
        store.set({ 
            race: raceName, 
            subrace: '', 
            abilities: newAbilities, 
            abilityScores: newScores, 
            languages: newLanguages 
        });
    }
    
    function applySubrace(subraceName) {
        const character = store.get();
        const raceData = window.dndData.races[character.race];
        if (!raceData || !raceData.subraces) return;

        const subraceData = raceData.subraces.find(sub => sub.name === subraceName);
        let newAbilities = { ...character.abilities };
        const newScores = JSON.parse(JSON.stringify(character.abilityScores));

        for (const abilityId in newAbilities) {
            if (newAbilities[abilityId].source === 'Racial Subrace Trait') {
                delete newAbilities[abilityId];
            }
        }
        for (const ability in newScores) { newScores[ability].racial = 0; }
        if (raceData.abilityScoreIncrease) {
            for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                if (newScores[stat] && typeof value === 'number') {
                    newScores[stat].racial = value;
                }
            }
        }
        
        if (subraceData) {
            if (subraceData.abilityScoreIncrease) {
                for (const [stat, value] of Object.entries(subraceData.abilityScoreIncrease)) {
                    if (newScores[stat] && typeof value === 'number') {
                        newScores[stat].racial = (newScores[stat].racial || 0) + value;
                    }
                }
            }
            if (subraceData.traits) {
                subraceData.traits.forEach(trait => {
                    const newTrait = { ...trait, id: uuid(), source: 'Racial Subrace Trait', type: 'Racial' };
                    newAbilities[newTrait.id] = newTrait;
                });
            }
        }
        
        store.set({ subrace: subraceName, abilities: newAbilities, abilityScores: newScores });
    }

    function updateCharacterProperty(field, value, subField) {
        const character = store.get();
        const newCharacter = { ...character };
        const newValue = isNaN(parseInt(value, 10)) || !isFinite(value) ? value : parseInt(value, 10);

        if (subField) {
            if (!newCharacter[field]) newCharacter[field] = {};
            if (subField.includes('.')) {
                const [key, subKey] = subField.split('.');
                if (!newCharacter[field][key]) newCharacter[field][key] = {};
                newCharacter[field][key][subKey] = newValue;
            } else {
                newCharacter[field][subField] = newValue;
            }
        } else {
            newCharacter[field] = newValue;
        }
        store.set(newCharacter);
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

    function addClass() {
        const character = store.get();
        const newClasses = [...(character.classes || [])];
        newClasses.push({ name: '', level: 1, subclassName: '' });
        store.set({ classes: newClasses });
    }

    function updateClass(index, field, value) {
        const character = store.get();
        if (character.classes && character.classes[index]) {
            const newClasses = [...character.classes];
            const isLevel = field === 'level';
            const parsedValue = isLevel ? parseInt(value, 10) : value;

            if (field === 'name' && newClasses[index].name !== value) {
                newClasses[index].subclassName = '';
            }
            
            newClasses[index][field] = isLevel ? (isNaN(parsedValue) ? 0 : parsedValue) : value;
            store.set({ classes: newClasses });
            _applyClassFeatures(); // Recalculate features when class/level changes
        }
    }

    function updateSubclass(index, subclassName) {
        const character = store.get();
        if (character.classes && character.classes[index]) {
            const newClasses = [...character.classes];
            newClasses[index].subclassName = subclassName;
            store.set({ classes: newClasses });
        }
    }

    function removeClass(index) {
        const character = store.get();
        if (character.classes && character.classes[index]) {
            const newClasses = [...character.classes];
            newClasses.splice(index, 1);
            store.set({ classes: newClasses });
            _applyClassFeatures(); // Recalculate features
        }
    }

    return {
        _applyClassFeatures,
        applyRace,
        applySubrace,
        updateCharacterProperty,
        addLanguage,
        removeLanguage,
        addClass,
        updateClass,
        updateSubclass,
        removeClass,
    };
})(window.stores.character);