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
            }
        ]
    },
    "Human": {
        name: "Human",
        abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        traits: []
    }
};