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

    function _collectAllActiveBonuses() {
        const allBonuses = [];
        if (character.inventory && character.inventory.items) {
            for (const itemId in character.inventory.items) {
                const item = character.inventory.items[itemId];
                if ((item.equippedSlot || item.bonusesAlwaysActive) && item.bonuses) {
                    allBonuses.push(...item.bonuses);
                }
            }
        }
        if (character.abilities) {
            for (const abilityId in character.abilities) {
                const ability = character.abilities[abilityId];
                if (ability.bonuses) {
                    allBonuses.push(...ability.bonuses);
                }
            }
        }
        return allBonuses;
    }

    function processBonusesForAbility(ability) {
        const allBonuses = _collectAllActiveBonuses();
        let enhancement = 0;
        const overrides = [];
        for (const bonus of allBonuses) {
            if (bonus.field === ability) {
                if (bonus.type === 'override') {
                    overrides.push(parseInt(bonus.value, 10) || 0);
                } else {
                    enhancement += parseInt(bonus.value, 10) || 0;
                }
            }
        }
        return { enhancement, overrides };
    }

    function calculateBonusesForSkill(skillName) {
        const allBonuses = _collectAllActiveBonuses();
        let totalBonus = 0;
        for (const bonus of allBonuses) {
            if (bonus.field === skillName) {
                totalBonus += parseInt(bonus.value, 10) || 0;
            }
        }
        return totalBonus;
    }

    function calculateBonusesForField(fieldName) {
        const allBonuses = _collectAllActiveBonuses();
        let totalBonus = 0;
        for (const bonus of allBonuses) {
            if (bonus.field === fieldName) {
                totalBonus += parseInt(bonus.value, 10) || 0;
            }
        }
        return totalBonus;
    }

    function calculateItemBonusesForAbility(ability) {
        let enhancement = 0;
        if (character.inventory && character.inventory.items) {
            for (const itemId in character.inventory.items) {
                const item = character.inventory.items[itemId];
                if ((item.equippedSlot || item.bonusesAlwaysActive) && item.bonuses) {
                    for (const bonus of item.bonuses) {
                        if (bonus.field === ability && bonus.type !== 'override') {
                            enhancement += parseInt(bonus.value, 10) || 0;
                        }
                    }
                }
            }
        }
        return enhancement;
    }

    function calculateAbilityBonusesForAbility(ability) {
        let enhancement = 0;
        if (character.abilities) {
            for (const abilityId in character.abilities) {
                const charAbility = character.abilities[abilityId];
                if (charAbility.type === 'Racial' && charAbility.bonuses) {
                    for (const bonus of charAbility.bonuses) {
                        if (bonus.field === ability && bonus.type !== 'override') {
                            enhancement += parseInt(bonus.value, 10) || 0;
                        }
                    }
                }
            }
        }
        return enhancement;
    }

    function calculateItemBonusesForSkill(skillName) {
        let totalBonus = 0;
        if (character.inventory && character.inventory.items) {
             for (const itemId in character.inventory.items) {
                const item = character.inventory.items[itemId];
                if ((item.equippedSlot || item.bonusesAlwaysActive) && item.bonuses) {
                    for (const bonus of item.bonuses) {
                        if (bonus.field === skillName) {
                            totalBonus += parseInt(bonus.value, 10) || 0;
                        }
                    }
                }
            }
        }
        return totalBonus;
    }

    function calculateRacialAbilityBonusesForSkill(skillName) {
        let totalBonus = 0;
        if (character.abilities) {
            for (const abilityId in character.abilities) {
                const ability = character.abilities[abilityId];
                if (ability.type === 'Racial' && ability.bonuses) {
                    for (const bonus of ability.bonuses) {
                         if (bonus.field === skillName) {
                            totalBonus += parseInt(bonus.value, 10) || 0;
                        }
                    }
                }
            }
        }
        return totalBonus;
    }

    function calculateACBonuses() {
        let armorBonus = 0;
        let shieldBonus = 0;
        if (!character.equippedItems) return { armorBonus: 0, shieldBonus: 0 };
        for (const itemId in character.equippedItems) {
            const item = character.equippedItems[itemId];
            if (item.itemType === 'armor') {
                armorBonus += parseInt(item.acBonus, 10) || 0;
            } else if (item.itemType === 'shield') {
                shieldBonus += parseInt(item.acBonus, 10) || 0;
            }
        }
        return { armorBonus, shieldBonus };
    }

    function getInitialState() {
        const humanAbilityId = 'default-human-racial-bonus';
        const leatherArmorId = uuid();
        const shieldId = uuid();
        const shortswordId = uuid();

        const defaultState = {
            name: 'Valerius',
            race: 'Human',
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
            abilities: {
                [humanAbilityId]: {
                    id: humanAbilityId, name: 'Human Ability Score Increase', type: 'Racial',
                    description: 'One ability score of your choice increases by 1.',
                    bonuses: [{ field: 'str', value: 1, type: 'enhancement' }]
                }
            },
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

        applyRace: (raceName) => {
            character.race = raceName;
            character.subrace = ''; 
            const newAbilities = { ...character.abilities };
            const newScores = { ...character.abilityScores };

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
                notifySubscribers();
                return;
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

        addItem: (itemData) => {
            const newItemId = uuid();
            const newItem = { id: newItemId, ...itemData, equippedSlot: null, favorited: false, containerId: null };
            newItem.bonusesAlwaysActive = (itemData.itemType === 'other');
            if(!character.inventory.items) character.inventory.items = {};
            character.inventory.items[newItemId] = newItem;
            notifySubscribers();
        },
        addContainer: (containerData) => {
            const newContainerId = uuid();
            const newContainer = { id: newContainerId, ...containerData };
            if (!character.inventory.containers) character.inventory.containers = {};
            character.inventory.containers[newContainerId] = newContainer;
            notifySubscribers();
        },
        assignItemToContainer: (itemId, containerId) => {
            const item = character.inventory.items[itemId];
            if (item) {
                item.containerId = (containerId === 'none' || !containerId) ? null : containerId;
                notifySubscribers();
            }
        },
        updateItem: (itemId, updates) => {
            if (character.inventory.items[itemId]) {
                Object.assign(character.inventory.items[itemId], updates);
                notifySubscribers();
            }
        },
        equipItemToSlot: (itemId, slot) => {
            const items = character.inventory.items;
            const targetItem = items[itemId];
            if (!targetItem) return;
            const newSlot = (slot === 'none' || !slot) ? null : slot;

            if (newSlot) {
                targetItem.containerId = null; 
                for (const otherItemId in items) {
                    if (otherItemId !== itemId && items[otherItemId].equippedSlot === newSlot) {
                        items[otherItemId].equippedSlot = null;
                    }
                }
            }
            if (targetItem.itemType === 'armor' && newSlot && newSlot !== 'Armor') {
                window.showMessage('Armor can only be equipped to the Armor slot.', 'red');
                return;
            }
            if (targetItem.itemType === 'shield' && newSlot && newSlot !== 'Shield') {
                window.showMessage('Shields can only be equipped to the Shield slot.', 'red');
                return;
            }

            targetItem.equippedSlot = newSlot;
            _syncEquippedItems();
            notifySubscribers();
        },
        toggleFavorite: (itemId) => {
            if (character.inventory.items[itemId]) {
                character.inventory.items[itemId].favorited = !character.inventory.items[itemId].favorited;
                notifySubscribers();
            }
        },
        deleteItem: (itemId) => {
            if (character.inventory.items[itemId]) {
                delete character.inventory.items[itemId];
                _syncEquippedItems();
                notifySubscribers();
            }
        },
        addSpell: (spellData) => {
            const newSpellId = uuid();
            const newSpell = { id: newSpellId, ...spellData, favorited: false };
            if (!character.spells) character.spells = {};
            character.spells[newSpellId] = newSpell;
            notifySubscribers();
        },
        deleteSpell: (spellId) => {
            if (character.spells?.[spellId]) {
                delete character.spells[spellId];
                notifySubscribers();
            }
        },
        toggleFavoriteSpell: (spellId) => {
            if (character.spells?.[spellId]) {
                character.spells[spellId].favorited = !character.spells[spellId].favorited;
                notifySubscribers();
            }
        },
        updateSpellSlot: (level, type, value) => {
            const parsedLevel = parseInt(level, 10);
            const parsedValue = parseInt(value, 10) || 0;
            if (character.spellcasting.spellSlots[parsedLevel]) {
                const newSlots = [...character.spellcasting.spellSlots];
                newSlots[parsedLevel] = { ...newSlots[parsedLevel], [type]: parsedValue };
                character.spellcasting.spellSlots = newSlots;
                notifySubscribers();
            }
        },
        addAbility: (abilityData) => {
            const newAbilityId = uuid();
            const newAbility = { id: newAbilityId, ...abilityData };
            if (!character.abilities) character.abilities = {};
            character.abilities[newAbilityId] = newAbility;
            notifySubscribers();
        },
        deleteAbility: (abilityId) => {
            if (character.abilities?.[abilityId]) {
                delete character.abilities[abilityId];
                notifySubscribers();
            }
        },
        
        processBonusesForAbility,
        calculateBonusesForField,
        calculateBonusesForSkill,
        calculateACBonuses,
        calculateItemBonusesForAbility,
        calculateAbilityBonusesForAbility,
        calculateItemBonusesForSkill,
        calculateRacialAbilityBonusesForSkill,
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