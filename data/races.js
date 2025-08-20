// data/races.js
window.dndData = window.dndData || {};

window.dndData.races = {
    "Dwarf": {
        name: "Dwarf",
        abilityScoreIncrease: { con: 2 },
        traits: [
            {
                name: "Darkvision",
                description: "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Dwarven Resilience",
                description: "You have advantage on saving throws against poison, and you have resistance against poison damage.",
                type: "Racial"
            },
            {
                name: "Stonecunning",
                description: "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.",
                type: "Racial"
            }
        ],
        subraces: [
            {
                name: "Hill Dwarf",
                abilityScoreIncrease: { wis: 1 },
                traits: [
                    {
                        name: "Dwarven Toughness",
                        description: "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.",
                        type: "Racial"
                    }
                ]
            },
            {
                name: "Mountain Dwarf",
                abilityScoreIncrease: { str: 2 },
                traits: [
                    {
                        name: "Dwarven Armor Training",
                        description: "You have proficiency with light and medium armor.",
                        type: "Racial"
                    }
                ]
            }
        ]
    },
    "Elf": {
        name: "Elf",
        abilityScoreIncrease: { dex: 2 },
        traits: [
            {
                name: "Darkvision",
                description: "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Fey Ancestry",
                description: "You have advantage on saving throws against being charmed, and magic can’t put you to sleep.",
                type: "Racial"
            },
            {
                name: "Trance",
                description: "Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.",
                type: "Racial"
            }
        ]
    },
    "Halfling": {
        name: "Halfling",
        abilityScoreIncrease: { dex: 2 },
        traits: [
            {
                name: "Lucky",
                description: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
                type: "Racial"
            },
            {
                name: "Brave",
                description: "You have advantage on saving throws against being frightened.",
                type: "Racial"
            },
            {
                name: "Halfling Nimbleness",
                description: "You can move through the space of any creature that is of a size larger than yours.",
                type: "Racial"
            }
        ]
    },
    "Human": {
        name: "Human",
        abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        traits: []
    },
    "Dragonborn": {
        name: "Dragonborn",
        abilityScoreIncrease: { str: 2, cha: 1 },
        traits: [
            {
                name: "Draconic Ancestry",
                description: "You have a draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table.",
                type: "Racial"
            },
            {
                name: "Breath Weapon",
                description: "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.",
                type: "Racial"
            },
            {
                name: "Damage Resistance",
                description: "You have resistance to the damage type associated with your draconic ancestry.",
                type: "Racial"
            }
        ]
    },
    "Gnome": {
        name: "Gnome",
        abilityScoreIncrease: { int: 2 },
        traits: [
            {
                name: "Darkvision",
                description: "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Gnome Cunning",
                description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
                type: "Racial"
            }
        ]
    },
    "Half-Elf": {
        name: "Half-Elf",
        abilityScoreIncrease: { cha: 2 },
        traits: [
            {
                name: "Ability Score Increase",
                description: "Two other ability scores of your choice increase by 1.",
                type: "Racial"
            },
            {
                name: "Darkvision",
                description: "Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Fey Ancestry",
                description: "You have advantage on saving throws against being charmed, and magic can’t put you to sleep.",
                type: "Racial"
            },
            {
                name: "Skill Versatility",
                description: "You gain proficiency in two skills of your choice.",
                type: "Racial"
            }
        ]
    },
    "Half-Orc": {
        name: "Half-Orc",
        abilityScoreIncrease: { str: 2, con: 1 },
        traits: [
            {
                name: "Darkvision",
                description: "Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Menacing",
                description: "You gain proficiency in the Intimidation skill.",
                type: "Racial"
            },
            {
                name: "Relentless Endurance",
                description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can’t use this feature again until you finish a long rest.",
                type: "Racial"
            },
            {
                name: "Savage Attacks",
                description: "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit.",
                type: "Racial"
            }
        ]
    },
    "Tiefling": {
        name: "Tiefling",
        abilityScoreIncrease: { int: 1, cha: 2 },
        traits: [
            {
                name: "Darkvision",
                description: "Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.",
                type: "Racial"
            },
            {
                name: "Hellish Resistance",
                description: "You have resistance to fire damage.",
                type: "Racial"
            },
            {
                name: "Infernal Legacy",
                description: "You know the Thaumaturgy cantrip. Once you reach 3rd level, you can cast the Hellish Rebuke spell once as a 2nd-level spell. Once you reach 5th level, you can also cast the Darkness spell once. You must finish a long rest to cast these spells again using this trait. Charisma is your spellcasting ability for these spells.",
                type: "Racial"
            }
        ]
    }
};