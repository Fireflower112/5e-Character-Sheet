// js/inventory-container-page.js

DndSheet.pages.InventoryContainerPage = (character, subPage) => {
    const isEquippedActive = subPage === 'equipped';
    const isStoredActive = subPage === 'stored';
    const isAllActive = subPage === 'all';

    let subContent = '';
    switch(subPage) {
        case 'equipped':
            subContent = DndSheet.pages.EquippedItemsPage(character);
            break;
        case 'stored':
            subContent = DndSheet.pages.StoredItemsPage(character);
            break;
        case 'all':
            subContent = DndSheet.pages.AllItemsPage(character);
            break;
        default:
            subContent = DndSheet.pages.EquippedItemsPage(character);
            break;
    }

    return `
        <div>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="equipped" class="sub-tab-button ${isEquippedActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Equipped & Currency</button>
                <button data-action="sub-tab" data-subpage="stored" class="sub-tab-button ${isStoredActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Stored Items</button>
                <button data-action="sub-tab" data-subpage="all" class="sub-tab-button ${isAllActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">All Items</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};