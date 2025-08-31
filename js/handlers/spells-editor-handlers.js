// js/handlers/spells-editor-handlers.js
DndSheet.handlers.spellsEditorClickHandlers = {
    'add-spell': () => {
        const form = document.getElementById('add-spell-form');
        const newSpellData = {
            name: form.querySelector('#spell-name').value,
            description: form.querySelector('#spell-description').value,
            level: parseInt(form.querySelector('#spell-level').value, 10),
            school: form.querySelector('#spell-school').value,
        };

        if (newSpellData.name && !isNaN(newSpellData.level)) {
            let char = DndSheet.stores.character.get();
            char = DndSheet.stores.spellActions.addSpell(char, newSpellData);
            DndSheet.stores.character.set(char);
            
            DndSheet.helpers.showMessage('Spell added successfully!', 'green');
            form.reset();
        } else {
            DndSheet.helpers.showMessage('Please enter a spell name and level.', 'red');
        }
    },
    'delete-spell': (target) => {
        let char = DndSheet.stores.character.get();
        char = DndSheet.stores.spellActions.deleteSpell(char, target.dataset.spellId);
        DndSheet.stores.character.set(char);
    },
};