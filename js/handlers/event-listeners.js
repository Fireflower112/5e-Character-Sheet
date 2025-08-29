// js/handlers/event-listeners.js

(function() {
    const initialize = () => {
        DndSheet.app.editBonuses = [];
        const clickHandlers = {
            ...DndSheet.handlers.inventoryClickHandlers,
            ...DndSheet.handlers.notesClickHandlers,
            ...DndSheet.handlers.homebrewClickHandlers,
			...DndSheet.handlers.itemBrowserClickHandlers,
			...DndSheet.handlers.containerBrowserClickHandlers,
            ...DndSheet.handlers.trackerClickHandlers,
            ...DndSheet.handlers.spellBrowserClickHandlers,
            
            'cast-spell': (target) => DndSheet.stores.characterActions.castSpell(target.dataset.spellId),
            'delete-spell': (target) => DndSheet.stores.characterActions.deleteSpell(target.dataset.spellId),

            // MODIFIED: Restored the missing handler for adding a custom spell
            'add-spell': () => {
                const form = document.getElementById('add-spell-form');
                const newSpell = {
                    name: form.querySelector('#spell-name').value,
                    description: form.querySelector('#spell-description').value,
                    level: parseInt(form.querySelector('#spell-level').value, 10),
                    school: form.querySelector('#spell-school').value,
                    castingTime: form.querySelector('#spell-casting-time').value,
                    durationValue: parseInt(form.querySelector('#spell-duration-value').value, 10),
                    durationUnit: form.querySelector('#spell-duration-unit').value,
                    durationEffect: form.querySelector('#spell-duration-effect').value,
                    damageNumDice: form.querySelector('#spell-damage-num-dice').value,
                    damageDieType: form.querySelector('#spell-damage-die-type').value,
                    damageType: form.querySelector('#spell-damage-type').value,
                };

                if (newSpell.name && !isNaN(newSpell.level)) {
                    DndSheet.stores.characterActions.addSpell(newSpell);
                    DndSheet.helpers.showMessage('Spell added successfully!', 'green');
                    form.reset();
                } else {
                    DndSheet.helpers.showMessage('Please enter a spell name and level.', 'red');
                }
            },
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
                if (!isNaN(amount)) {
                    DndSheet.stores.characterActions.applyHpChange(amount);
                    input.value = '';
                }
            },
            'apply-damage': () => {
                const input = document.getElementById('hp-change-input');
                const amount = parseInt(input.value, 10);
                if (!isNaN(amount)) {
                    DndSheet.stores.characterActions.applyHpChange(-amount);
                    input.value = '';
                }
            },
            'toggle-hp-override': (target) => {
                const overrideValueInput = document.getElementById('hp-override-value');
                if (target.checked) {
                    overrideValueInput.classList.remove('hidden');
                } else {
                    overrideValueInput.classList.add('hidden');
                    DndSheet.stores.characterActions.updateCharacterProperty('hpOverride', null);
                }
            },
        };

        const changeHandlers = {
            'update-class': (target) => {
                const { index, field } = target.dataset;
                DndSheet.stores.characterActions.updateClass(index, field, target.value);
            },
            'update-subclass': (target) => {
                const { index } = target.dataset;
                DndSheet.stores.characterActions.updateSubclass(index, target.value);
            },
        };
        
       const contentArea = document.getElementById('content-area');
        if (!contentArea) return;

        contentArea.addEventListener('click', (e) => {
        // Check for the simple "add spell" buttons on the editor page first
        if (e.target.matches('.add-spell-btn')) {
            const level = e.target.dataset.level;
            if (level) {
                DndSheet.actions.spells.addSpell(parseInt(level, 10));
                return; // Exit after handling
            }
        }

        // Original logic for all other data-action buttons
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const handler = clickHandlers[target.dataset.action];
        if (handler) handler(target);
    });

        contentArea.addEventListener('change', (e) => {
             const target = e.target.closest('[data-field], [data-action], [data-skill], [data-save]');
            if (!target) return;
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