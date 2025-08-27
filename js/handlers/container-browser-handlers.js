// js/handlers/container-browser-handlers.js

(function() {
    let searchResults = [];

    const renderSearchResults = () => {
        const resultsContainer = document.getElementById('container-browser-results');
        if (!resultsContainer) return;

        if (searchResults.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500 italic p-4 text-center">No containers found.</p>';
            return;
        }

        resultsContainer.innerHTML = searchResults.map(item => `
            <div class="p-2 border-b flex justify-between items-center">
                <div>
                    <div class="font-semibold">${item.name}</div>
                </div>
                <button data-action="add-premade-container" data-container-name="${item.name}" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600">Add</button>
            </div>
        `).join('');
    };

    const searchContainers = () => {
        const query = document.getElementById('container-search-input').value.toLowerCase();
        const allContainers = DndSheet.data.allContainers || {};
        
        if (!query) {
            searchResults = [];
        } else {
            searchResults = Object.values(allContainers)
                .filter(item => item.name.toLowerCase().includes(query))
                .slice(0, 50);
        }
        renderSearchResults();
    };

    DndSheet.handlers.containerBrowserClickHandlers = {
        'add-premade-container': (target) => {
            const containerName = target.dataset.containerName;
            const containerData = DndSheet.data.allContainers[containerName];

            if (containerData) {
                DndSheet.stores.characterActions.addPremadeContainer(containerData);
                DndSheet.helpers.showMessage(`${containerName} added to containers!`, 'green');
            }
        }
    };

    DndSheet.app.attachContainerBrowserSearch = () => {
        const searchInput = document.getElementById('container-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', searchContainers);
        }
    };

})();