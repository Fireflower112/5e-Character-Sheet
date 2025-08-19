// js/notes-page.js

window.NotesPage = (character, subPage) => {
    // Determine which sub-tab is active for styling
    const isCharacterActive = subPage === 'character';
    const isNpcsActive = subPage === 'npcs';
    const isCampaignActive = subPage === 'campaign';
    const isCombatActive = subPage === 'combat';

    const notes = character.notes || { character: '', npcs: '', campaign: '', combat: '' };

    let subContent = '';
    // Based on the active sub-page, show the correct textarea
    switch(subPage) {
        case 'character':
            subContent = `<textarea data-note="character" class="w-full h-96 p-2 border rounded-md">${notes.character}</textarea>`;
            break;
        case 'npcs':
            subContent = `<textarea data-note="npcs" class="w-full h-96 p-2 border rounded-md">${notes.npcs}</textarea>`;
            break;
        case 'campaign':
            subContent = `<textarea data-note="campaign" class="w-full h-96 p-2 border rounded-md">${notes.campaign}</textarea>`;
            break;
        case 'combat':
            subContent = `<textarea data-note="combat" class="w-full h-96 p-2 border rounded-md">${notes.combat}</textarea>`;
            break;
    }

    return `
        <div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Notes</h2>
            <div class="flex space-x-2 border-b mb-4">
                <button data-action="sub-tab" data-subpage="character" class="sub-tab-button ${isCharacterActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Character</button>
                <button data-action="sub-tab" data-subpage="npcs" class="sub-tab-button ${isNpcsActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">NPCs</button>
                <button data-action="sub-tab" data-subpage="campaign" class="sub-tab-button ${isCampaignActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Campaign</button>
                <button data-action="sub-tab" data-subpage="combat" class="sub-tab-button ${isCombatActive ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'} px-4 py-2 font-medium">Combat</button>
            </div>

            <div id="sub-content-area">
                ${subContent}
            </div>
        </div>
    `;
};

// This function saves the notes as you type
window.attachNotesPageHandlers = () => {
    const notesArea = document.querySelector('#sub-content-area textarea[data-note]');
    if (notesArea) {
        notesArea.addEventListener('input', (e) => {
            const noteType = e.target.dataset.note;
            const character = window.stores.character.get();
            const newNotes = { ...character.notes, [noteType]: e.target.value };
            window.stores.character.set({ notes: newNotes });
        });
    }
};