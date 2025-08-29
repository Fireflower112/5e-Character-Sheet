// js/stores/actions/trackerActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addTimer(timerData) {
        const character = store.get();
        const newTimer = {
            id: uuid(),
            name: timerData.name,
            duration: parseInt(timerData.duration, 10) || 0,
            unit: timerData.unit,
        };
        const newTimers = [...character.activeTimers, newTimer];
		const timer = { id: uuid(), name, description, duration, unit };
        store.set({ activeTimers: newTimers });
    }

    function deleteTimer(timerId) {
        const character = store.get();
        const newTimers = character.activeTimers.filter(t => t.id !== timerId);
        store.set({ activeTimers: newTimers });
    }

    function updateTimerDuration(timerId, amount) {
        const character = store.get();
        const newTimers = character.activeTimers.map(timer => {
            if (timer.id === timerId) {
                let newDuration = timer.duration + amount;
                // MODIFIED: Add rounding for floating point numbers
                if (amount % 1 !== 0) {
                    newDuration = parseFloat(newDuration.toFixed(1));
                }
                return { ...timer, duration: Math.max(0, newDuration) };
            }
            return timer;
        });
        store.set({ activeTimers: newTimers });
    }

     function nextTurn() {
        const character = store.get();
        let didUpdate = false;
        const expiredTimers = [];

        const newTimers = character.activeTimers.map(timer => {
            if (timer.unit === 'Rounds' && timer.duration > 0) {
                didUpdate = true;
                const newDuration = timer.duration - 1;
                if (newDuration === 0) {
                    expiredTimers.push(timer.name);
                }
                return { ...timer, duration: newDuration };
            } 
            // ADDED: New logic for minute-based timers
            else if (timer.unit === 'Minutes' && timer.duration > 0) {
                didUpdate = true;
                // Subtract 0.1 minutes (6 seconds) and round to one decimal place
                const newDuration = parseFloat((timer.duration - 0.1).toFixed(1));
                if (newDuration <= 0) {
                    expiredTimers.push(timer.name);
                }
                return { ...timer, duration: newDuration };
            }
            return timer;
        });

        if (didUpdate) {
            store.set({ activeTimers: newTimers });
            if (expiredTimers.length > 0) {
                DndSheet.helpers.showMessage(`Effect ended: ${expiredTimers.join(', ')}`, 'blue');
            }
        }
    }

    Object.assign(actions, {
        addTimer,
        deleteTimer,
        updateTimerDuration,
        nextTurn,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);