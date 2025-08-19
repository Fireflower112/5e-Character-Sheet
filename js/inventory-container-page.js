// js/inventory-container-page.js

window.InventoryContainerPage = (character, subPage) => {
    // Determine which sub-tab is active for styling
    const isEquippedActive = subPage === 'equipped';
    const isStoredActive = subPage === 'stored';
    const isAllActive = subPage === 'all';

    let subContent = '';
    // Based on the active sub-page, call the appropriate rendering function
    switch(subPage) {
        case 'equipped':
            subContent = `<h3 class="text-xl font-semibold">Equipped Items & Currency</h3><p>Coming soon...</p>`;
            break;
        case 'stored':
            subContent = `<h3 class="text-xl font-semibold">Stored Items (by container)</h3><p>Coming soon...</p>`;
            break;
        case 'all':
            // Reusing your existing "Inventory" page code!
            subContent = window.InventoryPage(character);
            break;
    }

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Inventory</h2>
            <div class="flex space-x-2 border-b mb-4">
                <button data-subpage="equipped" class="sub-tab-button ${isEquippedActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Equipped & Currency</button>
                <button data-subpage="stored" class="sub-tab-button ${isStoredActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Stored Items</button>
                <button data-subpage="all" class="sub-tab-button ${isAllActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">All Items</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};