// js/main.js

const DndSheet = {
    pages: {}, stores: {}, data: {}, helpers: {}, handlers: {}, app: {},
};

DndSheet.app = (function() {
    let contentArea;
    let summaryHeaderArea;
    let currentPage = localStorage.getItem('currentPage') || 'dashboard';
    let currentSubPage = localStorage.getItem('currentSubPage') || 'skills';

    function attachSubNavListeners() {
        document.querySelectorAll('[data-subpage]').forEach(button => {
            if (!button.dataset.listenerAttached) {
                button.addEventListener('click', () => {
                    const subpage = button.dataset.subpage;
                    DndSheet.app.setCurrentSubPage(subpage);
                });
                button.dataset.listenerAttached = 'true';
            }
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
        
        attachSubNavListeners();

        if (currentPage === 'inventory' && currentSubPage === 'all') { /* ... your existing handler attachment ... */ }
        if (currentPage === 'inventory' && currentSubPage === 'stored') { /* ... your existing handler attachment ... */ }
        if (currentPage === 'character-editor' && currentSubPage === 'spells') { /* ... your existing handler attachment ... */ }
    }

    return {
        render,
        navigateTo: (page, subpage) => {
            currentPage = page;
            currentSubPage = subpage;
            localStorage.setItem('currentPage', currentPage);
            localStorage.setItem('currentSubPage', currentSubPage);
            render();
        },
        setCurrentPage: (page) => {
            currentPage = page;
            localStorage.setItem('currentPage', currentPage);
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

            loadHomebrewData();
            DndSheet.handlers.initialize();
            DndSheet.stores.character.subscribe(DndSheet.app.render);
            
            document.addEventListener('click', (e) => {
                const target = e.target.closest('.nav-dropdown-item');
                if (target) {
                    const page = target.dataset.page;
                    const subpage = target.dataset.subpage;
                    if (page && subpage) {
                        DndSheet.app.navigateTo(page, subpage);
                    }
                }
            });

            DndSheet.stores.character.init();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    DndSheet.app.init();
});