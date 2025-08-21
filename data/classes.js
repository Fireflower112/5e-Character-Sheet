// data/classes.js
window.dndData = window.dndData || {};

window.dndData.classes = {
    "Artificer": {
        name: "Artificer",
        hitDie: 8,
        savingThrows: ["con", "int"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields"],
            weapons: ["Simple weapons"],
            tools: ["Thieves' tools", "Tinker's tools", "One type of artisan's tools of your choice"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "History", "Investigation", "Medicine", "Nature", "Perception", "Sleight of Hand"]
        },
        spellcastingAbility: "int",
        spellList: [
            // Cantrips
            "Acid Splash", "Booming Blade", "Create Bonfire", "Dancing Lights", "Fire Bolt", "Frostbite", "Green-Flame Blade", "Guidance", "Light", "Lightning Lure", "Mage Hand", "Magic Stone", "Mending", "Message", "Poison Spray", "Prestidigitation", "Ray of Frost", "Resistance", "Shocking Grasp", "Spare the Dying", "Sword Burst", "Thorn Whip", "Thunderclap",
            // 1st Level
            "Absorb Elements", "Alarm", "Catapult", "Cure Wounds", "Detect Magic", "Disguise Self", "Expeditious Retreat", "Faerie Fire", "False Life", "Feather Fall", "Grease", "Identify", "Jump", "Longstrider", "Purify Food and Drink", "Sanctuary", "Snare", "Tasha’s Caustic Brew",
            // 2nd Level
            "Aid", "Alter Self", "Arcane Lock", "Blur", "Continual Flame", "Darkvision", "Enhance Ability", "Enlarge/Reduce", "Heat Metal", "Invisibility", "Lesser Restoration", "Levitate", "Magic Mouth", "Magic Weapon", "Protection from Poison", "Pyrotechnics", "Rope Trick", "See Invisibility", "Skywrite", "Spider Climb", "Web",
            // 3rd Level
            "Blink", "Catnap", "Create Food and Water", "Dispel Magic", "Elemental Weapon", "Flame Arrows", "Fly", "Glyph of Warding", "Haste", "Intellect Fortress", "Protection from Energy", "Revivify", "Tiny Servant", "Water Breathing", "Water Walk",
            // 4th Level
            "Arcane Eye", "Elemental Bane", "Fabricate", "Freedom of Movement", "Leomund’s Secret Chest", "Mordenkainen’s Faithful Hound", "Mordenkainen’s Private Sanctum", "Otiluke’s Resilient Sphere", "Stone Shape", "Stoneskin", "Summon Construct",
            // 5th Level
            "Animate Objects", "Bigby’s Hand", "Creation", "Greater Restoration", "Skill Empowerment", "Transmute Rock", "Wall of Stone"
        ],
        features: {
            1: [{ name: "Magical Tinkering" }, { name: "Spellcasting" }],
            2: [{ name: "Infuse Item" }],
            3: [{ name: "Artificer Specialist" }, { name: "The Right Tool for the Job" }],
            5: [{ name: "Artificer Specialist Feature" }],
            6: [{ name: "Tool Expertise" }],
            7: [{ name: "Flash of Genius" }],
            9: [{ name: "Artificer Specialist Feature" }],
            10: [{ name: "Magic Item Adept" }],
            11: [{ name: "Spell-Storing Item" }],
            14: [{ name: "Magic Item Savant" }],
            15: [{ name: "Artificer Specialist Feature" }],
            18: [{ name: "Magic Item Master" }],
            20: [{ name: "Soul of Artifice" }]
        },
        subclassTitle: "Artificer Specialist",
        subclassLevel: 3,
        subclasses: [
            { name: "Alchemist" }, { name: "Armorer" }, { name: "Artillerist" }, { name: "Battle Smith" }
        ]
    },
    "Barbarian": {
        name: "Barbarian",
        hitDie: 12,
        savingThrows: ["str", "con"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields"],
            weapons: ["Simple weapons", "Martial weapons"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"]
        },
        spellcastingAbility: null,
        spellList: [],
        features: {
            1: [{ name: "Rage" }, { name: "Unarmored Defense" }, { name: "Weapon Mastery" }],
            2: [{ name: "Danger Sense" }, { name: "Reckless Attack" }],
            3: [{ name: "Primal Path" }, { name: "Primal Knowledge" }],
            5: [{ name: "Extra Attack" }, { name: "Fast Movement" }],
            7: [{ name: "Feral Instinct" }, { name: "Instinctive Pounce" }],
            9: [{ name: "Brutal Strike" }],
            11: [{ name: "Relentless Rage" }],
            13: [{ name: "Improved Brutal Strike" }],
            15: [{ name: "Persistent Rage" }],
            17: [{ name: "Improved Brutal Strike (2d10)" }],
            18: [{ name: "Indomitable Might" }],
            20: [{ name: "Primal Champion" }]
        },
        subclassTitle: "Primal Path",
        subclassLevel: 3,
        subclasses: [
            { name: "Path of the Berserker" }, { name: "Path of the Wild Heart" }, { name: "Path of the World Tree" }, { name: "Path of the Zealot" }
        ]
    },
    "Bard": {
        name: "Bard",
        hitDie: 8,
        savingThrows: ["dex", "cha"],
        proficiencies: {
            armor: ["Light armor"],
            weapons: ["Simple weapons"],
            tools: ["Three Musical Instruments of your choice"]
        },
        skillProficiencies: {
            choose: 3,
            from: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]
        },
        spellcastingAbility: "cha",
        spellList: [
            // Cantrips
            "Blade Ward", "Dancing Lights", "Friends", "Light", "Mage Hand", "Mending", "Message", "Minor Illusion", "Prestidigitation", "Starry Wisp", "Thunderclap", "True Strike", "Vicious Mockery",
            // 1st Level
            "Animal Friendship", "Bane", "Charm Person", "Color Spray", "Command", "Comprehend Languages", "Cure Wounds", "Detect Magic", "Disguise Self", "Dissonant Whispers", "Faerie Fire", "Feather Fall", "Healing Word", "Heroism", "Identify", "Illusory Script", "Longstrider", "Silent Image", "Sleep", "Speak with Animals", "Tasha’s Hideous Laughter", "Thunderwave", "Unseen Servant",
            // 2nd Level
            "Aid", "Animal Messenger", "Blindness/Deafness", "Calm Emotions", "Cloud of Daggers", "Crown of Madness", "Detect Thoughts", "Enhance Ability", "Enlarge/Reduce", "Enthrall", "Heat Metal", "Hold Person", "Invisibility", "Knock", "Lesser Restoration", "Locate Animals or Plants", "Locate Object", "Magic Mouth", "Mirror Image", "Phantasmal Force", "See Invisibility", "Shatter", "Silence", "Suggestion", "Zone of Truth",
            // 3rd Level
            "Bestow Curse", "Clairvoyance", "Dispel Magic", "Fear", "Feign Death", "Glyph of Warding", "Hypnotic Pattern", "Leomund’s Tiny Hut", "Major Image", "Mass Healing Word", "Nondetection", "Plant Growth", "Sending", "Slow", "Speak with Dead", "Speak with Plants", "Stinking Cloud", "Tongues",
            // 4th Level
            "Charm Monster", "Compulsion", "Confusion", "Dimension Door", "Fount of Moonlight", "Freedom of Movement", "Greater Invisibility", "Hallucinatory Terrain", "Locate Creature", "Phantasmal Killer", "Polymorph",
            // 5th Level
            "Animate Objects", "Awaken", "Dominate Person", "Dream", "Geas", "Greater Restoration", "Hold Monster", "Legend Lore", "Mass Cure Wounds", "Mislead", "Modify Memory", "Planar Binding", "Raise Dead", "Rary’s Telepathic Bond", "Scrying", "Seeming", "Synaptic Static", "Teleportation Circle", "Yolande’s Regal Presence",
            // 6th Level
            "Eyebite", "Find the Path", "Guards and Wards", "Heroes’ Feast", "Mass Suggestion", "Otto’s Irresistible Dance", "Programmed Illusion", "True Seeing",
            // 7th Level
            "Etherealness", "Forcecage", "Mirage Arcane", "Mordenkainen’s Magnificent Mansion", "Mordenkainen’s Sword", "Power Word Fortify", "Prismatic Spray", "Project Image", "Regenerate", "Resurrection", "Symbol", "Teleport",
            // 8th Level
            "Antipathy/Sympathy", "Befuddlement", "Dominate Monster", "Glibness", "Mind Blank", "Power Word Stun",
            // 9th Level
            "Foresight", "Power Word Heal", "Power Word Kill", "Prismatic Wall", "True Polymorph"
        ],
        features: {
            1: [{ name: "Bardic Inspiration (d6)" }, { name: "Spellcasting" }],
            2: [{ name: "Expertise" }, { name: "Jack of All Trades" }],
            3: [{ name: "Bard College" }],
            5: [{ name: "Font of Inspiration" }, { name: "Bardic Inspiration (d8)" }],
            6: [{ name: "Bard College Feature" }],
            7: [{ name: "Countercharm" }],
            9: [{ name: "Expertise" }],
            10: [{ name: "Magical Secrets" }, { name: "Bardic Inspiration (d10)" }],
            14: [{ name: "Bard College Feature" }],
            15: [{ name: "Bardic Inspiration (d12)" }],
            18: [{ name: "Superior Inspiration" }],
            20: [{ name: "Words of Creation" }]
        },
        subclassTitle: "Bard College",
        subclassLevel: 3,
        subclasses: [
            { name: "College of Dance" }, { name: "College of Glamour" }, { name: "College of Lore" }, { name: "College of Valor" }
        ]
    },
    "Cleric": {
        name: "Cleric",
        hitDie: 8,
        savingThrows: ["wis", "cha"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields"],
            weapons: ["Simple weapons"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["History", "Insight", "Medicine", "Persuasion", "Religion"]
        },
        spellcastingAbility: "wis",
        spellList: [
            // Cantrips
            "Guidance", "Light", "Mending", "Resistance", "Sacred Flame", "Spare the Dying", "Thaumaturgy", "Toll the Dead", "Word of Radiance",
            // 1st-9th Level spells would be listed here
        ],
        features: {
            1: [{ name: "Spellcasting" }, { name: "Divine Domain" }],
            2: [{ name: "Channel Divinity (1/rest)" }, { name: "Divine Domain feature" }],
            5: [{ name: "Destroy Undead (CR 1/2)" }],
            6: [{ name: "Channel Divinity (2/rest)" }, { name: "Divine Domain feature" }],
            8: [{ name: "Destroy Undead (CR 1)" }, { name: "Divine Domain feature" }],
            10: [{ name: "Divine Intervention" }],
            11: [{ name: "Destroy Undead (CR 2)" }],
            14: [{ name: "Destroy Undead (CR 3)" }],
            17: [{ name: "Destroy Undead (CR 4)" }, { name: "Divine Domain feature" }],
            18: [{ name: "Channel Divinity (3/rest)" }],
            20: [{ name: "Divine Intervention improvement" }]
        },
        subclassTitle: "Divine Domain",
        subclassLevel: 1,
        subclasses: [
            { name: "Life Domain" }, { name: "Light Domain" }, { name: "Trickery Domain" }, { name: "War Domain" }
        ]
    },
    "Druid": {
        name: "Druid",
        hitDie: 8,
        savingThrows: ["int", "wis"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields"],
            weapons: ["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
            tools: ["Herbalism Kit"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"]
        },
        spellcastingAbility: "wis",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Druidic" }, { name: "Spellcasting" }],
            2: [{ name: "Wild Shape" }, { name: "Druid Circle" }],
            4: [{ name: "Wild Shape Improvement" }],
            8: [{ name: "Wild Shape Improvement" }],
            18: [{ name: "Timeless Body" }, { name: "Beast Spells" }],
            20: [{ name: "Archdruid" }]
        },
        subclassTitle: "Druid Circle",
        subclassLevel: 2,
        subclasses: [
            { name: "Circle of the Land" }, { name: "Circle of the Moon" }
        ]
    },
    "Fighter": {
        name: "Fighter",
        hitDie: 10,
        savingThrows: ["str", "con"],
        proficiencies: {
            armor: ["All armor", "Shields"],
            weapons: ["Simple weapons", "Martial weapons"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"]
        },
        spellcastingAbility: null,
        spellList: [],
        features: {
            1: [{ name: "Fighting Style" }, { name: "Second Wind" }],
            2: [{ name: "Action Surge (one use)" }],
            3: [{ name: "Martial Archetype" }],
            5: [{ name: "Extra Attack" }],
            9: [{ name: "Indomitable (one use)" }],
            11: [{ name: "Extra Attack (2)" }],
            13: [{ name: "Indomitable (two uses)" }],
            17: [{ name: "Action Surge (two uses)" }, { name: "Indomitable (three uses)" }],
            20: [{ name: "Extra Attack (3)" }]
        },
        subclassTitle: "Martial Archetype",
        subclassLevel: 3,
        subclasses: [
            { name: "Battle Master" }, { name: "Champion" }, { name: "Eldritch Knight" }
        ]
    },
    "Monk": {
        name: "Monk",
        hitDie: 8,
        savingThrows: ["str", "dex"],
        proficiencies: {
            armor: [],
            weapons: ["Simple weapons", "Shortswords"],
            tools: ["One type of artisan's tools or one musical instrument"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"]
        },
        spellcastingAbility: null,
        spellList: [],
        features: {
            1: [{ name: "Unarmored Defense" }, { name: "Martial Arts" }],
            2: [{ name: "Ki" }, { name: "Unarmored Movement" }],
            3: [{ name: "Monastic Tradition" }, { name: "Deflect Missiles" }],
            5: [{ name: "Extra Attack" }, { name: "Stunning Strike" }],
            6: [{ name: "Ki-Empowered Strikes" }],
            7: [{ name: "Evasion" }, { name: "Stillness of Mind" }],
            10: [{ name: "Purity of Body" }],
            13: [{ name: "Tongue of the Sun and Moon" }],
            14: [{ name: "Diamond Soul" }],
            15: [{ name: "Timeless Body" }],
            18: [{ name: "Empty Body" }],
            20: [{ name: "Perfect Self" }]
        },
        subclassTitle: "Monastic Tradition",
        subclassLevel: 3,
        subclasses: [
            { name: "Way of the Open Hand" }, { name: "Way of Shadow" }, { name: "Way of the Four Elements" }
        ]
    },
    "Paladin": {
        name: "Paladin",
        hitDie: 10,
        savingThrows: ["wis", "cha"],
        proficiencies: {
            armor: ["All armor", "Shields"],
            weapons: ["Simple weapons", "Martial weapons"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"]
        },
        spellcastingAbility: "cha",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Divine Sense" }, { name: "Lay on Hands" }],
            2: [{ name: "Fighting Style" }, { name: "Spellcasting" }, { name: "Divine Smite" }],
            3: [{ name: "Divine Health" }, { name: "Sacred Oath" }],
            5: [{ name: "Extra Attack" }],
            6: [{ name: "Aura of Protection" }],
            10: [{ name: "Aura of Courage" }],
            11: [{ name: "Improved Divine Smite" }],
            14: [{ name: "Cleansing Touch" }]
        },
        subclassTitle: "Sacred Oath",
        subclassLevel: 3,
        subclasses: [
            { name: "Oath of Devotion" }, { name: "Oath of the Ancients" }, { name: "Oath of Vengeance" }
        ]
    },
    "Ranger": {
        name: "Ranger",
        hitDie: 10,
        savingThrows: ["str", "dex"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields"],
            weapons: ["Simple weapons", "Martial weapons"]
        },
        skillProficiencies: {
            choose: 3,
            from: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"]
        },
        spellcastingAbility: "wis",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Favored Enemy" }, { name: "Natural Explorer" }],
            2: [{ name: "Fighting Style" }, { name: "Spellcasting" }],
            3: [{ name: "Ranger Archetype" }, { name: "Primeval Awareness" }],
            5: [{ name: "Extra Attack" }],
            8: [{ name: "Land's Stride" }],
            10: [{ name: "Hide in Plain Sight" }],
            14: [{ name: "Vanish" }],
            18: [{ name: "Feral Senses" }],
            20: [{ name: "Foe Slayer" }]
        },
        subclassTitle: "Ranger Archetype",
        subclassLevel: 3,
        subclasses: [
            { name: "Hunter" }, { name: "Beast Master" }
        ]
    },
    "Rogue": {
        name: "Rogue",
        hitDie: 8,
        savingThrows: ["dex", "int"],
        proficiencies: {
            armor: ["Light armor"],
            weapons: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
            tools: ["Thieves' Tools"]
        },
        skillProficiencies: {
            choose: 4,
            from: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"]
        },
        spellcastingAbility: null,
        spellList: [],
        features: {
            1: [{ name: "Expertise" }, { name: "Sneak Attack" }, { name: "Thieves’ Cant" }],
            2: [{ name: "Cunning Action" }],
            3: [{ name: "Roguish Archetype" }],
            5: [{ name: "Uncanny Dodge" }],
            7: [{ name: "Evasion" }],
            11: [{ name: "Reliable Talent" }],
            14: [{ name: "Blindsense" }],
            15: [{ name: "Slippery Mind" }],
            18: [{ name: "Elusive" }],
            20: [{ name: "Stroke of Luck" }]
        },
        subclassTitle: "Roguish Archetype",
        subclassLevel: 3,
        subclasses: [
            { name: "Thief" }, { name: "Assassin" }, { name: "Arcane Trickster" }
        ]
    },
    "Sorcerer": {
        name: "Sorcerer",
        hitDie: 6,
        savingThrows: ["con", "cha"],
        proficiencies: {
            armor: [],
            weapons: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"]
        },
        spellcastingAbility: "cha",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Spellcasting" }, { name: "Sorcerous Origin" }],
            2: [{ name: "Font of Magic" }],
            3: [{ name: "Metamagic" }],
            20: [{ name: "Sorcerous Restoration" }]
        },
        subclassTitle: "Sorcerous Origin",
        subclassLevel: 1,
        subclasses: [
            { name: "Draconic Bloodline" }, { name: "Wild Magic" }
        ]
    },
    "Warlock": {
        name: "Warlock",
        hitDie: 8,
        savingThrows: ["wis", "cha"],
        proficiencies: {
            armor: ["Light armor"],
            weapons: ["Simple weapons"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"]
        },
        spellcastingAbility: "cha",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Otherworldly Patron" }, { name: "Pact Magic" }],
            2: [{ name: "Eldritch Invocations" }],
            3: [{ name: "Pact Boon" }],
            11: [{ name: "Mystic Arcanum (6th level)" }],
            13: [{ name: "Mystic Arcanum (7th level)" }],
            15: [{ name: "Mystic Arcanum (8th level)" }],
            17: [{ name: "Mystic Arcanum (9th level)" }],
            20: [{ name: "Eldritch Master" }]
        },
        subclassTitle: "Otherworldly Patron",
        subclassLevel: 1,
        subclasses: [
            { name: "The Archfey" }, { name: "The Fiend" }, { name: "The Great Old One" }
        ]
    },
    "Wizard": {
        name: "Wizard",
        hitDie: 6,
        savingThrows: ["int", "wis"],
        proficiencies: {
            armor: [],
            weapons: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"]
        },
        spellcastingAbility: "int",
        spellList: [
            // Spell list here
        ],
        features: {
            1: [{ name: "Spellcasting" }, { name: "Arcane Recovery" }],
            2: [{ name: "Arcane Tradition" }],
            18: [{ name: "Spell Mastery" }],
            20: [{ name: "Signature Spells" }]
        },
        subclassTitle: "Arcane Tradition",
        subclassLevel: 2,
        subclasses: [
            { name: "School of Abjuration" }, { name: "School of Conjuration" }, { name: "School of Divination" }, { name: "School of Enchantment" }, { name: "School of Evocation" }, { name: "School of Illusion" }, { name: "School of Necromancy" }, { name: "School of Transmutation" }
        ]
    }
};