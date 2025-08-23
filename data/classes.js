// data/classes.js

DndSheet.data.classes = {
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
        features: {
            1: [
                { name: "Magical Tinkering", description: "At 1st level, you learn how to invest a spark of magic into mundane objects. To use this ability, you must have thieves’ tools or artisan’s tools in hand. You then touch a Tiny nonmagical object as an action and give it one of the following magical properties of your choice: The object sheds bright light in a 5-foot radius and dim light for an additional 5 feet. The object emits a recorded message, sound, or odor when touched or handled. The object continuously emits a nonverbal sound (such as a ringing bell or a ticking clock). The chosen property lasts indefinitely. As an action, you can touch the object and end the property early. You can bestow this magic on multiple objects, touching one object each time you use this feature, though a single object can only bear one property at a time. The maximum number of objects you can affect with this feature at one time is equal to your Intelligence modifier (minimum of one object)." }, 
                { name: "Spellcasting", description: "You have studied the workings of magic and how to cast spells, channeling the magical energy that suffuses the multiverse. See chapter 10 for the general rules of spellcasting and chapter 11 for the artificer spell list." }
            ],
            2: [{ name: "Infuse Item", description: "At 2nd level, you gain the ability to imbue mundane items with certain magical infusions. The magic items you create with this feature are effectively prototypes of permanent items." }],
            3: [{ name: "Artificer Specialist", description: "At 3rd level, you choose the type of specialist you are: Alchemist, Armorer, Artillerist, or Battle Smith, each of which is detailed at the end of the class description." }, { name: "The Right Tool for the Job", description: "You've learned how to produce exactly the tool you need: with thieves' tools or artisan's tools in hand, you can magically create one set of artisan's tools in an unoccupied space within 5 feet of you. This creation is a magical, temporary item that lasts until you dismiss it as an action or create another set of tools with this feature." }],
            5: [{ name: "Artificer Specialist Feature", description: "You gain a feature from your Artificer Specialist subclass at 5th level." }],
            6: [{ name: "Tool Expertise", description: "Your proficiency bonus is now doubled for any ability check you make that uses your proficiency with a tool." }],
            7: [{ name: "Flash of Genius", description: "Starting at 7th level, you gain the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll." }],
            9: [{ name: "Artificer Specialist Feature", description: "You gain a feature from your Artificer Specialist subclass at 9th level." }],
            10: [{ name: "Magic Item Adept", description: "When you reach 10th level, you achieve a profound understanding of how to use and make magic items." }],
            11: [{ name: "Spell-Storing Item", description: "At 11th level, you can store a spell in an object." }],
            14: [{ name: "Magic Item Savant", description: "Your skill with magic items deepens more." }],
            15: [{ name: "Artificer Specialist Feature", description: "You gain a feature from your Artificer Specialist subclass at 15th level." }],
            18: [{ name: "Magic Item Master", description: "You are a master of magic items, attuning to them with ease." }],
            20: [{ name: "Soul of Artifice", description: "Your understanding of magical items is unmatched, allowing you to blend your soul with them." }]
        },
        subclassTitle: "Artificer Specialist",
        subclassLevel: 3,
        subclasses: [{ name: "Alchemist" }, { name: "Armorer" }, { name: "Artillerist" }, { name: "Battle Smith" }]
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
        features: {
            1: [{ name: "Rage", description: "In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain the following benefits if you aren’t wearing heavy armor: You have advantage on Strength checks and Strength saving throws. When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian. You have resistance to bludgeoning, piercing, and slashing damage." }, { name: "Unarmored Defense", description: "While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit." }],
            2: [{ name: "Reckless Attack", description: "Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn." }, { name: "Danger Sense", description: "You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can’t be blinded, deafened, or incapacitated." }],
            3: [{ name: "Primal Path", description: "At 3rd level, you choose a path that shapes the nature of your rage. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels." }],
            5: [{ name: "Extra Attack", description: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn." }, { name: "Fast Movement", description: "Starting at 5th level, your speed increases by 10 feet while you aren’t wearing heavy armor." }],
            7: [{ name: "Feral Instinct", description: "By 7th level, your instincts are so honed that you have advantage on initiative rolls." }],
            9: [{ name: "Brutal Critical", description: "Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack." }],
            11: [{ name: "Relentless Rage", description: "Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you’re raging and don’t die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead." }],
            13: [{ name: "Brutal Critical (2 dice)", description: "At 13th level, you can roll two additional weapon damage dice when determining the extra damage for a critical hit with a melee attack." }],
            15: [{ name: "Persistent Rage", description: "Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it." }],
            17: [{ name: "Brutal Critical (3 dice)", description: "At 17th level, you can roll three additional weapon damage dice when determining the extra damage for a critical hit with a melee attack." }],
            18: [{ name: "Indomitable Might", description: "Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total." }],
            20: [{ name: "Primal Champion", description: "At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24." }]
        },
        subclassTitle: "Primal Path",
        subclassLevel: 3,
        subclasses: [{ name: "Path of the Berserker" }, { name: "Path of the Wild Heart" }, { name: "Path of the World Tree" }, { name: "Path of the Zealot" }]
    },
    "Bard": {
        name: "Bard",
        hitDie: 8,
        savingThrows: ["dex", "cha"],
        proficiencies: {
            armor: ["Light armor"],
            weapons: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
            tools: ["Three musical instruments of your choice"]
        },
        skillProficiencies: {
            choose: 3,
            from: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]
        },
        spellcastingAbility: "cha",
        features: {
            1: [{ name: "Bardic Inspiration", description: "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6." }, { name: "Spellcasting", description: "You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations." }],
            2: [{ name: "Jack of All Trades", description: "Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus." }, { name: "Song of Rest", description: "Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points." }],
            3: [{ name: "Bard College", description: "At 3rd level, you delve into the advanced techniques of a bard college of your choice." }, { name: "Expertise", description: "At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." }],
            5: [{ name: "Font of Inspiration", description: "Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest." }],
            6: [{ name: "Countercharm", description: "At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed." }],
            10: [{ name: "Magical Secrets", description: "By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip." }],
            20: [{ name: "Superior Inspiration", description: "At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use." }]
        },
        subclassTitle: "Bard College",
        subclassLevel: 3,
        subclasses: [{ name: "College of Dance" }, { name: "College of Glamour" }, { name: "College of Lore" }, { name: "College of Valor" }]
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
        features: {
            1: [{ name: "Spellcasting", description: "As a conduit for divine power, you can cast cleric spells." }, { name: "Divine Domain", description: "Choose one domain related to your deity. Your choice grants you domain spells and other features when you choose it at 1st level. It also grants you additional ways to use Channel Divinity when you gain that feature at 2nd level, and additional benefits at 6th, 8th, and 17th levels." }],
            2: [{ name: "Channel Divinity (1/rest)", description: "At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains grant you additional effects as you advance in levels, as noted in the domain description." }],
            5: [{ name: "Destroy Undead (CR 1/2)", description: "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold." }],
            10: [{ name: "Divine Intervention", description: "Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great." }]
        },
        subclassTitle: "Divine Domain",
        subclassLevel: 1,
        subclasses: [{ name: "Life Domain" }, { name: "Light Domain" }, { name: "Trickery Domain" }, { name: "War Domain" }]
    },
    "Druid": {
        name: "Druid",
        hitDie: 8,
        savingThrows: ["int", "wis"],
        proficiencies: {
            armor: ["Light armor", "Medium armor", "Shields (druids will not wear armor or use shields made of metal)"],
            weapons: ["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
            tools: ["Herbalism kit"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"]
        },
        spellcastingAbility: "wis",
        features: {
            1: [{ name: "Druidic", description: "You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages." }, { name: "Spellcasting", description: "Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will." }],
            2: [{ name: "Wild Shape", description: "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before." }, { name: "Druid Circle", description: "At 2nd level, you choose to identify with a circle of druids." }],
            18: [{ name: "Timeless Body", description: "Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year." }, { name: "Beast Spells", description: "Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape." }],
            20: [{ name: "Archdruid", description: "At 20th level, you can use your Wild Shape an unlimited number of times." }]
        },
        subclassTitle: "Druid Circle",
        subclassLevel: 2,
        subclasses: [{ name: "Circle of the Land" }, { name: "Circle of the Moon" }]
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
        features: {
            1: [{ name: "Fighting Style", description: "You adopt a particular style of fighting as your specialty. Choose one of the following options. You can’t take a Fighting Style option more than once, even if you later get to choose again." }, { name: "Second Wind", description: "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again." }],
            2: [{ name: "Action Surge", description: "Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again." }],
            3: [{ name: "Martial Archetype", description: "At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques." }],
            5: [{ name: "Extra Attack", description: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn." }],
            9: [{ name: "Indomitable", description: "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can’t use this feature again until you finish a long rest." }]
        },
        subclassTitle: "Martial Archetype",
        subclassLevel: 3,
        subclasses: [{ name: "Battle Master" }, { name: "Champion" }, { name: "Eldritch Knight" }]
    },
    "Monk": {
        name: "Monk",
        hitDie: 8,
        savingThrows: ["str", "dex"],
        proficiencies: {
            armor: [],
            weapons: ["Simple weapons", "Shortswords"],
            tools: ["Any one type of artisan's tools or any one musical instrument"]
        },
        skillProficiencies: {
            choose: 2,
            from: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"]
        },
        spellcastingAbility: null,
        features: {
            1: [{ name: "Unarmored Defense", description: "Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier." }, { name: "Martial Arts", description: "At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don’t have the two-handed or heavy property." }],
            2: [{ name: "Ki", description: "Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of the Monk table." }, { name: "Unarmored Movement", description: "Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield." }],
            3: [{ name: "Monastic Tradition", description: "When you reach 3rd level, you commit yourself to a monastic tradition." }, { name: "Deflect Missiles", description: "Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack." }]
        },
        subclassTitle: "Monastic Tradition",
        subclassLevel: 3,
        subclasses: [{ name: "Way of the Open Hand" }, { name: "Way of Shadow" }, { name: "Way of the Four Elements" }]
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
        features: {
            1: [{ name: "Divine Sense", description: "The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces." }, { name: "Lay on Hands", description: "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5." }],
            2: [{ name: "Fighting Style", description: "At 2nd level, you adopt a style of fighting as your specialty." }, { name: "Spellcasting", description: "By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does." }, { name: "Divine Smite", description: "Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon’s damage." }],
            3: [{ name: "Divine Health", description: "By 3rd level, the divine magic flowing through you makes you immune to disease." }, { name: "Sacred Oath", description: "When you reach 3rd level, you swear the oath that binds you as a paladin forever." }]
        },
        subclassTitle: "Sacred Oath",
        subclassLevel: 3,
        subclasses: [{ name: "Oath of Devotion" }, { name: "Oath of the Ancients" }, { name: "Oath of Vengeance" }]
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
        features: {
            1: [{ name: "Favored Enemy", description: "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy." }, { name: "Natural Explorer", description: "You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions." }],
            2: [{ name: "Fighting Style", description: "At 2nd level, you adopt a particular style of fighting as your specialty." }, { name: "Spellcasting", description: "By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does." }],
            3: [{ name: "Ranger Archetype", description: "At 3rd level, you choose an archetype that you strive to emulate." }, { name: "Primeval Awareness", description: "Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you." }]
        },
        subclassTitle: "Ranger Archetype",
        subclassLevel: 3,
        subclasses: [{ name: "Hunter" }, { name: "Beast Master" }]
    },
    "Rogue": {
        name: "Rogue",
        hitDie: 8,
        savingThrows: ["dex", "int"],
        proficiencies: {
            armor: ["Light armor"],
            weapons: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
            tools: ["Thieves' tools"]
        },
        skillProficiencies: {
            choose: 4,
            from: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"]
        },
        spellcastingAbility: null,
        features: {
            1: [{ name: "Expertise", description: "At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves’ tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies." }, { name: "Sneak Attack", description: "Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll." }, { name: "Thieves’ Cant", description: "During your rogue training you learned thieves’ cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation." }],
            2: [{ name: "Cunning Action", description: "Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action." }]
        },
        subclassTitle: "Roguish Archetype",
        subclassLevel: 3,
        subclasses: [{ name: "Thief" }, { name: "Assassin" }, { name: "Arcane Trickster" }]
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
        features: {
            1: [{ name: "Spellcasting", description: "An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells." }, { name: "Sorcerous Origin", description: "Choose a sorcerous origin, which describes the source of your innate magical power." }],
            2: [{ name: "Font of Magic", description: "At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects." }],
            3: [{ name: "Metamagic", description: "At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice." }]
        },
        subclassTitle: "Sorcerous Origin",
        subclassLevel: 1,
        subclasses: [{ name: "Draconic Bloodline" }, { name: "Wild Magic" }]
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
        features: {
            1: [{ name: "Otherworldly Patron", description: "At 1st level, you have struck a bargain with an otherworldly being of your choice." }, { name: "Pact Magic", description: "Your arcane research and the magic bestowed on you by your patron have given you facility with spells." }],
            2: [{ name: "Eldritch Invocations", description: "In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability." }],
            3: [{ name: "Pact Boon", description: "At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice." }]
        },
        subclassTitle: "Otherworldly Patron",
        subclassLevel: 1,
        subclasses: [{ name: "The Archfey" }, { name: "The Fiend" }, { name: "The Great Old One" }]
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
        features: {
            1: [{ name: "Spellcasting", description: "As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power." }, { name: "Arcane Recovery", description: "You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover." }],
            2: [{ name: "Arcane Tradition", description: "When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools." }],
            18: [{ name: "Spell Mastery", description: "At 18th level, you have achieved such mastery over certain spells that you can cast them at will." }],
            20: [{ name: "Signature Spells", description: "When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort." }]
        },
        subclassTitle: "Arcane Tradition",
        subclassLevel: 2,
        subclasses: [{ name: "School of Abjuration" }, { name: "School of Conjuration" }, { name: "School of Divination" }, { name: "School of Enchantment" }, { name: "School of Evocation" }, { name: "School of Illusion" }, { name: "School of Necromancy" }, { name: "School of Transmutation" }]
    }
};