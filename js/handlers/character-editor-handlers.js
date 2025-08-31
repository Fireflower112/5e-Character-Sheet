// js/handlers/character-editor-handlers.js
DndSheet.handlers.characterEditorClickHandlers = {
    'add-class': () => {
        let char = DndSheet.stores.character.get();
        char = DndSheet.stores.characterActions.addClass(char);
        DndSheet.stores.character.set(char);
    },
    'remove-class': (target) => {
        let char = DndSheet.stores.character.get();
        char = DndSheet.stores.characterActions.removeClass(char, target.dataset.index);
        char = DndSheet.stores.characterActions._recalculateAll(char);
        DndSheet.stores.character.set(char);
    },
    'add-ability': () => {
        const name = document.getElementById('ability-name').value;
        const description = document.getElementById('ability-description').value;
        if (name) {
            let char = DndSheet.stores.character.get();
            // Assuming you have a generic 'addAbility' action
            const newAbility = { id: DndSheet.helpers.uuid(), name, description };
            char.abilities[newAbility.id] = newAbility;
            DndSheet.stores.character.set(char);
            document.getElementById('add-ability-form').reset();
        }
    },
};

DndSheet.handlers.characterEditorChangeHandlers = {
    'set-race': (target) => {
        let char = DndSheet.stores.character.get();
        char.race.name = target.value;
        char.subrace.name = '';
        char = DndSheet.stores.characterActions._recalculateAll(char);
        DndSheet.stores.character.set(char);
    },
    'set-subrace': (target) => {
        let char = DndSheet.stores.character.get();
        char.subrace.name = target.value;
        char = DndSheet.stores.characterActions._recalculateAll(char);
        DndSheet.stores.character.set(char);
    },
    'update-class': (target) => {
        const { index, field } = target.dataset;
        let char = DndSheet.stores.character.get();
        char = DndSheet.stores.characterActions.updateClass(char, { index, field, value: target.value });
        char = DndSheet.stores.characterActions._recalculateAll(char);
        DndSheet.stores.character.set(char);
    },
};