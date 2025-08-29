// js/data-initializer.js

(function() {
    // MODIFIED: This function was missing. It processes item arrays.
    const processItemArray = (itemArray) => {
        if (!Array.isArray(itemArray)) return {};
        return itemArray.reduce((acc, item) => {
            if (item && item.name && !acc[item.name]) {
                const rarity = (item.properties['Item Rarity'] || '').toLowerCase();
                const isMagic = !['standard', 'none', ''].includes(rarity);
                acc[item.name] = { ...item, isMagic: isMagic };
            }
            return acc;
        }, {});
    };

    const initializeAppData = () => {
        if (DndSheet.rawData.spell_slots) {
            for (const className in DndSheet.rawData.spell_slots) {
                if (DndSheet.data.classes[className]) {
                    Object.assign(DndSheet.data.classes[className], DndSheet.rawData.spell_slots[className]);
                }
            }
        }
    };
    initializeAppData();

    DndSheet.data.allContainers = processItemArray(DndSheet.rawData.WotC_containers);
    
    const basicItems = processItemArray(DndSheet.rawData.WotC_basic_items);
    const commonMagicItems = processItemArray(DndSheet.rawData.WotC_common_items);
    const containerItems = processItemArray(DndSheet.rawData.WotC_containers);
    const homebrewContainers = processItemArray(DndSheet.rawData.homebrewContainers);

    DndSheet.data.allItems = {
        ...basicItems,
        ...commonMagicItems,
        ...containerItems,
        ...homebrewContainers
    };

    // MODIFIED: This block was missing. It processes all spell lists.
    const createSpellMap = (spellArray) => {
        return (spellArray || []).reduce((acc, spell) => {
            if (spell && spell.name && !acc[spell.name]) {
                acc[spell.name] = spell;
            }
            return acc;
        }, {});
    };

    const bardSpells = createSpellMap(DndSheet.rawData.bard_spells);
    const clericSpells = createSpellMap(DndSheet.rawData.cleric_spells);
    const rangerSpells = createSpellMap(DndSheet.rawData.ranger_spells);
    const druidSpells = createSpellMap(DndSheet.rawData.druid_spells);

    DndSheet.data.allSpells = {
        ...bardSpells,
        ...clericSpells,
        ...rangerSpells,
        ...druidSpells
    };
})();