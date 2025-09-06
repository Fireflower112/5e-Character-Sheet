// js/handlers/header-handlers.js
DndSheet.handlers.headerClickHandlers = {
    'apply-healing': () => {
        const input = document.getElementById('hp-change-input');
        const amount = parseInt(input.value, 10);
        if (!isNaN(amount)) {
            DndSheet.stores.characterActions.applyHpChange(amount);
            input.value = ''; // Clear the input after applying
        }
    },
    'apply-damage': () => {
        const input = document.getElementById('hp-change-input');
        const amount = parseInt(input.value, 10);
        if (!isNaN(amount)) {
            // Pass a negative number for damage
            DndSheet.stores.characterActions.applyHpChange(-amount);
            input.value = ''; // Clear the input after applying
        }
    }
};

// We also need a change handler for the input fields
DndSheet.handlers.headerChangeHandlers = {
    'hp': (target) => {
        const value = target.value;
        DndSheet.stores.characterActions.updateCharacterProperty('hp', value);
    },
    'tempHp': (target) => {
        const value = target.value;
        DndSheet.stores.characterActions.updateCharacterProperty('tempHp', value);
    }
};