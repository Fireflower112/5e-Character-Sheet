// js/homebrew-race-creator.js

window.renderHomebrewRaceModal = () => {
    const abilityScores = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

    return `
        <div id="homebrew-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h2 class="text-2xl font-bold mb-4">Homebrew Race Creator</h2>
                
                <div class="space-y-4">
                    <div>
                        <label for="homebrew-race-name" class="block text-sm font-medium text-gray-700">Race Name</label>
                        <input type="text" id="homebrew-race-name" class="mt-1 block w-full p-2 border rounded-md" placeholder="e.g., Star Elf">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Ability Score Increases</label>
                        <div class="mt-1 grid grid-cols-6 gap-2 text-center">
                            ${abilityScores.map(score => `
                                <div>
                                    <label for="homebrew-asi-${score}" class="text-xs font-semibold">${score}</label>
                                    <input type="number" id="homebrew-asi-${score}" data-asi="${score.toLowerCase()}" class="w-full p-1 border rounded-md text-center" value="0">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <label for="homebrew-languages" class="block text-sm font-medium text-gray-700">Languages</label>
                        <input type="text" id="homebrew-languages" class="mt-1 block w-full p-2 border rounded-md" placeholder="e.g., Common, Elvish">
                    </div>

                    <div class="border-t pt-4">
                        <h3 class="text-lg font-semibold mb-2">Racial Traits</h3>
                        <div id="homebrew-traits-container" class="space-y-2"></div>
                        <button type="button" id="add-trait-btn" class="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200">Add Trait</button>
                    </div>

                     <div>
                        <label for="homebrew-description" class="block text-sm font-medium text-gray-700">Other Information</label>
                        <textarea id="homebrew-description" rows="3" class="mt-1 block w-full p-2 border rounded-md" placeholder="Describe any other pertinent information about the race..."></textarea>
                    </div>

                    <div class="border-t pt-3">
                        <div class="flex items-center space-x-2">
                             <input type="checkbox" id="add-subrace-toggle" class="h-4 w-4 rounded">
                             <label for="add-subrace-toggle" class="font-medium text-gray-700">Add Subraces?</label>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 border-t pt-4 mt-4">
                        <button type="button" id="cancel-homebrew-btn" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="button" id="save-homebrew-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Race</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.attachHomebrewRaceModalHandlers = () => {
    const modalContainer = document.getElementById('modal-container');
    const overlay = document.getElementById('homebrew-modal-overlay');
    const cancelBtn = document.getElementById('cancel-homebrew-btn');
    const saveBtn = document.getElementById('save-homebrew-btn');
    const addTraitBtn = document.getElementById('add-trait-btn');

    const closeModal = () => modalContainer.innerHTML = '';

    const saveAndClose = () => {
        const raceData = {
            name: document.getElementById('homebrew-race-name').value,
            languages: document.getElementById('homebrew-languages').value,
            abilityScoreIncrease: {},
            traits: [],
        };
        
        document.querySelectorAll('[data-asi]').forEach(input => {
            const score = input.dataset.asi;
            const value = parseInt(input.value, 10);
            if (value) raceData.abilityScoreIncrease[score] = value;
        });

        document.querySelectorAll('.trait-entry').forEach(entry => {
            const name = entry.querySelector('.trait-name').value;
            const desc = entry.querySelector('.trait-desc').value;
            if (name) raceData.traits.push({ name, description: desc, type: 'Racial' });
        });
        
        if (!raceData.name) {
            window.showMessage('Race name is required.', 'red');
            return;
        }

        window.stores.character.saveHomebrewRace(raceData);

        if (document.getElementById('add-subrace-toggle').checked) {
            closeModal();
            // Pass the new race name to the subrace modal
            modalContainer.innerHTML = window.renderHomebrewSubraceModal(raceData.name);
            window.attachHomebrewSubraceModalHandlers(raceData.name);
        } else {
            closeModal();
        }
    };
    
    addTraitBtn.addEventListener('click', () => {
        const container = document.getElementById('homebrew-traits-container');
        const traitEntry = document.createElement('div');
        traitEntry.className = 'trait-entry p-2 border rounded bg-gray-50';
        traitEntry.innerHTML = `
            <input type="text" class="trait-name w-full p-1 border rounded mb-1" placeholder="Trait Name">
            <textarea class="trait-desc w-full p-1 border rounded" placeholder="Trait Description"></textarea>
        `;
        container.appendChild(traitEntry);
    });

    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveAndClose);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) saveAndClose();
    });
};