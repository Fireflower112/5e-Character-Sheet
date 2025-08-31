// js/stores/characterStore.js
DndSheet.stores.character = {
    _character: {},
    _subscribers: [],

    get: function() {
        return JSON.parse(JSON.stringify(this._character));
    },

    set: function(newState) {
        this._character = { ...this._character, ...newState };
        this._notifySubscribers();
    },
    
    init: function() {
        this.load();
    },

    subscribe: function(callback) {
        this._subscribers.push(callback);
    },

    update: function() {
        this._notifySubscribers();
    },

    _notifySubscribers: function() {
        this._subscribers.forEach(callback => callback());
    },

    save: function() {
        try {
            localStorage.setItem('pathfinderCharacterSheet', JSON.stringify(this._character));
            DndSheet.helpers.showMessage('Character saved successfully!', 'green');
        } catch (e) {
            console.error("Failed to save character:", e);
            DndSheet.helpers.showMessage('Error saving character.', 'red');
        }
    },

     load: function() {
        const savedCharacterJSON = localStorage.getItem('pathfinderCharacterSheet');
        
        if (savedCharacterJSON && savedCharacterJSON !== 'undefined' && savedCharacterJSON !== 'null') {
            try {
                this._character = JSON.parse(savedCharacterJSON);
            } catch (e) {
                this._character = JSON.parse(JSON.stringify(DndSheet.stores.defaultCharacter));
            }
        } else {
            this._character = JSON.parse(JSON.stringify(DndSheet.stores.defaultCharacter));
        }

        // --- Recalculate derived stats using the new one-way data flow ---
        this._character = DndSheet.stores.characterActions.applyRace(this._character);
        this._character = DndSheet.stores.characterActions._applyClassFeatures(this._character);
        this._character = DndSheet.stores.characterActions._calculateSpellSlots(this._character);
        
        this._notifySubscribers();
    },

    saveHomebrewRace: function(raceData) {
        try {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            homebrewRaces[raceData.name] = raceData;
            localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
            DndSheet.data.races[raceData.name] = raceData;
            DndSheet.helpers.showMessage('Homebrew race saved!', 'green');
            this._notifySubscribers();
        } catch (e) {
            console.error("Failed to save homebrew race:", e);
            DndSheet.helpers.showMessage('Error saving homebrew race.', 'red');
        }
    },

    saveHomebrewSubrace: function(baseRaceName, subraceData) {
        try {
            const homebrewSubraces = JSON.parse(localStorage.getItem('homebrewSubraces') || '{}');
            if (!homebrewSubraces[baseRaceName]) {
                homebrewSubraces[baseRaceName] = [];
            }

            const existingIndex = homebrewSubraces[baseRaceName].findIndex(s => s.name === subraceData.name);
            if (existingIndex > -1) {
                homebrewSubraces[baseRaceName][existingIndex] = subraceData;
            } else {
                homebrewSubraces[baseRaceName].push(subraceData);
            }

            localStorage.setItem('homebrewSubraces', JSON.stringify(homebrewSubraces));
            
            // This function needs to be defined globally or passed in to be used here
            // For now, let's assume it exists on DndSheet.app
            if(typeof DndSheet.app.loadHomebrewData === 'function') {
                DndSheet.app.loadHomebrewData();
            }

            DndSheet.helpers.showMessage('Homebrew subrace saved!', 'green');
            this._notifySubscribers();

        } catch (e) {
            console.error("Failed to save homebrew subrace:", e);
            DndSheet.helpers.showMessage('Error saving homebrew subrace.', 'red');
        }
    },

    deleteHomebrewRace: function(raceName) {
        try {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            delete homebrewRaces[raceName];
            localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
            
            if(typeof DndSheet.app.loadHomebrewData === 'function') {
                DndSheet.app.loadHomebrewData();
            }

            DndSheet.helpers.showMessage('Homebrew race deleted!', 'green');
            this._notifySubscribers();
        } catch (e) {
            console.error("Failed to delete homebrew race:", e);
            DndSheet.helpers.showMessage('Error deleting homebrew race.', 'red');
        }
    },

    deleteHomebrewSubrace: function(baseRaceName, subraceName) {
        try {
            const homebrewSubraces = JSON.parse(localStorage.getItem('homebrewSubraces') || '{}');
            if (homebrewSubraces[baseRaceName]) {
                homebrewSubraces[baseRaceName] = homebrewSubraces[baseRaceName].filter(s => s.name !== subraceName);
                if (homebrewSubraces[baseRaceName].length === 0) {
                    delete homebrewSubraces[baseRaceName];
                }
                localStorage.setItem('homebrewSubraces', JSON.stringify(homebrewSubraces));
            }
            
            if(typeof DndSheet.app.loadHomebrewData === 'function') {
                DndSheet.app.loadHomebrewData();
            }
            
            DndSheet.helpers.showMessage('Homebrew subrace deleted!', 'green');
            this._notifySubscribers();
        } catch (e) {
            console.error("Failed to delete homebrew subrace:", e);
            DndSheet.helpers.showMessage('Error deleting homebrew subrace.', 'red');
        }
    }
};