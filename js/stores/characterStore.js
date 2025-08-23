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
        this._character = DndSheet.helpers.getInitialState();
        DndSheet.stores.characterActions.applyRace();
        DndSheet.stores.characterActions._applyClassFeatures();
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
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            const baseRace = homebrewRaces[baseRaceName] || DndSheet.data.races[baseRaceName];

            if (baseRace) {
                if (!baseRace.subraces) {
                    baseRace.subraces = [];
                }
                const existingSubraceIndex = baseRace.subraces.findIndex(s => s.name === subraceData.name);
                if (existingSubraceIndex > -1) {
                    baseRace.subraces[existingSubraceIndex] = subraceData;
                } else {
                    baseRace.subraces.push(subraceData);
                }
                
                if (homebrewRaces[baseRaceName]) {
                     localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
                }
                
                DndSheet.data.races[baseRaceName] = baseRace;
                DndSheet.helpers.showMessage('Homebrew subrace saved!', 'green');
                this._notifySubscribers();
            } else {
                 DndSheet.helpers.showMessage(`Base race "${baseRaceName}" not found.`, 'red');
            }
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
            delete DndSheet.data.races[raceName];
            DndSheet.helpers.showMessage('Homebrew race deleted!', 'green');
            this._notifySubscribers();
        } catch (e) {
            console.error("Failed to delete homebrew race:", e);
            DndSheet.helpers.showMessage('Error deleting homebrew race.', 'red');
        }
    },

    deleteHomebrewSubrace: function(baseRaceName, subraceName) {
        try {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            const baseRace = homebrewRaces[baseRaceName] || DndSheet.data.races[baseRaceName];

            if (baseRace && baseRace.subraces) {
                const subraceIndex = baseRace.subraces.findIndex(s => s.name === subraceName);
                if (subraceIndex > -1) {
                    baseRace.subraces.splice(subraceIndex, 1);
                    if (homebrewRaces[baseRaceName]) {
                        localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
                    }
                    DndSheet.data.races[baseRaceName] = baseRace;
                    DndSheet.helpers.showMessage('Homebrew subrace deleted!', 'green');
                    this._notifySubscribers();
                }
            }
        } catch (e) {
            console.error("Failed to delete homebrew subrace:", e);
            DndSheet.helpers.showMessage('Error deleting homebrew subrace.', 'red');
        }
    }
};