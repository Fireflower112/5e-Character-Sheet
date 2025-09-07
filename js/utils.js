// js/utils.js

function loadHomebrewData() {
    try {
        // --- Race and Subrace loading (unchanged) ---
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
        
        // --- This correctly merges homebrew spells into the master list ---
        const homebrewSpells = JSON.parse(localStorage.getItem('homebrewSpells') || '{}');
        
        if (DndSheet.data.allSpells && Object.keys(homebrewSpells).length > 0) {
            Object.values(homebrewSpells).forEach(spell => {
                const existingIndex = DndSheet.data.allSpells.findIndex(s => s.name === spell.name);
                if (existingIndex > -1) {
                    DndSheet.data.allSpells[existingIndex] = spell;
                } else {
                    DndSheet.data.allSpells.push(spell);
                }
            });
        }
        
        // --- MODIFIED: Added this block to rebuild the final spell map ---
        // This ensures the spell browser can see the newly added homebrew spells.
        DndSheet.spells = (DndSheet.data.allSpells || []).reduce((acc, spell) => {
            if (spell && spell.name) {
                acc[spell.name] = spell;
            }
            return acc;
        }, {});


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