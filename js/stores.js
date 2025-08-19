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
            if (item.equipped) {
                newEquippedItems[itemId] = item;
            }
        }
        character.equippedItems = newEquippedItems;
    }
    
    function calculateItemBonusesForAbility(ability) {
        let totalBonus = 0;
        if (!character.equippedItems) return 0;
        for (const itemId in character.equippedItems) {
            const item = character.equippedItems[itemId];
            if (item.bonuses) {
                for (const bonus of item.bonuses) {
                    if (bonus.field === ability) {
                        totalBonus += parseInt(bonus.value, 10) || 0;
                    }
                }
            }
        }
        return totalBonus;
    }

    function calculateItemBonusesForField(fieldName) {
        let totalBonus = 0;
        if (!character.equippedItems) return 0;
        for (const itemId in character.equippedItems) {
            const item = character.equippedItems[itemId];
            if (item.bonuses) {
                for (const bonus of item.bonuses) {
                    if (bonus.field === fieldName) {
                        totalBonus += parseInt(bonus.value, 10) || 0;
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
        const savedCharacter = localStorage.getItem('pathfinderCharacterSheet');
        if (savedCharacter) {
            try {
                const parsed = JSON.parse(savedCharacter);
                window.showMessage('Character loaded successfully!', 'green');
                return parsed;
            } catch (e) {
                console.error("Failed to parse saved character data:", e);
            }
        }

        return {
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
                acrobatics: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                appraise: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                bluff: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                climb: { ability: 'str', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                diplomacy: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                disableDevice: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                disguise: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                escapeArtist: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                fly: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                handleAnimal: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                heal: { ability: 'wis', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                intimidate: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeArcana: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeDungeoneering: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeEngineering: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeGeography: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeHistory: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeLocal: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeNature: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeNobility: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgePlanes: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                knowledgeReligion: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                linguistics: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                perception: { ability: 'wis', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                perform: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                profession: { ability: 'wis', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                ride: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                senseMotive: { ability: 'wis', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                sleightOfHand: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                spellcraft: { ability: 'int', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                stealth: { ability: 'dex', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                survival: { ability: 'wis', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                swim: { ability: 'str', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
                useMagicDevice: { ability: 'cha', ranks: 0, racial: 0, feat: 0, item: 0, status: 0, misc: 0 },
            },
            inventory: {
                items: {},
                currency: { cp: 0, sp: 0, gp: 0 },
                containers: {
                    backpack: { name: 'Backpack', capacity: 100, items: [] },
                    bagOfHolding: { name: 'Bag of Holding', capacity: 500, items: [] }
                }
            },
            feats: {},
            abilities: {},
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
        addItem: (itemData) => {
            const newItemId = uuid();
            const newItem = { id: newItemId, ...itemData, equipped: false, favorited: false };
            if(!character.inventory.items) character.inventory.items = {};
            character.inventory.items[newItemId] = newItem;
            notifySubscribers();
        },
        updateItem: (itemId, field, value) => {
            if (character.inventory.items[itemId]) {
                const numericFields = ['numDice', 'dieType', 'range', 'critMultiplier', 'acBonus'];
                if (numericFields.includes(field)) {
                    character.inventory.items[itemId][field] = parseInt(value, 10) || 0;
                } else {
                    character.inventory.items[itemId][field] = value;
                }
                notifySubscribers();
            }
        },
        toggleEquip: (itemId) => {
            if (character.inventory.items[itemId]) {
                character.inventory.items[itemId].equipped = !character.inventory.items[itemId].equipped;
                _syncEquippedItems();
                notifySubscribers();
            }
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
            if (character.spellcasting.spellSlots[level]) {
                const newSlots = [...character.spellcasting.spellSlots];
                newSlots[level] = { ...newSlots[level], [type]: parseInt(value, 10) || 0 };
                character.spellcasting.spellSlots = newSlots;
                notifySubscribers();
            }
        },
        calculateItemBonusesForAbility,
        calculateItemBonusesForField,
        calculateACBonuses,
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