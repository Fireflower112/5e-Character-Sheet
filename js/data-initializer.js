// js/data-initializer.js

(function() {
    /**
     * Converts an array of items into an object keyed by name, and adds
     * an 'isMagic' flag based on the item's rarity property.
     */
    const processItemArray = (itemArray) => {
        if (!Array.isArray(itemArray)) return {};
        return itemArray.reduce((acc, item) => {
            if (item && item.name && !acc[item.name]) {
                const rarity = (item.properties['Item Rarity'] || '').toLowerCase();
                // Items are considered non-magical if their rarity is 'Standard', 'None', or not specified.
                const isMagic = !['standard', 'none', ''].includes(rarity);
                acc[item.name] = { ...item, isMagic: isMagic };
            }
            return acc;
        }, {});
    };

    // Filter out specialty containers from the container list
    const containersToRemove = [
        'Alchemy Jug', 'Bag of Beans', 'Bag of Devouring', 'Bag of Tricks',
        'Component pouch', 'Efficient Quiver', 'Quiver of Ehlonna', 'Flask',
        'Glass bottle', 'Jug', 'Vial', 'Gray Bag of Tricks', 'Rust Bag of Tricks', 'Tan Bag of Tricks'
    ];
    const filteredRawContainers = (DndSheet.rawData.WotC_containers || []).filter(container => 
        !containersToRemove.includes(container.name)
    );
    DndSheet.data.allContainers = processItemArray(filteredRawContainers);

    // Process all item types and merge them into one master list for the item browser
    const basicItems = processItemArray(DndSheet.rawData.WotC_basic_items);
    const commonMagicItems = processItemArray(DndSheet.rawData.WotC_common_items);
    const containerItems = processItemArray(DndSheet.rawData.WotC_containers); // Note: We use the full list for the main browser
    const homebrewContainers = createItemMap(DndSheet.rawData.homebrewContainers); // This helper from the old file is fine for homebrew

    DndSheet.data.allItems = {
        ...basicItems,
        ...commonMagicItems,
        ...containerItems,
        ...homebrewContainers
    };

    // Helper function for homebrew containers which don't have rarity
    function createItemMap(itemArray) {
        if (!Array.isArray(itemArray)) return {};
        return itemArray.reduce((acc, item) => {
            if (item && item.name && !acc[item.name]) {
                // Assume homebrew containers are magical for now
                acc[item.name] = { ...item, isMagic: true };
            }
            return acc;
        }, {});
    };
})();