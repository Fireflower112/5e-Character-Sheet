// js/stores/actions.js
window.stores = window.stores || {};
window.stores.characterActions = (function(store) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // This function rebuilds ONLY the class features.
    function _applyClassFeatures() {
        const character = store.get();
        if (!character.classes) return;

        const currentAbilities = Object.values(character.abilities || {});
        const nonClassAbilities = currentAbilities.filter(ability => ability.source !== 'Class Feature');
        
        const newClassFeatures = [];
        character.classes.forEach(charClass => {
            const classData = window.dndData.classes[charClass.name];
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
    
    // THIS IS THE CORRECTED FUNCTION
    function applyRace(raceName) {
        const character = store.get();
        const raceData = window.dndData.races[raceName];
        
        // Step 1: Get all abilities that are NOT from a racial source.
        const currentAbilities = Object.values(character.abilities || {});
        const nonRacialAbilities = currentAbilities.filter(ability => !ability.source?.startsWith('Racial'));
        
        // Step 2: Create a fresh list of the new race's traits.
        const newRacialTraits = [];
        if (raceData?.traits) {
            raceData.traits.forEach(trait => {
                newRacialTraits.push({ ...trait, id: uuid(), source: 'Racial Trait', type: 'Racial' });
            });
        }
        
        // Step 3: Combine the non-racial abilities and the new racial traits.
        const finalAbilities = {};
        [...nonRacialAbilities, ...newRacialTraits].forEach(ability => {
            finalAbilities[ability.id] = ability;
        });

        // (Other calculations for scores and languages remain the same)
        const finalScores = JSON.parse(JSON.stringify(character.abilityScores));
        for (const score in finalScores) { finalScores[score].racial = 0; }
        if (raceData?.abilityScoreIncrease) {
            for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                if (finalScores[stat]) { finalScores[stat].racial = (finalScores[stat].racial || 0) + value; }
            }
        }
        const finalLanguages = ['Common'];
        if (raceData?.languages) {
            raceData.languages.split(',').map(l => l.trim()).forEach(lang => {
                if (!finalLanguages.includes(lang)) finalLanguages.push(lang);
            });
        }

        // Step 4: Perform a single, clean update with all the new information.
        store.set({ 
            race: raceName, 
            subrace: '',
            abilities: finalAbilities, 
            abilityScores: finalScores, 
            languages: finalLanguages
        });
    }

    // All other functions remain the same as the last version I provided.
    function applySubrace(subraceName) {
        store.set({ subrace: subraceName });
        applyRace(store.get().race); // Re-run the main applyRace to recalculate everything
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
    }
    
    function updateCharacterProperty(field, value, subField) { /* ... same as before ... */ }
    function addLanguage(language) { /* ... same as before ... */ }
    function removeLanguage(language) { /* ... same as before ... */ }
    function addClass() { /* ... same as before ... */ }
    function updateSubclass(index, subclassName) { /* ... same as before ... */ }
    function removeClass(index) { /* ... same as before ... */ }

    // Make sure all public functions are returned
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