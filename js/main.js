// js/main.js

const DndSheet = {
    pages: {},
    stores: {},
    data: {},
    helpers: {},
    handlers: {}, // Namespace for our new handlers
    app: {},      // Namespace for core app logic
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Core application logic (rendering, navigation)
    DndSheet.app = (function() {
        const contentArea = document.getElementById('content-area');
        const summaryHeaderArea = document.getElementById('character-summary-header');
        
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
				case 'homebrew': pageHtml = DndSheet.pages.HomebrewContainerPage(character, currentSubPage); break; // <-- REPLACE THIS LINE
				case 'notes': pageHtml = DndSheet.pages.NotesPage(character, currentSubPage); break;
                default: pageHtml = '<h2>Page Not Found</h2>';
            }
            contentArea.innerHTML = pageHtml;
            updateNavStyles();
        }

        function updateNavStyles() {
            document.querySelectorAll('.main-nav-button').forEach(btn => {
                if (btn.dataset.page === currentPage) {
                    btn.classList.add('bg-indigo-700', 'text-white');
                } else {
                    btn.classList.remove('bg-indigo-700', 'text-white');
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
                else if (currentPage === 'homebrew') currentSubPage = 'race'; // <-- ADD THIS LINE
                else currentSubPage = '';
                render();
            },
            setCurrentSubPage: (subpage) => {
                currentSubPage = subpage;
                localStorage.setItem('currentSubPage', currentSubPage);
                render();
            }
        };
    })();

    // Initialize all parts of the application
    loadHomebrewData();
    DndSheet.handlers.initialize();
    DndSheet.stores.character.subscribe(DndSheet.app.render);
    
    // Set up main navigation
    document.querySelectorAll('.main-nav-button').forEach(button => {
        button.addEventListener('click', () => {
            DndSheet.app.setCurrentPage(button.dataset.page);
        });
    });

    // Initial load
    DndSheet.stores.character.init();
});