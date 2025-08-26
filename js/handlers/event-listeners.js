// js/handlers/event-listeners.js

(function() {
    // This function will be called by main.js to set up all the listeners.
    const initialize = () => {
        // We moved editBonuses to the app namespace to share it between files
        DndSheet.app.editBonuses = [];

        // Combine all click handlers from other files into one map
        const clickHandlers = {
            ...DndSheet.handlers.inventoryClickHandlers,
            ...DndSheet.handlers.notesClickHandlers,
            ...DndSheet.handlers.homebrewClickHandlers,
			...DndSheet.handlers.itemBrowserClickHandlers,
            
            // General application handlers remain here
            'toggle-accordion': (target) => {
                const wrapper = target.closest('div[data-accordion-wrapper]');
                if (wrapper) {
                    const details = wrapper.querySelector('.accordion-details');
                    if (details) details.classList.toggle('hidden');
                }
            },
            'sub-tab': (target) => DndSheet.app.setCurrentSubPage(target.dataset.subpage),
            'add-class': () => DndSheet.stores.characterActions.addClass(),
            'remove-class': (target) => DndSheet.stores.characterActions.removeClass(target.dataset.index),
            'apply-healing': () => {
                const input = document.getElementById('hp-change-input');
                const amount = parseInt(input.value, 10);
                if (!isNaN(amount) && amount > 0) {
                    DndSheet.stores.characterActions.applyHpChange(amount);
                    input.value = '';
                }
            },
            'apply-damage': () => {
                const input = document.getElementById('hp-change-input');
                const amount = parseInt(input.value, 10);
                if (!isNaN(amount) && amount > 0) {
                    DndSheet.stores.characterActions.applyHpChange(-amount);
                    input.value = '';
                }
            },
        };

        // Combine all change handlers
        const changeHandlers = {
            ...DndSheet.handlers.inventoryChangeHandlers,
            ...DndSheet.handlers.notesChangeHandlers,
            ...DndSheet.handlers.homebrewChangeHandlers,
            
            // General handlers
            'race': (target) => DndSheet.stores.characterActions.handleRaceChange(target.value),
            'subrace': (target) => DndSheet.stores.characterActions.applySubrace(target.value),
            'update-class': (target) => DndSheet.stores.characterActions.updateClass(target.dataset.index, target.dataset.field, target.value),
            'update-subclass': (target) => DndSheet.stores.characterActions.updateSubclass(target.dataset.index, target.value),
            'toggle-hp-override': (target) => {
                const overrideValue = target.checked ? (DndSheet.stores.character.get().maxHp || 0) : null;
                DndSheet.stores.characterActions.updateCharacterProperty('hpOverride', overrideValue);
            },
        };

        // The actual event listeners stay here and now use the combined handler maps
        document.addEventListener('click', (e) => {
            const actionTarget = e.target.closest('[data-action]');
            if (!actionTarget) return;
            const action = actionTarget.dataset.action;
            if (clickHandlers[action]) {
                clickHandlers[action](actionTarget);
            }
        });

        document.addEventListener('change', (e) => {
            const target = e.target;
            const { action, field, subfield, skill, type, save } = target.dataset;
            const handler = changeHandlers[action] || changeHandlers[field];
            if (handler) {
                handler(target);
            } else if (target.id === 'item-type') {
                const selectedType = target.value;
                const itemFields = {
                    weapon: document.getElementById('weapon-fields'),
                    armor: document.getElementById('armor-fields'),
                    shield: document.getElementById('shield-fields'),
                };
                Object.values(itemFields).forEach(field => field?.classList.add('hidden'));
                if (itemFields[selectedType]) {
                    itemFields[selectedType].classList.remove('hidden');
                }
            } else if (skill && type) { 
                const c = DndSheet.stores.character.get(); const n = { ...c.skills }; n[skill][type] = target.checked; DndSheet.stores.character.set({ skills: n }); 
            } else if (save) { 
                const c = DndSheet.stores.character.get(); const n = { ...c.savingThrows }; n[save].proficient = target.checked; DndSheet.stores.character.set({ savingThrows: n }); 
            } else if (field) { 
                DndSheet.stores.characterActions.updateCharacterProperty(field, target.value, subfield);
            }
        });
    };

    DndSheet.handlers.initialize = initialize;

})();