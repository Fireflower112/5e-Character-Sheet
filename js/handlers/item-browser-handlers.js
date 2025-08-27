// js/handlers/item-browser-handlers.js

(function() {
    let searchResults = [];

    const renderSearchResults = () => {
        const resultsContainer = document.getElementById('item-browser-results');
        if (!resultsContainer) return;

        if (searchResults.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500 italic p-4 text-center">No items found.</p>';
            return;
        }

        resultsContainer.innerHTML = searchResults.map(item => `
            <div class="p-2 border-b flex justify-between items-center">
                <div>
                    <div class="font-semibold">${item.name}</div>
                    <div class="text-xs text-gray-500">${item.properties['Item Type']} | Rarity: ${item.properties['Item Rarity'] || 'common'}</div>
                </div>
                <button data-action="add-premade-item" data-item-name="${item.name}" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600">Add</button>
            </div>
        `).join('');
    };

    // This function now checks the state of the magic item filter
    const searchItems = () => {
        const query = document.getElementById('item-search-input').value.toLowerCase();
        const magicFilterCheckbox = document.getElementById('magic-item-filter');
        const showMagicItems = magicFilterCheckbox.checked;

        const allItems = DndSheet.data.allItems || {};
        
        if (!query) {
            searchResults = [];
        } else {
            searchResults = Object.values(allItems)
                .filter(item => {
                    // Item must match both the text query AND the magic filter state
                    const nameMatch = item.name.toLowerCase().includes(query);
                    const magicMatch = item.isMagic === showMagicItems;
                    return nameMatch && magicMatch;
                })
                .slice(0, 50); // Limit to 50 results for performance
        }
        renderSearchResults();
    };

    DndSheet.handlers.itemBrowserClickHandlers = {
        'add-premade-item': (target) => {
            const itemName = target.dataset.itemName;
            const itemData = DndSheet.data.allItems[itemName];

            if (itemData) {
                DndSheet.stores.characterActions.addPremadeItem(itemData);
                DndSheet.helpers.showMessage(`${itemName} added to inventory!`, 'green');
            }
        }
    };

    // This now attaches a listener to the checkbox as well
    DndSheet.app.attachItemBrowserSearch = () => {
        const searchInput = document.getElementById('item-search-input');
        const magicFilterCheckbox = document.getElementById('magic-item-filter');

        if (searchInput) {
            searchInput.addEventListener('input', searchItems);
        }
        if (magicFilterCheckbox) {
            magicFilterCheckbox.addEventListener('change', searchItems);
        }
    };

})();