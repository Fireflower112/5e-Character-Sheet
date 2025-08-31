// js/handlers/event-listeners.js
(function() {
    const initialize = () => {
        const clickHandlers = {
            'save-character': () => DndSheet.stores.character.save(),
            'load-character': () => DndSheet.stores.character.load(),
            'sub-tab': (target) => DndSheet.app.setCurrentSubPage(target.dataset.subpage),
            ...DndSheet.handlers.characterEditorClickHandlers,
            ...DndSheet.handlers.dashboardClickHandlers,
            ...DndSheet.handlers.inventoryClickHandlers,
            // ... (add other click handlers here)
        };

        const changeHandlers = {
            ...DndSheet.handlers.characterEditorChangeHandlers,
            // ... (add other change handlers here)
        };

        document.body.addEventListener('click', (event) => {
            const target = event.target.closest('[data-action]');
            if (!target) return;
            const action = target.dataset.action;
            if (action.startsWith('nav-')) {
                DndSheet.app.setCurrentPage(action.substring(4));
            } else if (clickHandlers[action]) {
                clickHandlers[action](target);
            }
        });

        document.body.addEventListener('change', (event) => {
            const target = event.target.closest('[data-field], [data-action]');
            if (!target) return;
            const { action, field, subfield } = target.dataset;
            if (changeHandlers[action]) {
                changeHandlers[action](target);
            } else if (field) {
                let char = DndSheet.stores.character.get();
                const value = target.type === 'checkbox' ? target.checked : target.value;
                char = DndSheet.stores.characterActions.updateCharacterProperty(char, { field, value, subfield });
                if (field === 'hpRolls' || field === 'hpOverride' || subfield?.includes('con.')) {
                    char = DndSheet.stores.characterActions.recalculateMaxHp(char);
                }
                DndSheet.stores.character.set(char);
            }
        });
    };
    DndSheet.handlers.initialize = initialize;
})();