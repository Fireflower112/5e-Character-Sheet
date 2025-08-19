// js/inventory-container-page.js

// No more DOMContentLoaded wrapper. The function is defined directly.
window.InventoryContainerPage = (character, subPage) => {
    // Determine which sub-tab is active for styling
    const isEquippedActive = subPage === 'equipped';
    const isStoredActive = subPage === 'stored';
    const isAllActive = subPage === 'all';

    let subContent = '';
    // Now, window.EquippedItemsPage is guaranteed to exist when this is called.
    switch(subPage) {
        case 'equipped':
            // This function is not defined in the provided files,
            // but assuming it exists, the logic is sound.
            subContent = window.EquippedItemsPage(character);
            break;
        case 'stored':
            subContent = window.StoredItemsPage(character);
            break;
        case 'all':
             // This function is not defined in the provided files,
            // but assuming it exists, the logic is sound.
            subContent = window.InventoryPage(character);
            break;
    }

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Inventory</h2>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="equipped" class="sub-tab-button ${isEquippedActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Equipped Items</button>
                <button data-action="sub-tab" data-subpage="stored" class="sub-tab-button ${isStoredActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Stored Items</button>
                <button data-action="sub-tab" data-subpage="all" class="sub-tab-button ${isAllActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">All Items</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};

// The event listener from the original file is no longer needed here.