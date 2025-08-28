// js/handlers/tracker-handlers.js

DndSheet.handlers.trackerClickHandlers = {
    'add-timer': () => {
        const nameInput = document.getElementById('timer-name');
        const durationInput = document.getElementById('timer-duration');
        const unitSelect = document.getElementById('timer-unit');

        if (nameInput.value && durationInput.value) {
            const timerData = {
                name: nameInput.value,
                duration: durationInput.value,
                unit: unitSelect.value,
            };
            DndSheet.stores.characterActions.addTimer(timerData);
            // Clear the form
            nameInput.value = '';
            durationInput.value = '';
        } else {
            DndSheet.helpers.showMessage('Timer needs a name and duration.', 'red');
        }
    },
    'delete-timer': (target) => {
        const timerId = target.dataset.timerId;
        if (timerId) {
            DndSheet.stores.characterActions.deleteTimer(timerId);
        }
    },
    // MODIFIED: This handler is now unit-aware
    'decrement-timer': (target) => {
        const { timerId, timerUnit } = target.dataset;
        if (timerId) {
            const amount = (timerUnit === 'Minutes') ? -0.1 : -1;
            DndSheet.stores.characterActions.updateTimerDuration(timerId, amount);
        }
    },
	'next-turn': () => {
        DndSheet.stores.characterActions.nextTurn();
    },
};