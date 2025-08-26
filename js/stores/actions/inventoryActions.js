// js/stores/actions/inventoryActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // NEW function for adding items from the browser
    function addPremadeItem(itemData) {
        const newItem = {
            id: uuid(),
            name: itemData.name,
            description: itemData.description,
            rarity: itemData.rarity || 'common',
            itemType: itemData.properties['Item Type'] || 'other',
            // You can add more property mappings here later
        };
        addItem(newItem); // Use the existing addItem function to save it
    }

    // UPDATED to accept a pre-made item object
    function addItem(itemData) {
        const character = store.get();
        const newItem = itemData.id ? itemData : { ...itemData, id: uuid() }; // Assign UUID if it doesn't have one
        const newItems = { ...character.inventory.items, [newItem.id]: newItem };
        store.set({ inventory: { ...character.inventory, items: newItems } });
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
        addPremadeItem, // <-- Add the new action here
        updateItem,
        addContainer,
        deleteItem,
        assignItemToContainer,
        equipItemToSlot,
        toggleFavoriteItem,
        toggleAttunement,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);