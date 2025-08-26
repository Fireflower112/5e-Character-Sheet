// js/handlers/notes-handlers.js

DndSheet.handlers.notesClickHandlers = {
    'add-npc': () => {
        const npcData = {
            name: document.getElementById('npc-name').value,
            race: document.getElementById('npc-race').value,
            class: document.getElementById('npc-class').value,
            description: document.getElementById('npc-description').value,
        };
        if (npcData.name && npcData.race) {
            DndSheet.stores.characterActions.addNpc(npcData);
            ['npc-name', 'npc-race', 'npc-class', 'npc-description'].forEach(id => document.getElementById(id).value = '');
        } else { DndSheet.helpers.showMessage('NPC Name and Race are required.', 'red'); }
    },
    'delete-npc': (target) => {
        const npcId = target.dataset.npcId;
        if (npcId) DndSheet.stores.characterActions.deleteNpc(npcId);
    },
    'add-session-log': () => {
        const input = document.getElementById('session-log-input');
        if (input.value) {
            DndSheet.stores.characterActions.addSessionLogEntry(input.value);
            input.value = '';
        } else { DndSheet.helpers.showMessage('Session entry cannot be empty.', 'red'); }
    },
    'delete-session-log': (target) => {
        const entryId = target.dataset.entryId;
        if (entryId) DndSheet.stores.characterActions.deleteSessionLogEntry(entryId);
    },
    'add-location': () => {
        const locationData = { name: document.getElementById('location-name').value, description: document.getElementById('location-description').value, inhabitants: document.getElementById('location-inhabitants').value, other: document.getElementById('location-other').value };
        if (locationData.name) {
            DndSheet.stores.characterActions.addLocation(locationData);
             ['location-name', 'location-description', 'location-inhabitants', 'location-other'].forEach(id => document.getElementById(id).value = '');
        } else { DndSheet.helpers.showMessage('Location Name is required.', 'red'); }
    },
    'delete-location': (target) => {
        const locationId = target.dataset.locationId;
        if (locationId) DndSheet.stores.characterActions.deleteLocation(locationId);
    },
    'add-rumor': () => {
        const input = document.getElementById('rumor-input');
        if (input.value) {
            DndSheet.stores.characterActions.addRumor(input.value);
            input.value = '';
        } else { DndSheet.helpers.showMessage('Rumor cannot be empty.', 'red'); }
    },
    'delete-rumor': (target) => {
        const rumorId = target.dataset.rumorId;
        if (rumorId) DndSheet.stores.characterActions.deleteRumor(rumorId);
    },
    'update-rumor-status': (target) => {
        const { rumorId, status } = target.dataset;
        if (rumorId && status) DndSheet.stores.characterActions.updateRumorStatus(rumorId, status);
    },
};

// No note-specific change handlers yet, but we create the object for consistency
DndSheet.handlers.notesChangeHandlers = {};