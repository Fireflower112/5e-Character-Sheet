// js/handlers/dashboard-handlers.js
DndSheet.handlers.dashboardClickHandlers = {
    'apply-healing': () => {
        const input = document.getElementById('hp-change-input');
        const amount = parseInt(input.value, 10);
        if (!isNaN(amount)) {
            let char = DndSheet.stores.character.get();
            char = DndSheet.stores.characterActions.applyHpChange(char, amount);
            DndSheet.stores.character.set(char);
            input.value = '';
        }
    },
    'apply-damage': () => {
        const input = document.getElementById('hp-change-input');
        const amount = parseInt(input.value, 10);
        if (!isNaN(amount)) {
            let char = DndSheet.stores.character.get();
            char = DndSheet.stores.characterActions.applyHpChange(char, -amount);
            DndSheet.stores.character.set(char);
            input.value = '';
        }
    }
};