// js/stores/characterStore.js
window.stores = window.stores || {};

window.stores.character = (function() {
    let character = {};
    let subscribers = [];

    function notifySubscribers() {
        subscribers.forEach(callback => callback(character));
    }

    return {
        get: () => character,
        set: (newState) => {
            character = { ...character, ...newState };
            notifySubscribers();
        },
        init: () => {
            character = window.getInitialState();
            window.stores.characterActions.applyRace(character.race);
            window.stores.characterActions._applyClassFeatures();
            notifySubscribers();
        },
        subscribe: (callback) => subscribers.push(callback),
    };
})();

// Global helper functions
window.handleSave = () => {
    localStorage.setItem('pathfinderCharacterSheet', JSON.stringify(window.stores.character.get()));
    window.showMessage('Character saved!', 'green');
};

window.handleLoad = () => {
    window.stores.character.init();
};

window.showMessage = (message, type) => {
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = message;
    msgBox.className = `message-box show bg-${type}-500`;
    setTimeout(() => msgBox.classList.remove('show'), 3000);
};