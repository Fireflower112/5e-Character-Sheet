// js/stores/actions.js
window.stores = window.stores || {};
window.stores.characterActions = (function(store) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // --- Inventory Actions ---
    function addItem(itemData) {
        const character = store.get();
        const newItem = { ...itemData, id: uuid() };
        const newItems = { ...character.inventory.items, [newItem.id]: newItem };
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function addContainer(containerData) {
        const character = store.get();
        const newContainer = { ...containerData, id: uuid() };
        const newContainers = { ...character.inventory.containers, [newContainer.id]: newContainer };
        store.set({ inventory: { ...character.inventory, containers: newContainers } });
    }

    function deleteItem(itemId) {
        const character = store.get();
        const newItems = { ...character.inventory.items };
        delete newItems[itemId];
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function assignItemToContainer(itemId, containerId) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId]) {
            newItems[itemId].containerId = (containerId === 'none') ? null : containerId;
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

    function equipItemToSlot(itemId, slot) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        const itemToEquip = newItems[itemId];
        if (!itemToEquip) return;

        Object.values(newItems).forEach(item => {
            if (item.id !== itemId && item.equippedSlot === slot && slot !== 'none') {
                item.equippedSlot = null;
            }
        });
        
        itemToEquip.equippedSlot = (slot === 'none') ? null : slot;
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function toggleFavoriteItem(itemId) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId]) {
            newItems[itemId].favorited = !newItems[itemId].favorited;
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

    // --- Character & Ability Actions (from your working file) ---
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

    function applyRace(raceName) {
        const character = store.get();
        const raceData = window.dndData.races[raceName];
        
        const currentAbilities = Object.values(character.abilities || {});
        const nonRacialAbilities = currentAbilities.filter(ability => !ability.source?.startsWith('Racial'));
        
        const newRacialTraits = [];
        if (raceData?.traits) {
            raceData.traits.forEach(trait => {
                newRacialTraits.push({ ...trait, id: uuid(), source: 'Racial Trait', type: 'Racial' });
            });
        }
        
        const finalAbilities = {};
        [...nonRacialAbilities, ...newRacialTraits].forEach(ability => {
            finalAbilities[ability.id] = ability;
        });

        const finalScores = JSON.parse(JSON.stringify(character.abilityScores));
        for (const score in finalScores) { finalScores[score].racial = 0; }
        if (raceData?.abilityScoreIncrease) {
            for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                if (finalScores[stat] && typeof value === 'number') { 
                    finalScores[stat].racial = (finalScores[stat].racial || 0) + value; 
                }
            }
        }
        const finalLanguages = ['Common'];
        if (raceData?.languages) {
            raceData.languages.split(',').map(l => l.trim()).forEach(lang => {
                if (!finalLanguages.includes(lang)) finalLanguages.push(lang);
            });
        }
        console.log('%c ACTION (Race):', 'color: red; font-weight: bold;', 'Calculated new abilities:', finalAbilities);
		store.set({ 
			race: raceName,  
            subrace: '',
            abilities: finalAbilities, 
            abilityScores: finalScores, 
            languages: finalLanguages
        });
    }

    function applySubrace(subraceName) {
        store.set({ subrace: subraceName });
        applyRace(store.get().race);
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
    
    function updateCharacterProperty(field, value, subField) {
        const character = store.get();
        const newCharacterState = JSON.parse(JSON.stringify(character));
        const newValue = isNaN(parseInt(value, 10)) || !isFinite(value) ? value : parseInt(value, 10);
        if (subField) {
            let path = subField.split('.');
            let obj = newCharacterState[field];
            for (let i = 0; i < path.length - 1; i++) {
                if (!obj[path[i]]) obj[path[i]] = {};
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]] = newValue;
        } else {
            newCharacterState[field] = newValue;
        }
        store.set(newCharacterState);
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

    function updateSubclass(index, subclassName) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = JSON.parse(JSON.stringify(character.classes));
            newClasses[index].subclassName = subclassName;
            store.set({ classes: newClasses });
        }
    }

    function removeClass(index) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = [...character.classes];
            newClasses.splice(index, 1);
            store.set({ classes: newClasses });
            _applyClassFeatures(); 
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
        // Adding inventory functions
        addItem,
        addContainer,
        deleteItem,
        assignItemToContainer,
        equipItemToSlot,
        toggleFavoriteItem,
    };
})(window.stores.character);