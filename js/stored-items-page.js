// js/stored-items-page.js

DndSheet.pages.StoredItemsPage = (character) => {
    const containers = Object.values(character.inventory.containers || {});
    const allItems = Object.values(character.inventory.items || {});

    const renderAccordionDetails = (item) => {
        return `<p class="text-gray-600 text-sm italic">${item.description || 'No description.'}</p>`;
    }

    const renderContainers = () => {
        if (containers.length === 0) {
            return `<p class="text-gray-500 italic">No containers created yet. Add one below.</p>`;
        }
        return containers.map(container => {
            const itemsInContainer = allItems.filter(item => item.containerId === container.id);
            const totalWeight = itemsInContainer.reduce((sum, item) => sum + (item.weight || 0), 0);

            return `
                <div class="bg-white p-4 rounded-lg shadow-sm" id="container-${container.id}">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold text-lg">${container.name}</h4>
                        <span class="text-sm text-gray-600">Weight: ${totalWeight.toFixed(2)} / ${container.capacity || 0} lbs</span>
                    </div>
                    ${container.description ? `<p class="text-sm text-gray-500 mb-2">${container.description}</p>` : ''}
                    <div class="pl-4 border-l-2 border-gray-200 space-y-1">
                        ${itemsInContainer.length > 0
                            ? itemsInContainer.map(item => `
                                 <div data-accordion-wrapper>
                                    <button data-action="toggle-accordion" class="w-full flex justify-between items-center text-sm text-gray-800 hover:text-indigo-600">
                                        <span>${item.name} (${item.weight || 0} lbs)</span>
                                        <span class="accordion-icon text-gray-400 font-mono">[+]</span>
                                    </button>
                                    <div class="accordion-details hidden p-2 mt-1 border-t bg-gray-50 rounded-md space-y-2">
                                        ${renderAccordionDetails(item)}
                                    </div>
                                </div>
                            `).join('')
                            : `<p class="text-sm text-gray-400 italic">Container is empty.</p>`
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
                    <h3 class="text-lg font-semibold mb-3">Add New Container</h3>
                    <form id="add-container-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label for="container-name" class="block text-sm font-medium">Container Name</label><input type="text" id="container-name" required class="w-full p-2 border rounded-md"></div>
                            <div><label for="container-capacity" class="block text-sm font-medium">Capacity (lbs)</label><input type="number" id="container-capacity" value="0" class="w-full p-2 border rounded-md"></div>
                        </div>
                        <textarea id="container-description" placeholder="Container Description (Optional)" class="w-full p-2 border rounded-md"></textarea>
                        <div><label for="container-weight" class="block text-sm font-medium">Weight (when empty)</label><input type="number" id="container-weight" value="0" class="w-full p-2 border rounded-md"></div>
                        <button type="button" id="add-container-btn" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Container</button>
                    </form>
                </div>
            </div>
        </div>
    `;
};

DndSheet.pages.attachStoredItemsPageHandlers = () => {
    const content = document.getElementById('sub-content-area');
    
    content.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action="toggle-accordion"]');
        if (button) {
            const details = button.nextElementSibling;
            const icon = button.querySelector('.accordion-icon');
            details.classList.toggle('hidden');
            icon.textContent = details.classList.contains('hidden') ? '[+]' : '[-]';
        }
    });
    
    const addContainerBtn = document.getElementById('add-container-btn');
    if (addContainerBtn) {
        addContainerBtn.onclick = () => {
            const nameInput = document.getElementById('container-name');
            const newContainer = {
                name: nameInput.value,
                description: document.getElementById('container-description').value,
                capacity: parseFloat(document.getElementById('container-capacity').value) || 0,
                weight: parseFloat(document.getElementById('container-weight').value) || 0,
            };

            if (newContainer.name) {
                // --- THIS LINE IS NOW ACTIVE ---
                DndSheet.stores.characterActions.addContainer(newContainer);
                DndSheet.helpers.showMessage('Container added successfully!', 'green');
                document.getElementById('add-container-form').reset();
            } else {
                DndSheet.helpers.showMessage('Please enter a container name.', 'red');
            }
        };
    }
};