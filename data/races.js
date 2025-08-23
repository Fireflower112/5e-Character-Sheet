// data/races.js

DndSheet.data.races = {
    "Aarakocra": {
        "name": "Aarakocra",
        "abilityScoreIncrease": { "dex": 2, "wis": 1 },
        "traits": [
            { "name": "Flight", "description": "You have a flying speed of 50 feet. To use this speed, you can’t be wearing medium or heavy armor.", "type": "Racial" },
            { "name": "Talons", "description": "Your talons are natural weapons, which you can use to make unarmed strikes dealing 1d4 slashing damage.", "type": "Racial" }
        ],
        "languages": "Common, Aarakocra, Auran"
    },
    "Aasimar": {
        "name": "Aasimar",
        "abilityScoreIncrease": { "cha": 2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Celestial Resistance", "description": "You have resistance to necrotic damage and radiant damage.", "type": "Racial" },
            { "name": "Healing Hands", "description": "As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can’t use it again until you finish a long rest.", "type": "Racial" },
            { "name": "Light Bearer", "description": "You know the Light cantrip. Charisma is your spellcasting ability for it.", "type": "Racial" }
        ],
        "languages": "Common, Celestial",
        "subraces": [
            { "name": "Protector Aasimar", "abilityScoreIncrease": { "wis": 1 }, "traits": [{ "name": "Radiant Soul", "description": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.", "type": "Racial" }] },
            { "name": "Scourge Aasimar", "abilityScoreIncrease": { "con": 1 }, "traits": [{ "name": "Radiant Consumption", "description": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.", "type": "Racial" }] },
            { "name": "Fallen Aasimar", "abilityScoreIncrease": { "str": 1 }, "traits": [{ "name": "Necrotic Shroud", "description": "Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw or become frightened of you until the end of your next turn. Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level.", "type": "Racial" }] }
        ]
    },
    "Bugbear": {
        "name": "Bugbear",
        "abilityScoreIncrease": { "str": 2, "dex": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Long-Limbed", "description": "When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.", "type": "Racial" },
            { "name": "Powerful Build", "description": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.", "type": "Racial" },
            { "name": "Sneaky", "description": "You are proficient in the Stealth skill.", "type": "Racial" },
            { "name": "Surprise Attack", "description": "If you surprise a creature and hit it with an attack on your first turn in combat, the attack deals an extra 2d6 damage to it. You can use this trait only once per combat.", "type": "Racial" }
        ],
        "languages": "Common, Goblin"
    },
    "Centaur": {
        "name": "Centaur",
        "abilityScoreIncrease": { "str": 2, "wis": 1 },
        "traits": [
            { "name": "Fey", "description": "Your creature type is fey, rather than humanoid.", "type": "Racial" },
            { "name": "Charge", "description": "If you move at least 30 feet straight toward a target and then hit it with a melee weapon attack on the same turn, you can immediately follow that attack with a bonus action, making one attack against the target with your hooves.", "type": "Racial" },
            { "name": "Hooves", "description": "Your hooves are natural melee weapons, which you can use to make unarmed strikes dealing 1d4 bludgeoning damage + your Strength modifier.", "type": "Racial" },
            { "name": "Equine Build", "description": "You count as one size larger when determining your carrying capacity. Also, any climb that requires hands and feet is especially difficult for you (each foot of movement costs you 4 extra feet).", "type": "Racial" },
            { "name": "Survivor", "description": "You have proficiency in one of the following skills: Animal Handling, Medicine, Nature, or Survival.", "type": "Racial" }
        ],
        "languages": "Common, Sylvan"
    },
    "Changeling": {
        "name": "Changeling",
        "abilityScoreIncrease": { "cha": 2, "choice": 1 },
        "traits": [
            { "name": "Shapechanger", "description": "As an action, you can change your appearance and your voice. You determine the specifics of the changes. You can make yourself appear as a member of another race, though none of your game statistics change.", "type": "Racial" },
            { "name": "Changeling Instincts", "description": "You gain proficiency with two of the following skills of your choice: Deception, Insight, Intimidation, and Persuasion.", "type": "Racial" }
        ],
        "languages": "Common, and two other languages of your choice"
    },
    "Dragonborn": {
        "name": "Dragonborn",
        "abilityScoreIncrease": { "str": 2, "cha": 1 },
        "traits": [
            { "name": "Draconic Ancestry", "description": "Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.", "type": "Racial" },
            { "name": "Breath Weapon", "description": "You can use your action to exhale destructive energy. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. After you use your breath weapon, you can’t use it again until you complete a short or long rest.", "type": "Racial" },
            { "name": "Damage Resistance", "description": "You have resistance to the damage type associated with your draconic ancestry.", "type": "Racial" }
        ],
        "languages": "Common, Draconic"
    },
    "Dwarf": {
        "name": "Dwarf",
        "abilityScoreIncrease": { "con": 2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Dwarven Resilience", "description": "You have advantage on saving throws against poison, and you have resistance against poison damage.", "type": "Racial" },
            { "name": "Dwarven Combat Training", "description": "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.", "type": "Racial" },
            { "name": "Stonecunning", "description": "Whenever you make an Intelligence (History) check related to the origin of stonework, you add double your proficiency bonus to the check.", "type": "Racial" }
        ],
        "languages": "Common, Dwarvish",
        "subraces": [
            { "name": "Hill Dwarf", "abilityScoreIncrease": { "wis": 1 }, "traits": [{ "name": "Dwarven Toughness", "description": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.", "type": "Racial" }] },
            { "name": "Mountain Dwarf", "abilityScoreIncrease": { "str": 2 }, "traits": [{ "name": "Dwarven Armor Training", "description": "You have proficiency with light and medium armor.", "type": "Racial" }] }
        ]
    },
    "Elf": {
        "name": "Elf",
        "abilityScoreIncrease": { "dex": 2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Keen Senses", "description": "You have proficiency in the Perception skill.", "type": "Racial" },
            { "name": "Fey Ancestry", "description": "You have advantage on saving throws against being charmed, and magic can’t put you to sleep.", "type": "Racial" },
            { "name": "Trance", "description": "You don’t need to sleep. Instead, you meditate deeply for 4 hours a day.", "type": "Racial" }
        ],
        "languages": "Common, Elvish",
        "subraces": [
            { "name": "High Elf", "abilityScoreIncrease": { "int": 1 }, "traits": [{ "name": "Elf Weapon Training", "description": "You have proficiency with the longsword, shortsword, shortbow, and longbow.", "type": "Racial" }, { "name": "Cantrip", "description": "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.", "type": "Racial" }] },
            { "name": "Wood Elf", "abilityScoreIncrease": { "wis": 1 }, "traits": [{ "name": "Elf Weapon Training", "description": "You have proficiency with the longsword, shortsword, shortbow, and longbow.", "type": "Racial" }, { "name": "Fleet of Foot", "description": "Your base walking speed increases to 35 feet.", "type": "Racial" }, { "name": "Mask of the Wild", "description": "You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.", "type": "Racial" }] },
            { "name": "Drow (Dark Elf)", "abilityScoreIncrease": { "cha": 1 }, "traits": [{ "name": "Superior Darkvision", "description": "Your darkvision has a radius of 120 feet.", "type": "Racial" }, { "name": "Sunlight Sensitivity", "description": "You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.", "type": "Racial" }, { "name": "Drow Magic", "description": "You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day. When you reach 5th level, you can also cast the darkness spell once per day. Charisma is your spellcasting ability for these spells.", "type": "Racial" }] }
        ]
    },
    "Fairy": {
        "name": "Fairy",
        "abilityScoreIncrease": { "choice": "Choose one score by 2 and another by 1, or three by 1" },
        "traits": [
            { "name": "Fairy Magic", "description": "You know the Druidcraft cantrip. At 3rd level, you can cast Faerie Fire once per long rest. At 5th level, you can cast Enlarge/Reduce once per long rest.", "type": "Racial" },
            { "name": "Flight", "description": "You have a flying speed equal to your walking speed. You can’t use this flying speed if you’re wearing medium or heavy armor.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Firbolg": {
        "name": "Firbolg",
        "abilityScoreIncrease": { "wis": 2, "str": 1 },
        "traits": [
            { "name": "Firbolg Magic", "description": "You can cast Detect Magic and Disguise Self with this trait. When you use this version of disguise self, you can seem up to 3 feet shorter than normal.", "type": "Racial" },
            { "name": "Hidden Step", "description": "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack, make a damage roll, or force someone to make a saving throw. You can't use it again until you finish a short or long rest.", "type": "Racial" },
            { "name": "Powerful Build", "description": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.", "type": "Racial" },
            { "name": "Speech of Beast and Leaf", "description": "You have the ability to communicate in a limited manner with beasts and plants.", "type": "Racial" }
        ],
        "languages": "Common, Elvish, Giant"
    },
    "Genasi": {
        "name": "Genasi",
        "abilityScoreIncrease": { "con": 2 },
        "traits": [],
        "languages": "Common, Primordial",
        "subraces": [
            { "name": "Air Genasi", "abilityScoreIncrease": { "dex": 1 }, "traits": [{ "name": "Unending Breath", "description": "You can hold your breath indefinitely while you’re not incapacitated.", "type": "Racial" }, { "name": "Mingle with the Wind", "description": "You can cast the Levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest.", "type": "Racial" }] },
            { "name": "Earth Genasi", "abilityScoreIncrease": { "str": 1 }, "traits": [{ "name": "Earth Walk", "description": "You can move across difficult terrain made of earth or stone without expending extra movement.", "type": "Racial" }, { "name": "Merge with Stone", "description": "You can cast the Pass without Trace spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest.", "type": "Racial" }] },
            { "name": "Fire Genasi", "abilityScoreIncrease": { "int": 1 }, "traits": [{ "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. Your ties to the Elemental Plane of Fire make your darkvision unusual: everything you see in darkness is a shade of red.", "type": "Racial" }, { "name": "Fire Resistance", "description": "You have resistance to fire damage.", "type": "Racial" }, { "name": "Reach to the Blaze", "description": "You know the Produce Flame cantrip. At 3rd level, you can cast Burning Hands once per long rest.", "type": "Racial" }] },
            { "name": "Water Genasi", "abilityScoreIncrease": { "wis": 1 }, "traits": [{ "name": "Acid Resistance", "description": "You have resistance to acid damage.", "type": "Racial" }, { "name": "Amphibious", "description": "You can breathe air and water.", "type": "Racial" }, { "name": "Swim", "description": "You have a swimming speed of 30 feet.", "type": "Racial" }, { "name": "Call to the Wave", "description": "You know the Shape Water cantrip. At 3rd level, you can cast Create or Destroy Water once per long rest.", "type": "Racial" }] }
        ]
    },
    "Gith": {
        "name": "Gith",
        "abilityScoreIncrease": { "int": 1 },
        "traits": [],
        "languages": "Common, Gith",
        "subraces": [
            { "name": "Githyanki", "abilityScoreIncrease": { "str": 2 }, "traits": [{ "name": "Decadent Mastery", "description": "You learn one language of your choice, and you are proficient with one skill or tool of your choice.", "type": "Racial" }, { "name": "Martial Prodigy", "description": "You have proficiency with light and medium armor and with shortswords, longswords, and greatswords.", "type": "Racial" }, { "name": "Githyanki Psionics", "description": "You know the Mage Hand cantrip. At 3rd level, you can cast Jump once per long rest. At 5th level, you can cast Misty Step once per long rest.", "type": "Racial" }] },
            { "name": "Githzerai", "abilityScoreIncrease": { "wis": 2 }, "traits": [{ "name": "Mental Discipline", "description": "You have advantage on saving throws against the charmed and frightened conditions.", "type": "Racial" }, { "name": "Githzerai Psionics", "description": "You know the Mage Hand cantrip. At 3rd level, you can cast Shield once per long rest. At 5th level, you can cast Detect Thoughts once per long rest.", "type": "Racial" }] }
        ]
    },
    "Gnome": {
        "name": "Gnome",
        "abilityScoreIncrease": { "int": 2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Gnome Cunning", "description": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.", "type": "Racial" }
        ],
        "languages": "Common, Gnomish",
        "subraces": [
            { "name": "Forest Gnome", "abilityScoreIncrease": { "dex": 1 }, "traits": [{ "name": "Natural Illusionist", "description": "You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.", "type": "Racial" }, { "name": "Speak with Small Beasts", "description": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.", "type": "Racial" }] },
            { "name": "Rock Gnome", "abilityScoreIncrease": { "con": 1 }, "traits": [{ "name": "Artificer's Lore", "description": "Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add double your proficiency bonus.", "type": "Racial" }, { "name": "Tinker", "description": "You have proficiency with artisan’s tools (tinker’s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device.", "type": "Racial" }] }
        ]
    },
    "Goblin": {
        "name": "Goblin",
        "abilityScoreIncrease": { "dex": 2, "con": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Fury of the Small", "description": "When you damage a creature with an attack or a spell and the creature’s size is larger than yours, you can cause the attack or spell to deal extra damage to the creature. The extra damage equals your level. Once you use this trait, you can’t use it again until you finish a short or long rest.", "type": "Racial" },
            { "name": "Nimble Escape", "description": "You can take the Disengage or Hide action as a bonus action on each of your turns.", "type": "Racial" }
        ],
        "languages": "Common, Goblin"
    },
    "Goliath": {
        "name": "Goliath",
        "abilityScoreIncrease": { "str": 2, "con": 1 },
        "traits": [
            { "name": "Natural Athlete", "description": "You have proficiency in the Athletics skill.", "type": "Racial" },
            { "name": "Stone’s Endurance", "description": "When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can’t use it again until you finish a short or long rest.", "type": "Racial" },
            { "name": "Powerful Build", "description": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.", "type": "Racial" },
            { "name": "Mountain Born", "description": "You’re acclimated to high altitude, including elevations above 20,000 feet.", "type": "Racial" }
        ],
        "languages": "Common, Giant"
    },
    "Half-Elf": {
        "name": "Half-Elf",
        "abilityScoreIncrease": { "cha": 2, "choice": "Two others by 1" },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Fey Ancestry", "description": "You have advantage on saving throws against being charmed, and magic can’t put you to sleep.", "type": "Racial" },
            { "name": "Skill Versatility", "description": "You gain proficiency in two skills of your choice.", "type": "Racial" }
        ],
        "languages": "Common, Elvish, and one extra language"
    },
    "Half-Orc": {
        "name": "Half-Orc",
        "abilityScoreIncrease": { "str": 2, "con": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Menacing", "description": "You gain proficiency in the Intimidation skill.", "type": "Racial" },
            { "name": "Relentless Endurance", "description": "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can’t use this feature again until you finish a long rest.", "type": "Racial" },
            { "name": "Savage Attacks", "description": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon’s damage dice one additional time and add it to the extra damage of the critical hit.", "type": "Racial" }
        ],
        "languages": "Common, Orc"
    },
    "Halfling": {
        "name": "Halfling",
        "abilityScoreIncrease": { "dex": 2 },
        "traits": [
            { "name": "Lucky", "description": "When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.", "type": "Racial" },
            { "name": "Brave", "description": "You have advantage on saving throws against being frightened.", "type": "Racial" },
            { "name": "Halfling Nimbleness", "description": "You can move through the space of any creature that is of a size larger than yours.", "type": "Racial" }
        ],
        "languages": "Common, Halfling",
        "subraces": [
            { "name": "Lightfoot Halfling", "abilityScoreIncrease": { "cha": 1 }, "traits": [{ "name": "Naturally Stealthy", "description": "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.", "type": "Racial" }] },
            { "name": "Stout Halfling", "abilityScoreIncrease": { "con": 1 }, "traits": [{ "name": "Stout Resilience", "description": "You have advantage on saving throws against poison, and you have resistance against poison damage.", "type": "Racial" }] }
        ]
    },
    "Harengon": {
        "name": "Harengon",
        "abilityScoreIncrease": { "choice": "Choose one score by 2 and another by 1, or three by 1" },
        "traits": [
            { "name": "Hare-Trigger", "description": "You can add your proficiency bonus to your initiative rolls.", "type": "Racial" },
            { "name": "Leporine Senses", "description": "You have proficiency in the Perception skill.", "type": "Racial" },
            { "name": "Lucky Footwork", "description": "When you fail a Dexterity saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning the failure into a success.", "type": "Racial" },
            { "name": "Rabbit Hop", "description": "As a bonus action, you can jump a number of feet equal to five times your proficiency bonus, without provoking opportunity attacks.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Hobgoblin": {
        "name": "Hobgoblin",
        "abilityScoreIncrease": { "con": 2, "int": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Martial Training", "description": "You are proficient with two martial weapons of your choice and with light armor.", "type": "Racial" },
            { "name": "Saving Face", "description": "If you miss with an attack roll or fail an ability check or a saving throw, you can gain a bonus to the roll equal to the number of allies you can see within 30 feet of you (maximum bonus of +5). Once you use this trait, you can’t use it again until you finish a short or long rest.", "type": "Racial" }
        ],
        "languages": "Common, Goblin"
    },
    "Kalashtar": {
        "name": "Kalashtar",
        "abilityScoreIncrease": { "wis": 2, "cha": 1 },
        "traits": [
            { "name": "Dual Mind", "description": "You have advantage on all Wisdom saving throws.", "type": "Racial" },
            { "name": "Mental Discipline", "description": "You have resistance to psychic damage.", "type": "Racial" },
            { "name": "Mind Link", "description": "You can speak telepathically to any creature you can see within a number of feet of you equal to 10 times your level.", "type": "Racial" },
            { "name": "Severed from Dreams", "description": "You are immune to spells and other magical effects that require you to dream, like dream, but not to spells and other magical effects that put you to sleep, like sleep.", "type": "Racial" }
        ],
        "languages": "Common, Quori, and one other language"
    },
    "Kenku": {
        "name": "Kenku",
        "abilityScoreIncrease": { "dex": 2, "wis": 1 },
        "traits": [
            { "name": "Expert Forgery", "description": "You can duplicate other creatures’ handwriting and craftwork. You have advantage on all checks made to produce forgeries or duplicates of existing objects.", "type": "Racial" },
            { "name": "Kenku Training", "description": "You are proficient in your choice of two of the following skills: Acrobatics, Deception, Stealth, and Sleight of Hand.", "type": "Racial" },
            { "name": "Mimicry", "description": "You can mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check.", "type": "Racial" }
        ],
        "languages": "You can read and write Common and Auran, but you can speak only by using your Mimicry trait."
    },
    "Kobold": {
        "name": "Kobold",
        "abilityScoreIncrease": { "dex": 2, "str": -2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Grovel, Cower, and Beg", "description": "As an action on your turn, you can cower pathetically to distract nearby foes. Until the end of your next turn, your allies gain advantage on attack rolls against enemies within 10 feet of you that can see you. Once you use this trait, you can't use it again until you finish a short or long rest.", "type": "Racial" },
            { "name": "Pack Tactics", "description": "You have advantage on an attack roll against a creature if at least one of your allies is within 5 feet of the creature and the ally isn't incapacitated.", "type": "Racial" },
            { "name": "Sunlight Sensitivity", "description": "You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.", "type": "Racial" }
        ],
        "languages": "Common, Draconic"
    },
    "Leonin": {
        "name": "Leonin",
        "abilityScoreIncrease": { "con": 2, "str": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Claws", "description": "Your claws are natural weapons, which you can use to make unarmed strikes dealing 1d4 slashing damage + your Strength modifier.", "type": "Racial" },
            { "name": "Hunter's Instincts", "description": "You have proficiency in one of the following skills of your choice: Athletics, Intimidation, Perception, or Survival.", "type": "Racial" },
            { "name": "Daunting Roar", "description": "As a bonus action, you can let out an especially menacing roar. Creatures of your choice within 10 feet of you that can hear you must succeed on a Wisdom saving throw or become frightened of you until the end of your next turn. The DC of the save equals 8 + your proficiency bonus + your Constitution modifier. Once you use this trait, you can't use it again until you finish a short or long rest.", "type": "Racial" }
        ],
        "languages": "Common, Leonin"
    },
    "Lizardfolk": {
        "name": "Lizardfolk",
        "abilityScoreIncrease": { "con": 2, "wis": 1 },
        "traits": [
            { "name": "Bite", "description": "Your fanged maw is a natural weapon, which you can use to make unarmed strikes dealing 1d6 piercing damage + your Strength modifier.", "type": "Racial" },
            { "name": "Cunning Artisan", "description": "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles.", "type": "Racial" },
            { "name": "Hold Breath", "description": "You can hold your breath for up to 15 minutes at a time.", "type": "Racial" },
            { "name": "Hunter’s Lore", "description": "You gain proficiency with two of the following skills of your choice: Animal Handling, Nature, Perception, Stealth, and Survival.", "type": "Racial" },
            { "name": "Natural Armor", "description": "When you aren’t wearing armor, your AC is 13 + your Dexterity modifier.", "type": "Racial" },
            { "name": "Hungry Jaws", "description": "As a bonus action, you can make a special attack with your bite. If the attack hits, it deals its normal damage, and you gain temporary hit points equal to your Constitution modifier. You can’t use this trait again until you finish a short or long rest.", "type": "Racial" }
        ],
        "languages": "Common, Draconic"
    },
    "Loxodon": {
        "name": "Loxodon",
        "abilityScoreIncrease": { "con": 2, "wis": 1 },
        "traits": [
            { "name": "Powerful Build", "description": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.", "type": "Racial" },
            { "name": "Loxodon Serenity", "description": "You have advantage on saving throws against being charmed or frightened.", "type": "Racial" },
            { "name": "Natural Armor", "description": "When you aren’t wearing armor, your AC is 12 + your Constitution modifier.", "type": "Racial" },
            { "name": "Trunk", "description": "You can grasp things with your trunk. It has a reach of 5 feet, and it can lift a number of pounds equal to five times your Strength score. It can’t wield weapons or shields.", "type": "Racial" },
            { "name": "Keen Smell", "description": "Thanks to your sensitive trunk, you have advantage on Wisdom (Perception), Wisdom (Survival), and Intelligence (Investigation) checks that involve smell.", "type": "Racial" }
        ],
        "languages": "Common, Loxodon"
    },
    "Minotaur": {
        "name": "Minotaur",
        "abilityScoreIncrease": { "str": 2, "con": 1 },
        "traits": [
            { "name": "Horns", "description": "Your horns are natural melee weapons, which you can use to make unarmed strikes dealing 1d6 piercing damage + your Strength modifier.", "type": "Racial" },
            { "name": "Goring Rush", "description": "Immediately after you use the Dash action on your turn and move at least 20 feet, you can make one melee attack with your horns as a bonus action.", "type": "Racial" },
            { "name": "Hammering Horns", "description": "Immediately after you hit a creature with a melee attack as part of the Attack action on your turn, you can use a bonus action to attempt to shove that target with your horns. The target must be no more than one size larger than you and within 5 feet of you. Unless it succeeds on a Strength saving throw against a DC equal to 8 + your proficiency bonus + your Strength modifier, you push it up to 10 feet away from you.", "type": "Racial" },
            { "name": "Imposing Presence", "description": "You have proficiency in one of the following skills of your choice: Intimidation or Persuasion.", "type": "Racial" }
        ],
        "languages": "Common, Minotaur"
    },
    "Orc": {
        "name": "Orc",
        "abilityScoreIncrease": { "str": 2, "con": 1, "int": -2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Aggressive", "description": "As a bonus action on your turn, you can move up to your speed toward an enemy of your choice that you can see or hear. You must end this move closer to the enemy than you started.", "type": "Racial" },
            { "name": "Powerful Build", "description": "You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.", "type": "Racial" },
            { "name": "Primal Intuition", "description": "You have proficiency in two of the following skills of your choice: Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, and Survival.", "type": "Racial" }
        ],
        "languages": "Common, Orc"
    },
    "Owlin": {
        "name": "Owlin",
        "abilityScoreIncrease": { "choice": "Choose one score by 2 and another by 1, or three by 1" },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 120 feet of you as if it were bright light and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Flight", "description": "Thanks to your wings, you have a flying speed equal to your walking speed. You can’t use this flying speed if you’re wearing medium or heavy armor.", "type": "Racial" },
            { "name": "Silent Feathers", "description": "You have proficiency in the Stealth skill.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Plasmoid": {
        "name": "Plasmoid",
        "abilityScoreIncrease": { "choice": "Choose one score by 2 and another by 1, or three by 1" },
        "traits": [
            { "name": "Amorphous", "description": "You can squeeze through a space as narrow as 1 inch wide, provided you are wearing and carrying nothing. You have advantage on ability checks you make to initiate or escape a grapple.", "type": "Racial" },
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Hold Breath", "description": "You can hold your breath for 1 hour.", "type": "Racial" },
            { "name": "Natural Resilience", "description": "You have resistance to acid and poison damage, and you have advantage on saving throws against being poisoned.", "type": "Racial" },
            { "name": "Shape Self", "description": "As an action, you can reshape your body to give yourself a head, one or two arms, one or two legs, and makeshift hands and feet, or you can revert to a limbless blob.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Satyr": {
        "name": "Satyr",
        "abilityScoreIncrease": { "cha": 2, "dex": 1 },
        "traits": [
            { "name": "Fey", "description": "Your creature type is fey, rather than humanoid.", "type": "Racial" },
            { "name": "Ram", "description": "You can use your head and horns to make unarmed strikes dealing 1d4 bludgeoning damage + your Strength modifier.", "type": "Racial" },
            { "name": "Magic Resistance", "description": "You have advantage on saving throws against spells and other magical effects.", "type": "Racial" },
            { "name": "Mirthful Leaps", "description": "Whenever you make a long or high jump, you can roll a d8 and add the number rolled to the number of feet you cover.", "type": "Racial" },
            { "name": "Reveler", "description": "You have proficiency in the Performance and Persuasion skills, and you have proficiency with one musical instrument of your choice.", "type": "Racial" }
        ],
        "languages": "Common, Sylvan"
    },
    "Shifter": {
        "name": "Shifter",
        "abilityScoreIncrease": { "dex": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Shifting", "description": "As a bonus action, you can assume a more bestial appearance. This transformation lasts for 1 minute, until you die, or until you revert to your normal appearance as a bonus action. When you shift, you gain temporary hit points equal to your level + your Constitution modifier. You also gain additional benefits that depend on your shifter subrace. Once you shift, you can’t do so again until you finish a short or long rest.", "type": "Racial" }
        ],
        "languages": "Common",
        "subraces": [
            { "name": "Beasthide Shifter", "abilityScoreIncrease": { "con": 2 }, "traits": [{ "name": "Natural Athlete", "description": "You have proficiency in the Athletics skill.", "type": "Racial" }, { "name": "Shifting Feature", "description": "Whenever you shift, you gain 1d6 additional temporary hit points. While shifted, you have a +1 bonus to your Armor Class.", "type": "Racial" }] },
            { "name": "Longtooth Shifter", "abilityScoreIncrease": { "str": 2 }, "traits": [{ "name": "Fierce", "description": "You have proficiency in the Intimidation skill.", "type": "Racial" }, { "name": "Shifting Feature", "description": "While shifted, you can use your elongated fangs to make an unarmed strike as a bonus action dealing 1d6 piercing damage + your Strength modifier.", "type": "Racial" }] },
            { "name": "Swiftstride Shifter", "abilityScoreIncrease": { "dex": 1, "cha": 1 }, "traits": [{ "name": "Graceful", "description": "You have proficiency in the Acrobatics skill.", "type": "Racial" }, { "name": "Shifting Feature", "description": "While shifted, your walking speed increases by 10 feet. Additionally, you can move up to 10 feet as a reaction when a creature ends its turn within 5 feet of you.", "type": "Racial" }] },
            { "name": "Wildhunt Shifter", "abilityScoreIncrease": { "wis": 2 }, "traits": [{ "name": "Natural Tracker", "description": "You have proficiency in the Survival skill.", "type": "Racial" }, { "name": "Shifting Feature", "description": "While shifted, you have advantage on Wisdom checks, and no creature within 30 feet of you can make an attack roll with advantage against you.", "type": "Racial" }] }
        ]
    },
    "Simic Hybrid": {
        "name": "Simic Hybrid",
        "abilityScoreIncrease": { "con": 2, "choice": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Animal Enhancement", "description": "Your body has been altered to incorporate certain animal characteristics. You choose one animal enhancement now and a second enhancement at 5th level.", "type": "Racial" }
        ],
        "languages": "Common, and your choice of Elvish or Vedalken"
    },
    "Tabaxi": {
        "name": "Tabaxi",
        "abilityScoreIncrease": { "dex": 2, "cha": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Feline Agility", "description": "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can’t use it again until you move 0 feet on one of your turns.", "type": "Racial" },
            { "name": "Cat’s Claws", "description": "You have a climbing speed of 20 feet. In addition, your claws are natural weapons, which you can use to make unarmed strikes dealing 1d4 slashing damage + your Strength modifier.", "type": "Racial" },
            { "name": "Cat’s Talent", "description": "You have proficiency in the Perception and Stealth skills.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Thri-kreen": {
        "name": "Thri-kreen",
        "abilityScoreIncrease": { "choice": "Choose one score by 2 and another by 1, or three by 1" },
        "traits": [
            { "name": "Chameleon Carapace", "description": "While you aren’t wearing armor, your carapace gives you a base AC of 13 + your Dexterity modifier. As an action, you can change its color to match your surroundings, giving you advantage on Stealth checks to hide.", "type": "Racial" },
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Secondary Arms", "description": "You have two slightly smaller secondary arms below your primary pair of arms. The secondary arms can manipulate an object, open or close a door or container, pick up or set down a Tiny object, or wield a weapon that has the light property.", "type": "Racial" },
            { "name": "Sleepless", "description": "You do not require sleep and can remain conscious during a long rest, though you must still refrain from strenuous activity to gain its benefit.", "type": "Racial" },
            { "name": "Thri-kreen Telepathy", "description": "You have the magical ability to transmit your thoughts mentally to willing creatures within 120 feet of yourself. A contacted creature doesn’t need to share a language with you to understand your thoughts, but it must be able to understand at least one language.", "type": "Racial" }
        ],
        "languages": "Thri-kreen"
    },
    "Tiefling": {
        "name": "Tiefling",
        "abilityScoreIncrease": { "int": 1, "cha": 2 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Hellish Resistance", "description": "You have resistance to fire damage.", "type": "Racial" },
            { "name": "Infernal Legacy", "description": "You know the Thaumaturgy cantrip. At 3rd level, you can cast Hellish Rebuke once per long rest. At 5th level, you can cast Darkness once per long rest.", "type": "Racial" }
        ],
        "languages": "Common, Infernal"
    },
    "Tortle": {
        "name": "Tortle",
        "abilityScoreIncrease": { "str": 2, "wis": 1 },
        "traits": [
            { "name": "Claws", "description": "Your claws are natural weapons, which you can use to make unarmed strikes dealing 1d4 slashing damage + your Strength modifier.", "type": "Racial" },
            { "name": "Hold Breath", "description": "You can hold your breath for up to 1 hour at a time.", "type": "Racial" },
            { "name": "Natural Armor", "description": "Your shell provides a base AC of 17 (your Dexterity modifier doesn’t affect this number). You gain no benefit from wearing armor.", "type": "Racial" },
            { "name": "Shell Defense", "description": "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0, you have disadvantage on Dexterity saving throws, you can’t take reactions, and the only action you can take is a bonus action to emerge.", "type": "Racial" },
            { "name": "Survival Instinct", "description": "You gain proficiency in the Survival skill.", "type": "Racial" }
        ],
        "languages": "Common, Aquan"
    },
    "Triton": {
        "name": "Triton",
        "abilityScoreIncrease": { "str": 1, "con": 1, "cha": 1 },
        "traits": [
            { "name": "Amphibious", "description": "You can breathe air and water.", "type": "Racial" },
            { "name": "Control Air and Water", "description": "You can cast Fog Cloud with this trait. At 3rd level, you can cast Gust of Wind. At 5th level, you can cast Wall of Water. You must finish a long rest before you can cast the same spell again with this trait.", "type": "Racial" },
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Emissary of the Sea", "description": "You can communicate simple ideas with beasts that can breathe water.", "type": "Racial" },
            { "name": "Guardians of the Depths", "description": "You have resistance to cold damage.", "type": "Racial" }
        ],
        "languages": "Common, Primordial"
    },
    "Vedalken": {
        "name": "Vedalken",
        "abilityScoreIncrease": { "int": 2, "wis": 1 },
        "traits": [
            { "name": "Vedalken Dispassion", "description": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws.", "type": "Racial" },
            { "name": "Tireless Precision", "description": "You are proficient in one of the following skills of your choice: Arcana, History, Investigation, Medicine, Performance, or Sleight of Hand. You are also proficient with one tool of your choice. Whenever you make an ability check with the chosen skill or tool, roll a d4 and add the number rolled to the check’s total.", "type": "Racial" },
            { "name": "Partially Amphibious", "description": "You can breathe underwater for up to 1 hour. Once you’ve reached that limit, you can’t use this trait again until you finish a long rest.", "type": "Racial" }
        ],
        "languages": "Common, Vedalken, and one other language"
    },
    "Warforged": {
        "name": "Warforged",
        "abilityScoreIncrease": { "con": 2, "choice": 1 },
        "traits": [
            { "name": "Constructed Resilience", "description": "You have advantage on saving throws against being poisoned, and you have resistance to poison damage. You don’t need to eat, drink, or breathe. You are immune to disease. You don’t need to sleep, and magic can’t put you to sleep.", "type": "Racial" },
            { "name": "Sentry’s Rest", "description": "When you take a long rest, you must spend at least six hours in an inactive, motionless state, rather than sleeping. In this state, you appear inert, but it doesn’t render you unconscious, and you can see and hear as normal.", "type": "Racial" },
            { "name": "Integrated Protection", "description": "Your body has built-in defensive layers. You gain a +1 bonus to Armor Class.", "type": "Racial" },
            { "name": "Specialized Design", "description": "You gain one skill proficiency and one tool proficiency of your choice.", "type": "Racial" }
        ],
        "languages": "Common, and one other language"
    },
    "Yuan-ti Pureblood": {
        "name": "Yuan-ti Pureblood",
        "abilityScoreIncrease": { "cha": 2, "int": 1 },
        "traits": [
            { "name": "Darkvision", "description": "You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "Racial" },
            { "name": "Innate Spellcasting", "description": "You know the Poison Spray cantrip. You can cast Animal Friendship an unlimited number of times with this trait, but you can target only snakes with it. At 3rd level, you can cast Suggestion once per long rest.", "type": "Racial" },
            { "name": "Magic Resistance", "description": "You have advantage on saving throws against spells and other magical effects.", "type": "Racial" },
            { "name": "Poison Immunity", "description": "You are immune to poison damage and the poisoned condition.", "type": "Racial" }
        ],
        "languages": "Common, Abyssal, Draconic"
    }
}