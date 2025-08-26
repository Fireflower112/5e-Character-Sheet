// js/notes-page.js

DndSheet.pages.NotesPage = (character, subPage) => {
    // Determine which sub-tab is active for styling
    const isCharacterActive = subPage === 'character';
    const isNpcsActive = subPage === 'npcs';
    const isCampaignActive = subPage === 'campaign';
    const isCombatActive = subPage === 'combat';

    const notes = character.notes || {};
    const charNotes = notes.character || {};
    const npcs = Object.values(notes.npcs || {});
    const campaignNotes = notes.campaign || { general: '', sessionLog: [], locations: {}, rumors: [] };
    const sessionLog = campaignNotes.sessionLog || [];
    const locations = Object.values(campaignNotes.locations || {});
    const rumors = campaignNotes.rumors || [];

    // Helper function to render the NPC list
    const renderNpcList = () => {
        if (npcs.length === 0) return '<p class="text-gray-500 italic text-center p-4">No NPCs added yet. Add one below!</p>';
        return npcs.map(npc => `
            <div class="bg-gray-100 p-3 rounded-md">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-indigo-700">${npc.name}</h4>
                        <p class="text-sm text-gray-600">${npc.race} ${npc.class || ''}</p>
                    </div>
                    <button data-action="delete-npc" data-npc-id="${npc.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                </div>
                ${npc.description ? `<p class="text-xs text-gray-500 mt-2 pt-2 border-t">${npc.description}</p>` : ''}
            </div>
        `).join('');
    };

    // Helper function to render the Session Log
    const renderSessionLog = () => {
        if (sessionLog.length === 0) return '<p class="text-gray-500 italic text-center p-4">No session notes yet. Add one below!</p>';
        return [...sessionLog].reverse().map(entry => `
            <div class="bg-gray-100 p-3 rounded-md">
                <div class="flex justify-between items-center mb-2">
                    <p class="text-sm font-semibold text-indigo-700">Session Entry: ${entry.date}</p>
                    <button data-action="delete-session-log" data-entry-id="${entry.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                </div>
                <p class="text-sm text-gray-800 whitespace-pre-wrap">${entry.text}</p>
            </div>
        `).join('');
    };

    // Helper function to render the Location List
    const renderLocationList = () => {
        if (locations.length === 0) return '<p class="text-gray-500 italic text-center p-4">No locations added yet.</p>';
        return locations.map(loc => `
            <div class="bg-gray-100 p-3 rounded-md">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-indigo-700">${loc.name}</h4>
                    <button data-action="delete-location" data-location-id="${loc.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                </div>
                <div class="space-y-1 text-sm text-gray-800">
                    <p><strong>Description:</strong> ${loc.description || 'N/A'}</p>
                    <p><strong>Inhabitants:</strong> ${loc.inhabitants || 'N/A'}</p>
                    <p><strong>Other Info:</strong> ${loc.other || 'N/A'}</p>
                </div>
            </div>
        `).join('');
    };
    
    // Helper function to render the Rumor List
    const renderRumorList = () => {
        if (rumors.length === 0) return '<p class="text-gray-500 italic text-center p-4">No rumors logged yet.</p>';
        const getStatusBadge = (status) => {
            switch (status) {
                case 'True': return `<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">True</span>`;
                case 'False': return `<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">False</span>`;
                default: return `<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">Unverified</span>`;
            }
        };
        return rumors.map(rumor => `
            <div class="bg-gray-100 p-3 rounded-md">
                <p class="text-sm text-gray-800 mb-2">${rumor.text}</p>
                <div class="flex justify-between items-center border-t pt-2">
                    <div class="flex items-center gap-2">
                        ${getStatusBadge(rumor.status)}
                        ${rumor.status === 'Unverified' ? `
                            <button data-action="update-rumor-status" data-rumor-id="${rumor.id}" data-status="True" class="text-xs text-green-600 hover:underline">Mark True</button>
                            <button data-action="update-rumor-status" data-rumor-id="${rumor.id}" data-status="False" class="text-xs text-red-600 hover:underline">Mark False</button>
                        ` : ''}
                    </div>
                    <button data-action="delete-rumor" data-rumor-id="${rumor.id}" class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600">Delete</button>
                </div>
            </div>
        `).join('');
    };

    let subContent = '';
    // Based on the active sub-page, show the correct content
    switch(subPage) {
        case 'character':
            subContent = `
                <div class="space-y-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm"><label for="note-appearance" class="text-lg font-semibold text-gray-700">Appearance</label><p class="text-sm text-gray-500 mb-2">Describe your character's physical appearance, including height, weight, hair and eye color, and any distinguishing marks.</p><textarea id="note-appearance" data-field="notes.character.appearance" class="w-full h-32 p-2 border rounded-md">${charNotes.appearance || ''}</textarea></div>
                    <div class="bg-white p-4 rounded-lg shadow-sm"><label for="note-personality" class="text-lg font-semibold text-gray-700">Personality & Mannerisms</label><p class="text-sm text-gray-500 mb-2">What are your character's personality traits? How do they speak and act? Any interesting quirks?</p><textarea id="note-personality" data-field="notes.character.personality" class="w-full h-32 p-2 border rounded-md">${charNotes.personality || ''}</textarea></div>
                    <div class="bg-white p-4 rounded-lg shadow-sm"><label for="note-backstory" class="text-lg font-semibold text-gray-700">Backstory</label><p class="text-sm text-gray-500 mb-2">Where does your character come from? What significant events shaped them into who they are today?</p><textarea id="note-backstory" data-field="notes.character.backstory" class="w-full h-64 p-2 border rounded-md">${charNotes.backstory || ''}</textarea></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-4 rounded-lg shadow-sm"><label for="note-allies" class="text-lg font-semibold text-gray-700">Allies & Organizations</label><p class="text-sm text-gray-500 mb-2">List any friendly NPCs, factions, or guilds your character is associated with.</p><textarea id="note-allies" data-field="notes.character.allies" class="w-full h-48 p-2 border rounded-md">${charNotes.allies || ''}</textarea></div>
                        <div class="bg-white p-4 rounded-lg shadow-sm"><label for="note-rivals" class="text-lg font-semibold text-gray-700">Rivals & Enemies</label><p class="text-sm text-gray-500 mb-2">List any rivals, enemies, or hostile organizations.</p><textarea id="note-rivals" data-field="notes.character.rivals" class="w-full h-48 p-2 border rounded-md">${charNotes.rivals || ''}</textarea></div>
                    </div>
                </div>
            `;
            break;
        case 'npcs':
            subContent = `
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="space-y-3 mb-6">
                        <h3 class="text-xl font-bold">NPCs</h3>
                        ${renderNpcList()}
                    </div>
                    <div class="border-t pt-4">
                        <h4 class="text-lg font-semibold mb-2">Add New NPC</h4>
                        <div class="space-y-3">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input type="text" id="npc-name" placeholder="NPC Name" class="p-2 border rounded-md">
                                <input type="text" id="npc-race" placeholder="Race" class="p-2 border rounded-md">
                                <input type="text" id="npc-class" placeholder="Class (Optional)" class="p-2 border rounded-md">
                            </div>
                            <textarea id="npc-description" placeholder="Description & Notes" class="w-full p-2 border rounded-md"></textarea>
                            <button data-action="add-npc" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add NPC</button>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'campaign':
            subContent = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-6">
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-xl font-bold mb-3">Session Log</h3>
                            <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">${renderSessionLog()}</div>
                            <div class="border-t pt-4">
                                <h4 class="text-lg font-semibold mb-2">Add New Session Entry</h4>
                                <textarea id="session-log-input" placeholder="What happened in this session?" class="w-full h-24 p-2 border rounded-md"></textarea>
                                <button data-action="add-session-log" class="mt-2 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Entry</button>
                            </div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <label for="note-campaign-general" class="text-lg font-semibold text-gray-700">General Campaign Notes</label>
                            <p class="text-sm text-gray-500 mb-2">Use this space for overarching plot points, world details, or other general notes.</p>
                            <textarea id="note-campaign-general" data-field="notes.campaign.general" class="w-full h-48 p-2 border rounded-md">${campaignNotes.general || ''}</textarea>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-xl font-bold mb-3">Key Locations</h3>
                            <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">${renderLocationList()}</div>
                            <div class="border-t pt-4">
                                <h4 class="text-lg font-semibold mb-2">Add New Location</h4>
                                <div class="space-y-3">
                                    <input type="text" id="location-name" placeholder="Location Name" class="w-full p-2 border rounded-md">
                                    <textarea id="location-description" placeholder="Description" class="w-full h-20 p-2 border rounded-md"></textarea>
                                    <textarea id="location-inhabitants" placeholder="Who lives there?" class="w-full h-20 p-2 border rounded-md"></textarea>
                                    <textarea id="location-other" placeholder="Other Info" class="w-full h-20 p-2 border rounded-md"></textarea>
                                    <button data-action="add-location" class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Location</button>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm">
                            <h3 class="text-xl font-bold mb-3">Rumors & Mysteries</h3>
                            <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">${renderRumorList()}</div>
                            <div class="border-t pt-4">
                                <h4 class="text-lg font-semibold mb-2">Add New Rumor</h4>
                                <textarea id="rumor-input" placeholder="What have you heard?" class="w-full h-24 p-2 border rounded-md"></textarea>
                                <button data-action="add-rumor" class="mt-2 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add Rumor</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'combat':
            subContent = `<textarea data-field="notes.combat" class="w-full h-96 p-2 border rounded-md">${notes.combat || ''}</textarea>`;
            break;
    }

    return `
        <div>
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

DndSheet.pages.attachNotesPageHandlers = () => {};