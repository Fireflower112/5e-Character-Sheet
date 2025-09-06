// js/main.js

const DndSheet = {
    pages: {},
    stores: {},
    data: {},
    helpers: {},
    handlers: {},
    app: {},
};

DndSheet.app = (function() {
    let contentArea;
    let summaryHeaderArea;
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';

    function attachSubNavListeners() {
        document.querySelectorAll('[data-subpage]').forEach(button => {
            button.addEventListener('click', () => {
                const subpage = button.dataset.subpage;
                DndSheet.app.setCurrentSubPage(subpage);
            });
        });
    }

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
        
        // MODIFIED: Added this function call to attach listeners to the new sub-nav buttons after they are rendered.
        attachSubNavListeners();

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
            if (typeof DndSheet.pages.attachStoredItemsPageHandlers === 'function') {
                DndSheet.pages.attachStoredItemsPageHandlers();
            }
        }
        if (currentPage === 'character-editor' && currentSubPage === 'spells') {
            if (typeof DndSheet.pages.attachSpellsEditorHandlers === 'function') {
                DndSheet.pages.attachSpellsEditorHandlers();
            }
            if (typeof DndSheet.app.attachSpellBrowserSearch === 'function') {
                DndSheet.app.attachSpellBrowserSearch();
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
    
    return {
        render,
        setCurrentPage: (page) => {
            currentPage = page;
            localStorage.setItem('currentPage', currentPage);
            // Set default subpage when changing main page
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
        init: function() {
            contentArea = document.getElementById('content-area');
            summaryHeaderArea = document.getElementById('character-summary-header');

            DndSheet.handlers.initialize();
            DndSheet.stores.character.subscribe(DndSheet.app.render);
            
            document.querySelectorAll('.main-nav-button').forEach(button => {
                button.addEventListener('click', () => {
                    DndSheet.app.setCurrentPage(button.dataset.page);
                });
            });

            DndSheet.stores.character.init(); // This will trigger the first render
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    DndSheet.app.init();
});