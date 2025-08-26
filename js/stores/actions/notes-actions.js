// js/stores/actions/notes-actions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addNpc(npcData) {
        const character = store.get();
        const newNpc = { ...npcData, id: uuid() };
        const newNpcs = { ...character.notes.npcs, [newNpc.id]: newNpc };
        store.set({ notes: { ...character.notes, npcs: newNpcs } });
    }

    function deleteNpc(npcId) {
        const character = store.get();
        const newNpcs = { ...character.notes.npcs };
        delete newNpcs[npcId];
        store.set({ notes: { ...character.notes, npcs: newNpcs } });
    }
	
	function addSessionLogEntry(entryText) {
        const character = store.get();
        const newEntry = { 
            id: uuid(), 
            date: new Date().toLocaleDateString(), 
            text: entryText 
        };
        const newLog = [...character.notes.campaign.sessionLog, newEntry];
        const newCampaignNotes = { ...character.notes.campaign, sessionLog: newLog };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function deleteSessionLogEntry(entryId) {
        const character = store.get();
        const newLog = character.notes.campaign.sessionLog.filter(entry => entry.id !== entryId);
        const newCampaignNotes = { ...character.notes.campaign, sessionLog: newLog };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function addLocation(locationData) {
        const character = store.get();
        const newLocation = { ...locationData, id: uuid() };
        const newLocations = { ...character.notes.campaign.locations, [newLocation.id]: newLocation };
        const newCampaignNotes = { ...character.notes.campaign, locations: newLocations };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function deleteLocation(locationId) {
        const character = store.get();
        const newLocations = { ...character.notes.campaign.locations };
        delete newLocations[locationId];
        const newCampaignNotes = { ...character.notes.campaign, locations: newLocations };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function addRumor(rumorText) {
        const character = store.get();
        const newRumor = { 
            id: uuid(), 
            text: rumorText,
            status: 'Unverified'
        };
        const newRumors = [...character.notes.campaign.rumors, newRumor];
        const newCampaignNotes = { ...character.notes.campaign, rumors: newRumors };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function deleteRumor(rumorId) {
        const character = store.get();
        const newRumors = character.notes.campaign.rumors.filter(rumor => rumor.id !== rumorId);
        const newCampaignNotes = { ...character.notes.campaign, rumors: newRumors };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    function updateRumorStatus(rumorId, newStatus) {
        const character = store.get();
        const newRumors = character.notes.campaign.rumors.map(rumor => {
            if (rumor.id === rumorId) {
                return { ...rumor, status: newStatus };
            }
            return rumor;
        });
        const newCampaignNotes = { ...character.notes.campaign, rumors: newRumors };
        store.set({ notes: { ...character.notes, campaign: newCampaignNotes } });
    }

    Object.assign(actions, {
        addNpc,
        deleteNpc,
        addSessionLogEntry,
        deleteSessionLogEntry,
		addLocation,
        deleteLocation,
		addRumor,
        deleteRumor,
        updateRumorStatus,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);