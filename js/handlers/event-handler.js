// js/handlers/event-handler.js

DndSheet.handlers.initialize = function() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;

    // A list of all objects that contain click handlers
    const clickHandlerObjects = [
        DndSheet.handlers.itemBrowserClickHandlers,
        DndSheet.handlers.containerBrowserClickHandlers,
        DndSheet.handlers.spellBrowserClickHandlers,
        DndSheet.handlers.inventoryClickHandlers,
        DndSheet.handlers.notesClickHandlers,
        DndSheet.handlers.homebrewClickHandlers,
        DndSheet.handlers.trackerClickHandlers,
        DndSheet.handlers.spellClickHandlers,
        DndSheet.handlers.headerClickHandlers // <-- This was missing
    ];

    // A list of all objects that contain change handlers
    const changeHandlerObjects = [
        DndSheet.handlers.inventoryChangeHandlers,
        DndSheet.handlers.notesChangeHandlers,
        DndSheet.handlers.homebrewChangeHandlers,
        DndSheet.handlers.characterEditorChangeHandlers,
        DndSheet.handlers.spellChangeHandlers,
        DndSheet.handlers.headerChangeHandlers // <-- This was missing
    ];

    // Main listener for CLICK events
    appContainer.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        
        if (action === 'toggle-accordion') {
            const wrapper = target.closest('[data-accordion-wrapper]');
            if (wrapper) {
                const details = wrapper.querySelector('.accordion-details');
                if (details) {
                    details.classList.toggle('hidden');
                }
            }
            return;
        }
        
        for (const handlerGroup of clickHandlerObjects) {
            if (handlerGroup && typeof handlerGroup[action] === 'function') {
                e.stopPropagation();
                handlerGroup[action](target, e);
                return;
            }
        }
    });

    // Main listener for CHANGE events
    appContainer.addEventListener('change', function(e) {
        const target = e.target; // Use target directly for inputs/selects
        
        // MODIFIED: This logic now checks for a data-field attribute,
        // which is better for handling direct data changes.
        const field = target.dataset.field; 
        const action = target.dataset.action;

        for (const handlerGroup of changeHandlerObjects) {
            // Check if the handler group exists and has a function for our specific action or field
            if (handlerGroup && typeof handlerGroup[action] === 'function') {
                e.stopPropagation();
                handlerGroup[action](target, e);
                return;
            }
            if (handlerGroup && typeof handlerGroup[field] === 'function') {
                e.stopPropagation();
                handlerGroup[field](target, e);
                return;
            }
        }
    });
};