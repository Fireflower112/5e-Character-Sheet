// js/handlers/homebrew-handlers.js

DndSheet.handlers.homebrewClickHandlers = {
    'open-homebrew-modal': () => DndSheet.pages.showHomebrewRaceModal(),
    'open-homebrew-subrace-modal': () => {
        const character = DndSheet.stores.character.get();
        DndSheet.pages.showHomebrewSubraceModal(character.race);
    },
    'delete-homebrew-race': (target) => {
        const { raceName } = target.dataset;
        if (confirm(`Are you sure you want to delete the "${raceName}" race?`)) {
            DndSheet.stores.character.deleteHomebrewRace(raceName);
        }
    },
    'edit-homebrew-race': (target) => {
        const { raceName } = target.dataset;
        const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
        const raceToEdit = homebrewRaces[raceName];
        if (raceToEdit) {
            DndSheet.pages.showHomebrewRaceModal(raceToEdit);
        }
    },
    'delete-homebrew-subrace': (target) => {
        const { raceName, subraceName } = target.dataset;
        if (confirm(`Are you sure you want to delete the "${subraceName}" subrace?`)) {
            DndSheet.stores.character.deleteHomebrewSubrace(raceName, subraceName);
        }
    },
    'edit-homebrew-subrace': (target) => {
        const { raceName, subraceName } = target.dataset;
        const allRaces = {...DndSheet.data.races, ...JSON.parse(localStorage.getItem('homebrewRaces') || '{}')};
        const baseRace = allRaces[raceName];
        const subraceToEdit = baseRace?.subraces.find(s => s.name === subraceName);
        if (subraceToEdit) {
            DndSheet.pages.showHomebrewSubraceModal(raceName, subraceToEdit);
        }
    },
};

// No homebrew-specific change handlers yet
DndSheet.handlers.homebrewChangeHandlers = {};