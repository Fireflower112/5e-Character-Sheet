// js/stores/actions/classActions.js
(function(store, actions) {
	
    // MODIFIED: Added the uuid function here so it's available.
	function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

	function _calculateSpellSlots() {
        const character = store.get();
        const currentSlots = character.spellcasting.spellSlots || [];
        let newSpellSlots = Array(10).fill(null).map((_, i) => ({ 
            total: 0, 
            used: currentSlots[i]?.used || 0 
        }));

        if (character.classes && character.classes.length > 0) {
            const mainClass = character.classes[0];
            const classData = DndSheet.data.classes[mainClass.name];
            
            if (classData && classData.spellSlots) {
                const progressionTable = classData.spellSlots;
                const progression = progressionTable[mainClass.level];
                
                if (progression) {
                    progression.forEach((slots, i) => {
                        newSpellSlots[i + 1].total = slots;
                    });
                }
            }
        }
        store.set({ spellcasting: { ...character.spellcasting, spellSlots: newSpellSlots } });
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

	function updateClass(index, field, value) {
        const character = store.get();
        if (!character.classes?.[index]) return;

        const newClasses = JSON.parse(JSON.stringify(character.classes));
        
        if (field === 'level') {
            value = parseInt(value, 10) || 1;
        }

        newClasses[index][field] = value;
        
        if (field === 'name') {
            const classData = DndSheet.data.classes[value];
            if (classData) {
                newClasses[index].hitDie = classData.hitDie;
                newClasses[index].subclassName = '';
            }
        }

        store.set({ classes: newClasses });
        
        _calculateSpellSlots();
        _applyClassFeatures(); 
        // MODIFIED: This now correctly calls the function from the main actions object.
        actions.recalculateMaxHp();
        _updateProficiencyBonus();
    }

	function addClass() {
        const character = store.get();
        const newClasses = [...(character.classes || [])];
        newClasses.push({ name: '', level: 1, subclassName: '' });
        store.set({ classes: newClasses });
        // MODIFIED: This now correctly calls the function from the main actions object.
        actions.recalculateMaxHp();
        _updateProficiencyBonus();
        _calculateSpellSlots();
    }
    
    function removeClass(index) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = [...character.classes];
            newClasses.splice(index, 1);
            store.set({ classes: newClasses });
            _applyClassFeatures(); 
            // MODIFIED: This now correctly calls the function from the main actions object.
            actions.recalculateMaxHp();
            _updateProficiencyBonus();
            _calculateSpellSlots();
        }
    }

	function updateSubclass(index, subclassName) {
        const character = store.get();
        if (character.classes?.[index]) {
            const newClasses = JSON.parse(JSON.stringify(character.classes));
            newClasses[index].subclassName = subclassName;
            store.set({ classes: newClasses });
        }
    }

	 Object.assign(actions, {
        _calculateSpellSlots,
        _applyClassFeatures,
        _updateProficiencyBonus,
        updateClass,
        addClass,
        removeClass,
        updateSubclass
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);