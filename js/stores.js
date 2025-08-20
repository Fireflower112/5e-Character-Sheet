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
        const humanAbilityId = 'default-human-racial-bonus';
        const leatherArmorId = uuid();
        const shieldId = uuid();
        const shortswordId = uuid();

        const defaultState = {
            name: 'Valerius',
            race: '',
            subrace: '',
            class1: 'Fighter',
            class2: '',
            level1: 1,
            level2: 0,
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
                str: { base: 10, racial: 0, other: 0, override: 0 },
                dex: { base: 10, racial: 0, other: 0, override: 0 },
                con: { base: 10, racial: 0, other: 0, override: 0 },
                int: { base: 10, racial: 0, other: 0, override: 0 },
                wis: { base: 10, racial: 0, other: 0, override: 0 },
                cha: { base: 10, racial: 0, other: 0, override: 0 },
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
                    [leatherArmorId]: {
                        id: leatherArmorId, name: 'Leather Armor', itemType: 'armor', weight: 10,
                        acBase: 11, armorType: 'light', equippedSlot: null,
                    },
                    [shieldId]: {
                        id: shieldId, name: 'Shield', itemType: 'shield', weight: 6,
                        acBonus: 2, equippedSlot: null,
                    },
                    [shortswordId]: {
                        id: shortswordId, name: 'Shortsword', itemType: 'weapon', weight: 2,
                        numDice: 1, dieType: 6, properties: { finesse: true, light: true }, equippedSlot: null,
                    },
                },
                currency: { cp: 0, sp: 0, gp: 0 },
                containers: {}
            },
            feats: {},
            abilities: {},
            notes: {
                character: '', npcs: '', campaign: '', combat: ''
            },
            spellcasting: { 
                castingStat: 'int', 
                spellResistance: 0,
                spellSlots: Array(10).fill({ total: 0, used: 0 }),
            },
            spells: {},
            equippedItems: {},
        };
        
        const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
        window.dndData.races = { ...window.dndData.races, ...homebrewRaces };
        
        const savedCharacter = localStorage.getItem('pathfinderCharacterSheet');
        if (savedCharacter) {
            try {
                const parsed = JSON.parse(savedCharacter);
                const finalState = { ...defaultState, ...parsed };
                finalState.skills = { ...defaultState.skills, ...(parsed.skills || {}) };
                finalState.savingThrows = { ...defaultState.savingThrows, ...(parsed.savingThrows || {}) };
                finalState.abilityScores = { ...defaultState.abilityScores, ...(parsed.abilityScores || {}) };
                finalState.inventory = { ...defaultState.inventory, ...(parsed.inventory || {}) };
                finalState.abilities = { ...defaultState.abilities, ...(parsed.abilities || {}) };
                finalState.languages = Array.isArray(parsed.languages) ? parsed.languages : [parsed.languages || 'Common'];
                window.showMessage('Character loaded successfully!', 'green');
                return finalState;
            } catch (e) {
                console.error("Failed to parse saved character data:", e);
            }
        }
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

        saveHomebrewRace: (raceData) => {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            homebrewRaces[raceData.name] = raceData;
            localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
            
            window.dndData.races = { ...window.dndData.races, ...homebrewRaces };
            window.stores.character.applyRace(raceData.name);
            
            window.showMessage('Homebrew race saved!', 'green');
        },

        saveHomebrewSubrace: (baseRaceName, subraceData) => {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            const baseRace = homebrewRaces[baseRaceName] || window.dndData.races[baseRaceName];

            if (baseRace) {
                if (!baseRace.subraces) {
                    baseRace.subraces = [];
                }
                
                const existingSubraceIndex = baseRace.subraces.findIndex(sr => sr.name === subraceData.name);
                if (existingSubraceIndex > -1) {
                    baseRace.subraces[existingSubraceIndex] = subraceData;
                } else {
                    baseRace.subraces.push(subraceData);
                }
                
                homebrewRaces[baseRaceName] = baseRace;
                localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));

                window.dndData.races = { ...window.dndData.races, ...homebrewRaces };
                
                window.stores.character.applyRace(baseRaceName);
                window.stores.character.applySubrace(subraceData.name);
                
                window.showMessage('Homebrew subrace saved!', 'green');
            } else {
                window.showMessage(`Base race "${baseRaceName}" not found.`, 'red');
            }
        },
        
        deleteHomebrewRace: (raceName) => {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            delete homebrewRaces[raceName];
            localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
            window.stores.character.init();
            window.showMessage('Homebrew race deleted!', 'green');
        },
        deleteHomebrewSubrace: (baseRaceName, subraceName) => {
            const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
            const baseRace = homebrewRaces[baseRaceName];
            if (baseRace && baseRace.subraces) {
                baseRace.subraces = baseRace.subraces.filter(sr => sr.name !== subraceName);
                localStorage.setItem('homebrewRaces', JSON.stringify(homebrewRaces));
                window.stores.character.init();
                window.showMessage('Homebrew subrace deleted!', 'green');
            }
        },

        applyRace: (raceName) => {
            character.race = raceName;
            character.subrace = ''; 
            const newAbilities = { ...character.abilities };
            const newScores = { ...character.abilityScores };
            let newLanguages = ['Common'];

            for (const abilityId in newAbilities) {
                if (newAbilities[abilityId].source?.startsWith('Racial')) {
                    delete newAbilities[abilityId];
                }
            }
            for (const ability in newScores) {
                newScores[ability].racial = 0;
            }

            character.abilities = newAbilities;
            character.abilityScores = newScores;
            
            const raceData = window.dndData.races[raceName];
            if (!raceData) {
                character.languages = newLanguages;
                notifySubscribers();
                return;
            }

            if (raceData.languages) {
                const racialLangs = raceData.languages.split(',').map(l => l.trim());
                racialLangs.forEach(lang => {
                    if (!newLanguages.includes(lang)) newLanguages.push(lang);
                });
            }

            for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                if (newScores[stat]) {
                    newScores[stat].racial = (newScores[stat].racial || 0) + value;
                }
            }

            if (raceData.traits) {
                raceData.traits.forEach(trait => {
                    const newTrait = { ...trait, id: uuid(), source: 'Racial Trait' };
                    newAbilities[newTrait.id] = newTrait;
                });
            }

            character.abilities = newAbilities;
            character.abilityScores = newScores;
            character.languages = newLanguages;
            notifySubscribers();
        },

        applySubrace: (subraceName) => {
            character.subrace = subraceName;
            const raceData = window.dndData.races[character.race];
            if (!raceData || !raceData.subraces) return;

            const subraceData = raceData.subraces.find(sub => sub.name === subraceName);
            const newAbilities = { ...character.abilities };
            const newScores = { ...character.abilityScores };

            for (const abilityId in newAbilities) {
                if (newAbilities[abilityId].source === 'Racial Subrace Trait') {
                    delete newAbilities[abilityId];
                }
            }
            for (const ability in newScores) { newScores[ability].racial = 0; }
            for (const [stat, value] of Object.entries(raceData.abilityScoreIncrease)) {
                if (newScores[stat]) { newScores[stat].racial = value; }
            }
            
            if (subraceData) {
                for (const [stat, value] of Object.entries(subraceData.abilityScoreIncrease)) {
                    if (newScores[stat]) {
                        newScores[stat].racial = (newScores[stat].racial || 0) + value;
                    }
                }
                if (subraceData.traits) {
                    subraceData.traits.forEach(trait => {
                        const newTrait = { ...trait, id: uuid(), source: 'Racial Subrace Trait' };
                        newAbilities[newTrait.id] = newTrait;
                    });
                }
            }
            
            character.abilities = newAbilities;
            character.abilityScores = newScores;
            notifySubscribers();
        },
        
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