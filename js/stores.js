// js/stores.js
window.stores = {};

window.stores.character = (function() {
    let character = {};
    let subscribers = [];

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // --- START DEBUG: Easy-to-delete randomization feature ---
    /**
     * Simulates rolling 4 six-sided dice and dropping the lowest roll.
     * @returns {number} The sum of the three highest rolls.
     */
    function _generateAbilityScore() {
        const rolls = [];
        for (let i = 0; i < 4; i++) {
            // Generate a random number between 1 and 6
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        // Sort in ascending order and remove the first (lowest) element
        rolls.sort((a, b) => a - b).shift();
        // Sum the remaining three dice
        return rolls.reduce((sum, roll) => sum + roll, 0);
    }
    // --- END DEBUG ---

    function _syncEquippedItems() {
        const newEquippedItems = {};
        if (!character.inventory || !character.inventory.items) return;
        for (const itemId in character.inventory.items) {
            const item = character.inventory.items[itemId];
            if (item.equippedSlot) {
                newEquippedItems[itemId] = item;
            }
        }
        character.equippedItems = newEquippedItems;
    }

    function getInitialState() {
        const savedCharacter = localStorage.getItem('pathfinderCharacterSheet');
        
        // --- This block defines the default structure and is used for merging ---
        const leatherArmorId = uuid();
        const shieldId = uuid();
        const shortswordId = uuid();
        const defaultState = {
            name: 'Valerius',
            race: '',
            subrace: '',
            classes: [{ name: 'Fighter', level: 1 }],
            alignment: 'Lawful Good',
            size: 'Medium',
            experience: { current: 0, toNext: 300 },
            hp: 10,
            maxHp: 10,
            tempHp: 0,
            proficiencyBonus: 2,
            languages: ['Common'],
            armorClassComponents: { base: 10, naturalArmor: 0, deflection: 0, dodge: 0, override: 0 },
            initiative: { other: 0 },
            speed: { land: 30 },
            abilityScores: {
                str: { base: 10, racial: 0, other: 0 },
                dex: { base: 10, racial: 0, other: 0 },
                con: { base: 10, racial: 0, other: 0 },
                int: { base: 10, racial: 0, other: 0 },
                wis: { base: 10, racial: 0, other: 0 },
                cha: { base: 10, racial: 0, other: 0 },
            },
            savingThrows: {
                str: { proficient: false },
                dex: { proficient: false },
                con: { proficient: false },
                int: { proficient: false },
                wis: { proficient: false },
                cha: { proficient: false },
            },
            skills: {
                acrobatics: { ability: 'dex', proficient: false, expertise: false },
                animalHandling: { ability: 'wis', proficient: false, expertise: false },
                arcana: { ability: 'int', proficient: false, expertise: false },
                athletics: { ability: 'str', proficient: false, expertise: false },
                deception: { ability: 'cha', proficient: false, expertise: false },
                history: { ability: 'int', proficient: false, expertise: false },
                insight: { ability: 'wis', proficient: false, expertise: false },
                intimidation: { ability: 'cha', proficient: false, expertise: false },
                investigation: { ability: 'int', proficient: false, expertise: false },
                medicine: { ability: 'wis', proficient: false, expertise: false },
                nature: { ability: 'int', proficient: false, expertise: false },
                perception: { ability: 'wis', proficient: false, expertise: false },
                performance: { ability: 'cha', proficient: false, expertise: false },
                persuasion: { ability: 'cha', proficient: false, expertise: false },
                religion: { ability: 'int', proficient: false, expertise: false },
                sleightOfHand: { ability: 'dex', proficient: false, expertise: false },
                stealth: { ability: 'dex', proficient: false, expertise: false },
                survival: { ability: 'wis', proficient: false, expertise: false },
            },
            inventory: {
                items: {
                    [leatherArmorId]: { id: leatherArmorId, name: 'Leather Armor', itemType: 'armor', weight: 10, acBase: 11, armorType: 'light', equippedSlot: null },
                    [shieldId]: { id: shieldId, name: 'Shield', itemType: 'shield', weight: 6, acBonus: 2, equippedSlot: null },
                    [shortswordId]: { id: shortswordId, name: 'Shortsword', itemType: 'weapon', weight: 2, numDice: 1, dieType: 6, properties: { finesse: true, light: true }, equippedSlot: null },
                },
                currency: { cp: 0, sp: 0, gp: 0 },
                containers: {}
            },
            feats: {},
            abilities: {},
            notes: { character: '', npcs: '', campaign: '', combat: '' },
            spellcasting: { castingStat: 'int', spellResistance: 0, spellSlots: Array(10).fill({ total: 0, used: 0 }) },
            spells: {},
            equippedItems: {},
        };


        if (savedCharacter) {
            try {
                const parsed = JSON.parse(savedCharacter);
                // Deep merge saved data onto a fresh default state to ensure all properties exist
                const finalState = { ...defaultState, ...parsed };
                finalState.abilityScores = { ...defaultState.abilityScores, ...(parsed.abilityScores || {}) };
                finalState.skills = { ...defaultState.skills, ...(parsed.skills || {}) };
                finalState.savingThrows = { ...defaultState.savingThrows, ...(parsed.savingThrows || {}) };
                finalState.inventory = { ...defaultState.inventory, ...(parsed.inventory || {}) };
                finalState.classes = Array.isArray(parsed.classes) && parsed.classes.length > 0 ? parsed.classes : defaultState.classes;
                window.showMessage('Character loaded successfully!', 'green');
                return finalState;
            } catch (e) {
                console.error("Failed to parse saved character data:", e);
                // Fall through to create a new character if parsing fails
            }
        }
        
        // --- START DEBUG: Easy-to-delete randomization feature ---
        // This block randomizes scores for a new character session.
        for (const ability in defaultState.abilityScores) {
            defaultState.abilityScores[ability].base = _generateAbilityScore();
        }
        // --- END DEBUG ---
        
        return defaultState;
    }

    function notifySubscribers() {
        subscribers.forEach(callback => callback(character));
    }

    return {
        get: () => character,
        set: (newState) => {
            character = { ...character, ...newState };
            _syncEquippedItems();
            notifySubscribers();
        },
        init: () => {
            character = getInitialState();
            _syncEquippedItems();
            notifySubscribers();
        },
        subscribe: (callback) => subscribers.push(callback),
        
        updateCharacterProperty: (field, value, subField) => {
            const newValue = isNaN(parseInt(value, 10)) || !isFinite(value) ? value : parseInt(value, 10);
            if (field) {
                 if (subField) {
                    if (!character[field]) character[field] = {};
                    if (subField.includes('.')) {
                        const [key, subKey] = subField.split('.');
                        if (!character[field][key]) character[field][key] = {};
                        character[field][key][subKey] = newValue;
                    } else {
                        character[field][subField] = newValue;
                    }
                } else {
                    character[field] = newValue;
                }
            }
        },
        
        addLanguage: (language) => {
            const lang = language.trim();
            if (lang && !character.languages.includes(lang)) {
                character.languages.push(lang);
                notifySubscribers();
            }
        },
        removeLanguage: (language) => {
            character.languages = character.languages.filter(l => l !== language);
            notifySubscribers();
        },

        saveHomebrewRace: (raceData) => { /* ... unchanged ... */ },
        saveHomebrewSubrace: (baseRaceName, subraceData) => { /* ... unchanged ... */ },
        deleteHomebrewRace: (raceName) => { /* ... unchanged ... */ },
        deleteHomebrewSubrace: (baseRaceName, subraceName) => { /* ... unchanged ... */ },
        applyRace: (raceName) => { /* ... unchanged ... */ },
        applySubrace: (subraceName) => { /* ... unchanged ... */ },
        addItem: (itemData) => { /* ... unchanged ... */ },
        addContainer: (containerData) => { /* ... unchanged ... */ },
        assignItemToContainer: (itemId, containerId) => { /* ... unchanged ... */ },
        updateItem: (itemId, updates) => { /* ... unchanged ... */ },
        equipItemToSlot: (itemId, slot) => { /* ... unchanged ... */ },
        toggleFavorite: (itemId) => { /* ... unchanged ... */ },
        deleteItem: (itemId) => { /* ... unchanged ... */ },
        addSpell: (spellData) => { /* ... unchanged ... */ },
        deleteSpell: (spellId) => { /* ... unchanged ... */ },
        toggleFavoriteSpell: (spellId) => { /* ... unchanged ... */ },
        updateSpellSlot: (level, type, value) => { /* ... unchanged ... */ },
        addAbility: (abilityData) => { /* ... unchanged ... */ },
        deleteAbility: (abilityId) => { /* ... unchanged ... */ },
        
        addClass: () => {
            if (!character.classes) character.classes = [];
            character.classes.push({ name: '', level: 1 });
            notifySubscribers();
        },
        updateClass: (index, field, value) => {
            if (character.classes && character.classes[index]) {
                const isLevel = field === 'level';
                const parsedValue = isLevel ? parseInt(value, 10) : value;
                character.classes[index][field] = isLevel ? (isNaN(parsedValue) ? 0 : parsedValue) : value;
                notifySubscribers();
            }
        },
        removeClass: (index) => {
            if (character.classes && character.classes[index]) {
                character.classes.splice(index, 1);
                notifySubscribers();
            }
        },
    };
})();

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

window.updateCharacterInfo = (field, value, subField) => {
    const newCharacter = { ...window.stores.character.get() };
    const newValue = isNaN(parseInt(value, 10)) || !isFinite(value) ? value : parseInt(value, 10);

    if (subField) {
        if (!newCharacter[field]) newCharacter[field] = {};
        if (subField.includes('.')) {
            const [key, subKey] = subField.split('.');
            if (!newCharacter[field][key]) newCharacter[field][key] = {};
            newCharacter[field][key][subKey] = newValue;
        } else {
            newCharacter[field][subField] = newValue;
        }
    } else {
        newCharacter[field] = newValue;
    }
    window.stores.character.set(newCharacter);
};