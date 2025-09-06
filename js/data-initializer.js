// js/data-initializer.js

(function() {
    // --- This section for ITEMS and CONTAINERS remains UNCHANGED ---
    const processItemArray = (itemArray) => {
        if (!Array.isArray(itemArray)) return {};
        return itemArray.reduce((acc, item) => {
            if (item && item.name && !acc[item.name] && item.properties) {
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
    const homebrewContainers = processItemArray(DndSheet.data.homebrew_containers); 

    DndSheet.data.allItems = {
        ...basicItems,
        ...commonMagicItems,
        ...containerItems,
        ...homebrewContainers
    };
    
    // --- MODIFIED: This entire section for SPELLS is new ---
    const createSpellMap = (spellArray) => {
        if (!Array.isArray(spellArray)) return {};
        return spellArray.reduce((acc, spell) => {
            if (spell && spell.name) {
                acc[spell.name] = spell;
            }
            return acc;
        }, {});
    };

    // Create a map from your original all_spells.js file
    const oldSpellsMap = createSpellMap(DndSheet.data.allSpells);

    // Create a map from your new formatted_spells.js file
    const newSpellsMap = createSpellMap(DndSheet.data.formattedSpells);

    // Merge them, with the NEW formatted spells overwriting the OLD ones
    DndSheet.spells = {
        ...oldSpellsMap,
        ...newSpellsMap
    };

})();