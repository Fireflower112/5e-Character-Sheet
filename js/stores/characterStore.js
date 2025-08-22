// js/stores/characterStore.js
window.stores = window.stores || {};

window.stores.character = {
    _character: {},
    _subscribers: [],

    get: function() {
        return JSON.parse(JSON.stringify(this._character));
    },

    set: function(newState) {
		console.log('%c STORE:', 'color: green; font-weight: bold;', 'Saving the following data:', newState);
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
            window.showMessage('Character saved successfully!', 'green');
        } catch (e) {
            console.error("Failed to save character:", e);
            window.showMessage('Error saving character.', 'red');
        }
    },

    load: function() {
        this._character = window.getInitialState();
        window.stores.characterActions.applyRace(this._character.race);
        window.stores.characterActions._applyClassFeatures();
        this._notifySubscribers();
    }
};