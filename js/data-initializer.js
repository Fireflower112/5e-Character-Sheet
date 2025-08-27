// js/data-initializer.js

(function() {
    const createItemMap = (itemArray) => {
        if (!Array.isArray(itemArray)) return {};
        return itemArray.reduce((acc, item) => {
            if (item && item.name && !acc[item.name]) {
                acc[item.name] = item;
            }
            return acc;
        }, {});
    };

    const wotcItems = createItemMap(DndSheet.rawData.WotC_common_items);
    const homebrewContainers = createItemMap(DndSheet.rawData.homebrewContainers);
    
    // MODIFIED: Logic to filter out specialty containers
    const containersToRemove = [
        'Alchemy Jug', 'Bag of Beans', 'Bag of Devouring', 'Bag of Tricks',
        'Component pouch', 'Efficient Quiver', 'Quiver of Ehlonna', 'Flask',
        'Glass bottle', 'Jug', 'Vial', 'Gray Bag of Tricks', 'Rust Bag of Tricks', 'Tan Bag of Tricks'
    ];
    
    const filteredRawContainers = (DndSheet.rawData.WotC_containers || []).filter(container => 
        !containersToRemove.includes(container.name)
    );
    
    // Create separate maps for containers and general items
    const wotcContainers = createItemMap(filteredRawContainers);
    DndSheet.data.allContainers = wotcContainers; // For the new container search

    // Combine all items for the general item browser
    DndSheet.data.allItems = {
        ...wotcItems,
        ...homebrewContainers
    };
})();