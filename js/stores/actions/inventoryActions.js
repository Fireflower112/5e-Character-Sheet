// js/stores/actions/inventoryActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    function addPremadeItem(itemData) {
        let weight = 0;
        let description = itemData.description; 

        if (itemData.properties && typeof itemData.properties.Weight !== 'undefined') {
            weight = itemData.properties.Weight;
        } else if (typeof description === 'string') {
            const regex = /(?:Weight:|weighs)\s*(\d+(\.\d+)?)/i;
            const match = description.match(regex);
            if (match && match[1]) {
                weight = parseFloat(match[1]);
                description = description.replace(match[0], '').trim();
            }
        }

        let newItemType = 'other';
        const sourceType = itemData.properties['Item Type'] || '';
        const lowerSourceType = sourceType.toLowerCase();
        if (lowerSourceType.includes('weapon')) {
            newItemType = 'weapon';
        } else if (lowerSourceType.includes('shield')) {
            newItemType = 'shield';
        } else if (lowerSourceType.includes('armor')) {
            newItemType = 'armor';
        }

        // NEW: Logic to determine rarity from properties or description
        let rarity = 'common'; // Default rarity
        const structuredRarity = itemData.properties['Item Rarity'];

        if (structuredRarity && structuredRarity.toLowerCase() !== 'no') {
            rarity = structuredRarity.toLowerCase();
        } else if (typeof description === 'string') {
            // Use a regex to find the first mention of a rarity keyword in the description
            const rarityRegex = /\b(common|uncommon|rare|very rare|legendary|artifact)\b/i;
            const match = description.match(rarityRegex);
            if (match) {
                rarity = match[0].toLowerCase();
            }
        }

        const newItem = {
            id: uuid(),
            name: itemData.name,
            description: description,
            rarity: rarity, // Use the determined rarity
            itemType: newItemType,
            weight: weight
        };
        addItem(newItem);
    }
	
	 function addPremadeContainer(containerData) {
        const description = containerData.description || '';
        let capacity = 0;
        let weight = 0;

        // Extract capacity (e.g., "hold up to 30 pounds")
        const capacityMatch = description.match(/(?:holds?|can hold) (?:up to )?(\d+) pounds/i);
        if (capacityMatch) {
            capacity = parseFloat(capacityMatch[1]);
        }

        // Extract weight (e.g., "Weight: 5")
        const weightMatch = description.match(/Weight: (\d+(\.\d+)?)/i);
        if (weightMatch) {
            weight = parseFloat(weightMatch[1]);
        } else if (containerData.properties.Weight) {
            weight = containerData.properties.Weight;
        }

        const newContainer = {
            name: containerData.name,
            description: description,
            capacity: capacity,
            weight: weight
        };
        addContainer(newContainer); // Use the existing addContainer action
    }

    function addItem(itemData) {
        const character = store.get();
        const newItem = itemData.id ? itemData : { ...itemData, id: uuid() }; 
        const newItems = { ...character.inventory.items, [newItem.id]: newItem };
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function updateItem(itemId, updates) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if(newItems[itemId]) {
            Object.assign(newItems[itemId], updates);
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

    function addContainer(containerData) {
        const character = store.get();
        const newContainer = { ...containerData, id: uuid() };
        const newContainers = { ...character.inventory.containers, [newContainer.id]: newContainer };
        store.set({ inventory: { ...character.inventory, containers: newContainers } });
    }

    function deleteItem(itemId) {
        const character = store.get();
        const newItems = { ...character.inventory.items };
        delete newItems[itemId];
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function assignItemToContainer(itemId, containerId) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId]) {
            newItems[itemId].containerId = (containerId === 'none') ? null : containerId;
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

    function equipItemToSlot(itemId, slot) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        const itemToEquip = newItems[itemId];
        if (!itemToEquip) return;

        Object.values(newItems).forEach(item => {
            if (item.id !== itemId && item.equippedSlot === slot && slot !== 'none') {
                item.equippedSlot = null;
            }
        });
        
        itemToEquip.equippedSlot = (slot === 'none') ? null : slot;
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function toggleFavoriteItem(itemId) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId]) {
            newItems[itemId].favorited = !newItems[itemId].favorited;
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

    function toggleAttunement(itemId) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId] && newItems[itemId].requiresAttunement) {
            newItems[itemId].attuned = !newItems[itemId].attuned;
            store.set({ inventory: { ...character.inventory, items: newItems } });
        }
    }

   Object.assign(actions, {
        addItem,
        addPremadeItem,
        addPremadeContainer, // Add the new function to the actions
        updateItem,
        addContainer,
        deleteItem,
        assignItemToContainer,
        equipItemToSlot,
        toggleFavoriteItem,
        toggleAttunement,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);