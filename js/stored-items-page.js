// js/stored-items-page.js

DndSheet.pages.StoredItemsPage = (character) => {
    const containers = Object.values(character.inventory.containers || {});
    const allItems = Object.values(character.inventory.items || {});

    const renderContainers = () => {
        if (containers.length === 0) {
            return `<p class="text-gray-500 italic">No containers created yet. Add one below.</p>`;
        }
        return containers.map(container => {
            const itemsInContainer = allItems.filter(item => item.containerId === container.id);
            const totalWeight = itemsInContainer.reduce((sum, item) => sum + (item.weight || 0), 0);
            
            return `
                <div class="bg-white p-4 rounded-lg shadow-sm" data-accordion-wrapper>
                    <button class="w-full text-left" data-action="toggle-accordion">
                        <div class="flex justify-between items-center">
                            <h4 class="font-semibold text-lg text-indigo-700">${container.name}</h4>
                            <span class="text-sm font-medium text-gray-600">
                                Contents: ${totalWeight.toFixed(1)} lbs / ${container.capacity || 0} lbs
                            </span>
                        </div>
                    </button>
                    <div class="accordion-details hidden mt-2 pt-2 border-t">
                        <p class="text-xs text-gray-500 mb-2">${container.description || ''}</p>
                        ${itemsInContainer.length > 0
                            // MODIFIED: This block now renders each item as a clickable accordion
                            ? itemsInContainer.map(item => `
                                <div class="p-2 border-b" data-accordion-wrapper>
                                    <button class="w-full flex justify-between items-center text-left text-sm" data-action="toggle-accordion">
                                        <span>${item.name}</span>
                                        <span class="text-xs text-gray-500">${item.weight || 0} lbs</span>
                                    </button>
                                    <div class="accordion-details hidden mt-1 pt-1 border-t">
                                        <p class="text-xs text-gray-600 italic">${item.description || 'No description.'}</p>
                                    </div>
                                </div>`).join('')
                            : '<p class="text-xs text-gray-400 italic">This container is empty.</p>'
                        }
                    </div>
                </div>
            `;
        }).join('');
    };

    return `
        <div>
            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                    <h3 class="text-xl font-semibold mb-3">Stored Items by Container</h3>
                    <div class="space-y-4">${renderContainers()}</div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Find & Add a Container</h3>
                    <input type="text" id="container-search-input" placeholder="Search for a container (e.g., Backpack)..." class="w-full p-2 border rounded-md mb-3">
                    <div id="container-browser-results" class="bg-white rounded-md shadow-sm max-h-60 overflow-y-auto">
                        <p class="text-gray-500 italic p-4 text-center">Start typing to search for containers.</p>
                    </div>
                </div>

                <div class="bg-gray-100 p-6 rounded-2xl shadow-inner">
                    <h3 class="text-lg font-semibold mb-3">Add Custom Container</h3>
                    <form id="add-container-form" class="space-y-4">
                        <div>
                            <label for="container-name" class="block text-sm font-medium">Container Name</label>
                            <input type="text" id="container-name" required class="w-full p-2 border rounded-md">
                        </div>
                        <textarea id="container-description" placeholder="Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label for="container-capacity" class="block text-sm font-medium">Capacity (lbs)</label><input type="number" id="container-capacity" value="0" step="0.1" class="w-full p-2 border rounded-md"></div>
                            <div><label for="container-weight" class="block text-sm font-medium">Weight (lbs)</label><input type="number" id="container-weight" value="0" step="0.1" class="w-full p-2 border rounded-md"></div>
                        </div>
                        <button type="button" id="add-container-btn" data-action="add-container" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Custom Container</button>
                    </form>
                </div>
            </div>
        </div>
    `;
};

DndSheet.pages.attachStoredItemsPageHandlers = () => {
    const addContainerBtn = document.getElementById('add-container-btn');
    if (!addContainerBtn) return;
};