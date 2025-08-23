// js/stores/actions/inventoryActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addItem(itemData) {
        const character = store.get();
        const newItem = { ...itemData, id: uuid() };
        const newItems = { ...character.inventory.items, [newItem.id]: newItem };
        store.set({ inventory: { ...character.inventory, items: newItems } });
    }

    function updateItem(itemId, updates) {
        const character = store.get();
        const newItems = JSON.parse(JSON.stringify(character.inventory.items));
        if (newItems[itemId]) {
            newItems[itemId] = { ...newItems[itemId], ...updates };
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
        updateItem,
        addContainer,
        deleteItem,
        assignItemToContainer,
        equipItemToSlot,
        toggleFavoriteItem,
        toggleAttunement,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);