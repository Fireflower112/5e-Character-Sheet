// js/stores/defaultCharacter.js
window.getInitialState = () => {
    const savedCharacter = localStorage.getItem('pathfinderCharacterSheet');

    const defaultState = {
        name: 'Valerius',
        race: 'Elf',
        subrace: '',
        classes: [{ name: 'Fighter', level: 1, subclassName: '' }],
        alignment: 'Lawful Good',
        size: 'Medium',
        experience: { current: 0, toNext: 300 },
        hp: 10,
        maxHp: 10,
		initiative: { base: 0, other: 0 },
        tempHp: 0,
        proficiencyBonus: 2,
        languages: ['Common'],
        abilityScores: {
            str: { base: 10, racial: 0, other: 0 },
            dex: { base: 10, racial: 0, other: 0 },
            con: { base: 10, racial: 0, other: 0 },
            int: { base: 10, racial: 0, other: 0 },
            wis: { base: 10, racial: 0, other: 0 },
            cha: { base: 10, racial: 0, other: 0 },
        },
        savingThrows: {
            str: { proficient: false }, dex: { proficient: false }, con: { proficient: false },
            int: { proficient: false }, wis: { proficient: false }, cha: { proficient: false },
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
        // Inside your defaultState object in js/stores/defaultCharacter.js

		inventory: { 
			items: {
				"default-item-1": {
					id: "default-item-1",
					name: "Longsword",
					weight: 3,
					itemType: "weapon",
					numDice: 1,
					dieType: 8,
					description: "A versatile martial weapon.",
					equippedSlot: "Wielded"
				},
				"default-item-2": {
					id: "default-item-2",
					name: "Shield",
					weight: 6,
					itemType: "shield",
					acBonus: 2,
					description: "A standard shield.",
					equippedSlot: "Shield"
				},
				"default-item-3": {
					id: "default-item-3",
					name: "Rations (1 day)",
					weight: 2,
					itemType: "other",
					containerId: "default-container-1",
					description: "Dry food, enough for one day."
				},
				"default-item-4": {
					id: "default-item-4",
					name: "Gauntlets of Ogre Power",
					weight: 2,
					itemType: "wearable",
					requiresAttunement: true,
					description: "Your Strength score is 19 while you wear these gauntlets.",
					bonuses: [{ field: 'str', value: 19, type: 'override' }]
				}
			}, 
			currency: {
				cp: 0,
				sp: 0,
				gp: 15
			}, 
			containers: {
				"default-container-1": {
					id: "default-container-1",
					name: "Backpack",
					capacity: 30,
					weight: 5
				}
			} 
		},
        feats: {},
        abilities: {},
        notes: { character: '', npcs: '', campaign: '', combat: '' },
        spellcasting: { castingStat: 'int', spellResistance: 0, spellSlots: Array(10).fill({ total: 0, used: 0 }) },
        spells: {
            "default-spell-1": { // ADDED this whole block for testing
                id: "default-spell-1",
                name: "Magic Missile",
                level: 1,
                school: "Evocation",
                favorited: true,
                description: "You create three magical darts."
            }
        },
        equippedItems: {},
    };

    if (savedCharacter) {
        try {
            const parsed = JSON.parse(savedCharacter);
            const finalState = { ...defaultState, ...parsed };
            finalState.abilityScores = { ...defaultState.abilityScores, ...(parsed.abilityScores || {}) };
            finalState.skills = { ...defaultState.skills, ...(parsed.skills || {}) };
            window.showMessage('Character loaded successfully!', 'green');
            return finalState;
        } catch (e) {
            console.error("Failed to parse saved character data:", e);
        }
    }
    
    // --- START DEBUG: Easy-to-delete randomization feature ---
    for (const ability in defaultState.abilityScores) {
        const rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        rolls.sort((a, b) => a - b).shift();
        defaultState.abilityScores[ability].base = rolls.reduce((sum, roll) => sum + roll, 0);
    }
    // --- END DEBUG ---
    
    return defaultState;
};