// js/handlers/character-editor-handlers.js
DndSheet.handlers.characterEditorChangeHandlers = {
    'update-class': (target) => {
        const index = target.dataset.index;
        const field = target.dataset.field;
        const value = target.value;

        if (index !== undefined && field) {
            DndSheet.stores.characterActions.updateClass(index, field, value);
        }
    },
    'change-race': (target) => {
        const newRaceName = target.value;
        if (newRaceName) {
            DndSheet.stores.characterActions.handleRaceChange(newRaceName);
        }
    },
    'change-subrace': (target) => {
        const newSubraceName = target.value;
        DndSheet.stores.characterActions.applySubrace(newSubraceName);
    },
    // MODIFIED: Added this handler for the subclass dropdown
    'update-subclass': (target) => {
        const index = target.dataset.index;
        const subclassName = target.value;
        if (index !== undefined) {
            DndSheet.stores.characterActions.updateSubclass(index, subclassName);
        }
    }
};