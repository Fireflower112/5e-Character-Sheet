// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const mainNavButtons = document.querySelectorAll('.main-nav-button');

    // State to track the current page and sub-page
    let currentPage = 'dashboard';
    let currentSubPage = 'basic'; // Default sub-page

    // The main function to render the application
    const renderApp = () => {
        // Get the most current character data from the store
        const character = window.stores.character.get();
        if (!character || Object.keys(character).length === 0) {
            contentArea.innerHTML = '<p>Loading character...</p>';
            return;
        }

        let pageHtml = '';
        // Determine which page component to use based on the current state
        switch (currentPage) {
            case 'dashboard':
                pageHtml = window.DashboardPage(character, currentSubPage);
                break;
            case 'character-editor':
                pageHtml = window.CharacterEditorPage(character, currentSubPage);
                break;
            case 'inventory':
                pageHtml = window.InventoryContainerPage(character, currentSubPage);
                break;
            case 'spells':
                pageHtml = window.SpellsPage(character);
                break;
            case 'notes':
                pageHtml = window.NotesPage(character, currentSubPage);
                break;
            default:
                pageHtml = '<h2>Page Not Found</h2>';
        }

        // Inject the generated HTML into the main content area
        contentArea.innerHTML = pageHtml;

        // Re-attach all necessary event handlers for the newly rendered content
        attachContentHandlers();

        // Update active styles on navigation
        updateNavStyles();
    };
    
    // A single function to attach all event handlers
    function attachContentHandlers() {
        if (window.attachMainPageHandlers) window.attachMainPageHandlers();
        if (window.attachInfoPageHandlers) window.attachInfoPageHandlers();
        if (window.attachSkillsPageHandlers) window.attachSkillsPageHandlers();
        if (window.attachInventoryHandlers) window.attachInventoryHandlers();
        if (window.attachSpellsPageHandlers) window.attachSpellsPageHandlers();
        if (window.attachNotesPageHandlers) window.attachNotesPageHandlers();
        if (window.attachStoredItemsPageHandlers) window.attachStoredItemsPageHandlers();
    }

    function updateNavStyles() {
        mainNavButtons.forEach(btn => {
            if (btn.dataset.page === currentPage) {
                btn.classList.add('bg-indigo-700', 'text-white');
                btn.classList.remove('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            } else {
                btn.classList.remove('bg-indigo-700', 'text-white');
                btn.classList.add('text-gray-300', 'hover:bg-indigo-500', 'hover:text-white');
            }
        });
    }

    // --- Event Listeners ---

    // Handle main page navigation
    mainNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = button.dataset.page;
            // Reset to a default sub-page when switching main tabs
            currentSubPage = 'basic'; 
            if (currentPage === 'inventory') currentSubPage = 'equipped';
            if (currentPage === 'notes') currentSubPage = 'character';
            renderApp();
        });
    });

    // Handle sub-page navigation using event delegation
    contentArea.addEventListener('click', (e) => {
        if (e.target.classList.contains('sub-tab-button')) {
            const subpage = e.target.dataset.subpage;
            if (subpage) {
                currentSubPage = subpage;
                renderApp();
            }
        }
    });

    // --- Initialization ---
    
    // Subscribe the render function to the character store.
    // Now, any time the character data changes, the app will automatically re-render.
    window.stores.character.subscribe(renderApp);

    // Initialize the character store, which triggers the first render.
    window.stores.character.init();
});