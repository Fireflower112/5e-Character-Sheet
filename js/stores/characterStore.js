// js/stores/characterStore.js
window.stores = window.stores || {};

window.stores.character = {
    _character: {},
    _subscribers: [],

    // Gets a SAFE, clean copy of the character data.
    get: function() {
        return JSON.parse(JSON.stringify(this._character));
    },

    // Merges new data into the character object and notifies the app of the change.
    set: function(newState) {
        // This merge order is the critical fix.
        this._character = { ...this._character, ...newState };
        this._notifySubscribers();
    },
    
    // Initializes the character when the app first loads.
    init: function() {
        this.load();
    },

    // Adds a function (like renderApp) to be called whenever the data changes.
    subscribe: function(callback) {
        this._subscribers.push(callback);
    },
    
    // Internal function to run all the subscriber functions.
    _notifySubscribers: function() {
        this._subscribers.forEach(callback => callback());
    },
    
    // Saves the current character state to the browser's local storage.
    save: function() {
        try {
            localStorage.setItem('pathfinderCharacterSheet', JSON.stringify(this._character));
            window.showMessage('Character saved successfully!', 'green');
        } catch (e) {
            console.error("Failed to save character:", e);
            window.showMessage('Error saving character.', 'red');
        }
    },

    // Loads the character from local storage, or creates a new one.
    load: function() {
        this._character = window.getInitialState(); // This loads from storage OR gets the default
        
        // Apply racial and class features to the initial state.
        window.stores.characterActions.applyRace(this._character.race);
        window.stores.characterActions._applyClassFeatures();

        // Notify the app to re-render with the newly loaded character.
        this._notifySubscribers();
    }
};