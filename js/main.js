// js/main.js

const DndSheet = {
    pages: {},
    stores: {},
    data: {},
    helpers: {},
    handlers: {},
    app: {},
};

// Core application logic (rendering, navigation)
// MODIFIED: This IIFE now runs immediately, creating the app object so other files can access it.
DndSheet.app = (function() {
    // These will be assigned once the DOM is ready in the init() function
    let contentArea;
    let summaryHeaderArea;
    
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';

    function render() {
        const character = DndSheet.stores.character.get();
        summaryHeaderArea.innerHTML = DndSheet.pages.renderCharacterSummaryHeader(character);
        
        let pageHtml = '';
        switch (currentPage) {
            case 'dashboard': pageHtml = DndSheet.pages.DashboardPage(character, currentSubPage); break;
            case 'character-editor': pageHtml = DndSheet.pages.CharacterEditorPage(character, currentSubPage); break;
            case 'inventory': pageHtml = DndSheet.pages.InventoryContainerPage(character, currentSubPage); break;
            case 'homebrew': pageHtml = DndSheet.pages.HomebrewContainerPage(character, currentSubPage); break;
            case 'notes': pageHtml = DndSheet.pages.NotesPage(character, currentSubPage); break;
            default: pageHtml = '<h2>Page Not Found</h2>';
        }
        contentArea.innerHTML = pageHtml;
        updateNavStyles();

        // Activate search bars and other dynamic handlers based on the current page
        if (currentPage === 'inventory' && currentSubPage === 'all') {
            if (typeof DndSheet.app.attachItemBrowserSearch === 'function') {
                DndSheet.app.attachItemBrowserSearch();
            }
        }
        if (currentPage === 'inventory' && currentSubPage === 'stored') {
            if (typeof DndSheet.app.attachContainerBrowserSearch === 'function') {
                DndSheet.app.attachContainerBrowserSearch();
            }
            // MODIFIED: This now also attaches the handler for the custom container form
            if (typeof DndSheet.pages.attachStoredItemsPageHandlers === 'function') {
                DndSheet.pages.attachStoredItemsPageHandlers();
            }
        }
    }

    function updateNavStyles() {
        document.querySelectorAll('.main-nav-button').forEach(btn => {
            if (btn.dataset.page === currentPage) {
                btn.classList.add('bg-indigo-700', 'text-white');
                btn.classList.remove('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            } else {
                btn.classList.remove('bg-indigo-700', 'text-white');
                btn.classList.add('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            }
        });
    }
    
    // Expose public methods
    return {
        render,
        setCurrentPage: (page) => {
            currentPage = page;
            localStorage.setItem('currentPage', currentPage);
            // Set default sub-page for new main page
            if (currentPage === 'dashboard') currentSubPage = 'skills';
            else if (currentPage === 'inventory') currentSubPage = 'equipped';
            else if (currentPage === 'notes') currentSubPage = 'character';
            else if (currentPage === 'character-editor') currentSubPage = 'basic';
            else if (currentPage === 'homebrew') currentSubPage = 'race';
            else currentSubPage = '';
            localStorage.setItem('currentSubPage', currentSubPage);
            render();
        },
        setCurrentSubPage: (subpage) => {
            currentSubPage = subpage;
            localStorage.setItem('currentSubPage', currentSubPage);
            render();
        },
        // ADDED: An init function to handle setup once the DOM is loaded
        init: function() {
            contentArea = document.getElementById('content-area');
            summaryHeaderArea = document.getElementById('character-summary-header');

            loadHomebrewData();
            DndSheet.handlers.initialize();
            DndSheet.stores.character.subscribe(DndSheet.app.render);
            
            document.querySelectorAll('.main-nav-button').forEach(button => {
                button.addEventListener('click', () => {
                    DndSheet.app.setCurrentPage(button.dataset.page);
                });
            });

            DndSheet.stores.character.init();
        }
    };
})();

// MODIFIED: The DOMContentLoaded listener now just calls the app's init function.
document.addEventListener('DOMContentLoaded', () => {
    DndSheet.app.init();
});