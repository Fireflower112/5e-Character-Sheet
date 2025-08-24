// js/handlers/event-listeners.js

(function() {
    // This function will be called by main.js to set up all the listeners.
    const initialize = () => {

        const clickHandlers = {
            'open-homebrew-modal': () => DndSheet.pages.showHomebrewRaceModal(),
            'open-homebrew-subrace-modal': () => {
                const character = DndSheet.stores.character.get();
                DndSheet.pages.showHomebrewSubraceModal(character.race);
            },
            'sub-tab': (target) => {
                const { subpage } = target.dataset;
                DndSheet.app.setCurrentSubPage(subpage);
            },
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
                    DndSheet.stores.characterActions.applyHpChange(-amount); // Send as a negative number
                    input.value = '';
                }
            },
            'delete-homebrew-race': (target) => {
                const { raceName } = target.dataset;
                if (confirm(`Are you sure you want to delete the "${raceName}" race?`)) {
                    DndSheet.stores.character.deleteHomebrewRace(raceName);
                }
            },
            'edit-homebrew-race': (target) => {
                const { raceName } = target.dataset;
                const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
                const raceToEdit = homebrewRaces[raceName];
                if (raceToEdit) {
                    DndSheet.pages.showHomebrewRaceModal(raceToEdit);
                }
            },
        };

        const changeHandlers = {
            'race': (target) => DndSheet.stores.characterActions.handleRaceChange(target.value),
            'subrace': (target) => DndSheet.stores.characterActions.applySubrace(target.value),
            'update-class': (target) => DndSheet.stores.characterActions.updateClass(target.dataset.index, target.dataset.field, target.value),
            'update-subclass': (target) => DndSheet.stores.characterActions.updateSubclass(target.dataset.index, target.value),
            'toggle-attunement': (target) => DndSheet.stores.characterActions.toggleAttunement(target.dataset.itemId),
            'assign-to-container': (target) => DndSheet.stores.characterActions.assignItemToContainer(target.dataset.itemId, target.value),
            'equip-weapon': (target) => {
                const slot = target.checked ? 'Wielded' : null;
                DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
            },
            'equip-armor': (target) => {
                const slot = target.checked ? 'Armor' : null;
                DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
            },
            'equip-shield': (target) => {
                const slot = target.checked ? 'Shield' : null;
                DndSheet.stores.characterActions.equipItemToSlot(target.dataset.itemId, slot);
            },
            'toggle-hp-override': (target) => {
                const overrideValue = target.checked ? (DndSheet.stores.character.get().maxHp || 0) : null;
                DndSheet.stores.characterActions.updateCharacterProperty('hpOverride', overrideValue);
            },
        };

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
            }
            // Handle unique cases not covered by action or field
            else if (skill && type) { 
                const c = DndSheet.stores.character.get(); const n = { ...c.skills }; n[skill][type] = target.checked; DndSheet.stores.character.set({ skills: n }); 
            } 
            else if (save) { 
                const c = DndSheet.stores.character.get(); const n = { ...c.savingThrows }; n[save].proficient = target.checked; DndSheet.stores.character.set({ savingThrows: n }); 
            } 
            // Generic fallback for any other input with a data-field
            else if (field) { 
                DndSheet.stores.characterActions.updateCharacterProperty(field, target.value, subfield);
            }
        });
    };

    // Expose the initialize function to the global DndSheet object
    DndSheet.handlers = {
        initialize: initialize
    };

})();