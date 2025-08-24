// js/utils.js

function loadHomebrewData() {
    try {
        const homebrewRaces = JSON.parse(localStorage.getItem('homebrewRaces') || '{}');
        Object.assign(DndSheet.data.races, homebrewRaces);

        const homebrewSubraces = JSON.parse(localStorage.getItem('homebrewSubraces') || '{}');
        for (const baseRaceName in homebrewSubraces) {
            if (DndSheet.data.races[baseRaceName] && homebrewSubraces[baseRaceName].length > 0) {
                if (!DndSheet.data.races[baseRaceName].subraces) {
                    DndSheet.data.races[baseRaceName].subraces = [];
                }
                homebrewSubraces[baseRaceName].forEach(newSubrace => {
                    const existingIndex = DndSheet.data.races[baseRaceName].subraces.findIndex(s => s.name === newSubrace.name);
                    if (existingIndex > -1) {
                        DndSheet.data.races[baseRaceName].subraces[existingIndex] = newSubrace;
                    } else {
                        DndSheet.data.races[baseRaceName].subraces.push(newSubrace);
                    }
                });
            }
        }
    } catch (e) {
        console.error("Failed to load homebrew data:", e);
    }
}

DndSheet.helpers.showMessage = (message, color) => {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.style.backgroundColor = color;
    messageBox.classList.add('show');
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
};