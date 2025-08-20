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
        const backpackId = uuid();
        const bagOfHoldingId = uuid();
        const bouncyBallId = uuid();
        const shortSwordId = uuid();
        const beltId = uuid();
        const leatherArmorId = uuid();
        const shieldId = uuid();
        const humanAbilityId = 'default-human-racial-bonus';

        const defaultState = {
            name: 'Valerius',
            race: 'Human',
            class1: 'Fighter',
            class2: '',
            level1: 1,
            level2: 0,
            alignment: 'Lawful Good',
            size: 'Medium',
            experience: { current: 0, toNext: 1000 },
            hp: 10,
            maxHp: 10,
            tempHp: 0,
            baseAttackBonus: 1,
            armorClassComponents: { base: 10, naturalArmor: 0, deflection: 0, dodge: 0, override: 0 },
            initiative: { other: 0 },
            speed: { land: 30 },
            abilityScores: {
                str: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
                dex: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
                con: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
                int: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
                wis: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
                cha: { base: 10, racial: 0, feat: 0, status: 0, override: 0 },
            },
            savingThrows: { fortitude: { base: 0, other: 0 }, reflex: { base: 0, other: 0 }, will: { base: 0, other: 0 } },
            skills: {
                acrobatics: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                appraise: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                bluff: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                climb: { ability: 'str', ranks: 0, racial: 0, feat: 0, misc: 0 },
                diplomacy: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                disableDevice: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                disguise: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                escapeArtist: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                fly: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                handleAnimal: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                heal: { ability: 'wis', ranks: 0, racial: 0, feat: 0, misc: 0 },
                intimidate: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeArcana: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeDungeoneering: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeEngineering: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeGeography: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeHistory: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeLocal: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeNature: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeNobility: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgePlanes: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                knowledgeReligion: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                linguistics: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                perception: { ability: 'wis', ranks: 0, racial: 0, feat: 0, misc: 0 },
                perform: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
                profession: { ability: 'wis', ranks: 0, racial: 0, feat: 0, misc: 0 },
                ride: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                senseMotive: { ability: 'wis', ranks: 0, racial: 0, feat: 0, misc: 0 },
                sleightOfHand: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                spellcraft: { ability: 'int', ranks: 0, racial: 0, feat: 0, misc: 0 },
                stealth: { ability: 'dex', ranks: 0, racial: 0, feat: 0, misc: 0 },
                survival: { ability: 'wis', ranks: 0, racial: 0, feat: 0, misc: 0 },
                swim: { ability: 'str', ranks: 0, racial: 0, feat: 0, misc: 0 },
                useMagicDevice: { ability: 'cha', ranks: 0, racial: 0, feat: 0, misc: 0 },
            },
            inventory: {
                items: {
                    [bouncyBallId]: {
                        id: bouncyBallId, name: 'Bouncy Ball', itemType: 'other', weight: 0.2,
                        description: 'A super bouncy ball.',
                        bonuses: [{ field: 'acrobatics', value: 20, type: 'enhancement' }],
                        equippedSlot: null, favorited: false, containerId: null, bonusesAlwaysActive: true
                    },
                    [shortSwordId]: {
                        id: shortSwordId, name: 'Short Sword', itemType: 'weapon', weight: 5,
                        description: 'A standard short sword.',
                        bonuses: [],
                        numDice: 1, dieType: 4, range: 0, critMultiplier: 2,
                        equippedSlot: null, favorited: false, containerId: null
                    },
                    [beltId]: {
                        id: beltId, name: 'Belt of Giant Strength', itemType: 'wearable', weight: 10,
                        description: 'This belt grants the wearer immense strength.',
                        bonuses: [{ field: 'str', value: 16, type: 'enhancement' }],
                        equippedSlot: null, favorited: false, containerId: null
                    },
                    [leatherArmorId]: {
                        id: leatherArmorId, name: 'Leather Armor', itemType: 'armor', weight: 40,
                        description: 'A suit of hardened leather armor.',
                        armorType: 'medium', acBonus: 3,
                        equippedSlot: null, favorited: false, containerId: null
                    },
                    [shieldId]: {
                        id: shieldId, name: 'Heavy Steel Shield', itemType: 'shield', weight: 20,
                        description: 'A sturdy steel shield.',
                        acBonus: 2,
                        equippedSlot: null, favorited: false, containerId: null
                    }
                },
                currency: { cp: 0, sp: 0, gp: 0 },
                containers: {
                    [backpackId]: {
                        id: backpackId, name: 'Backpack',
                        description: 'A standard adventurer\'s backpack.',
                        capacity: 50, weight: 2
                    },
                    [bagOfHoldingId]: {
                        id: bagOfHoldingId, name: 'Bag of Holding',
                        description: 'This bag appears to be a common cloth sack of about 2 feet by 4 feet in size.',
                        capacity: 200, weight: 20
                    }
                }
            },
            feats: {},
            abilities: {
                [humanAbilityId]: {
                    id: humanAbilityId,
                    name: 'Human Racial Bonus', 
                    type: 'Racial',
                    description: 'Humans select one ability score to increase by 2 at creation to represent their varied nature.',
                    bonuses: [{ field: 'str', value: 2, type: 'enhancement' }]
                }
            },
            notes: {
                character: '',
                npcs: '',
                campaign: '',
                combat: ''
            },
            spellcasting: { 
                castingStat: 'int', 
                spellResistance: 0,
                spellSlots: Array(10).fill({ total: 0, used: 0 }),
            },
            spells: {},
            equippedItems: {},
        };
        
        const savedCharacter = localStorage.getItem('pathfinderCharacterSheet');
        if (savedCharacter) {
            try {
                const parsed = JSON.parse(savedCharacter);
                
                if (parsed.inventory) {
                    parsed.inventory = { ...defaultState.inventory, ...parsed.inventory };
                }
                parsed.abilities = { ...(defaultState.abilities || {}), ...(parsed.abilities || {}) };

                const finalState = { ...defaultState, ...parsed };
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