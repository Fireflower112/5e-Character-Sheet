// js/homebrew-subrace-creator.js

window.renderHomebrewSubraceModal = (baseRaceNameToSelect = '') => {
    const abilityScores = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const raceNames = Object.keys(window.dndData.races || {});

    return `
        <div id="homebrew-subrace-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h2 class="text-2xl font-bold mb-4">Homebrew Subrace Creator</h2>
                
                <div class="space-y-4">
                    <div>
                        <label for="homebrew-base-race" class="block text-sm font-medium text-gray-700">Base Race</label>
                        <select id="homebrew-base-race" class="mt-1 block w-full p-2 border rounded-md">
                            <option value="">-- Choose a Base Race --</option>
                            ${raceNames.map(name => `<option value="${name}" ${name === baseRaceNameToSelect ? 'selected' : ''}>${name}</option>`).join('')}
                        </select>
                    </div>

                    <div>
                        <label for="homebrew-subrace-name" class="block text-sm font-medium text-gray-700">Subrace Name</label>
                        <input type="text" id="homebrew-subrace-name" class="mt-1 block w-full p-2 border rounded-md" placeholder="e.g., Sun Elf">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Ability Score Increases</label>
                        <div class="mt-1 grid grid-cols-6 gap-2 text-center">
                            ${abilityScores.map(score => `
                                <div>
                                    <label for="homebrew-sub-asi-${score}" class="text-xs font-semibold">${score}</label>
                                    <input type="number" id="homebrew-sub-asi-${score}" data-asi="${score.toLowerCase()}" class="w-full p-1 border rounded-md text-center" value="0">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div id="homebrew-subrace-traits-container" class="border-t pt-4">
                        <h3 class="text-lg font-semibold mb-2">Racial Traits</h3>
                        <div class="space-y-2"></div>
                        <button type="button" id="add-subrace-trait-btn" class="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200">Add Trait</button>
                    </div>

                    <div class="flex justify-end space-x-3 border-t pt-4 mt-4">
                        <button type="button" id="cancel-homebrew-subrace-btn" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="button" id="save-homebrew-subrace-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Subrace</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.attachHomebrewSubraceModalHandlers = (baseRaceName) => {
    const modalContainer = document.getElementById('modal-container');
    const overlay = document.getElementById('homebrew-subrace-modal-overlay');
    const cancelBtn = document.getElementById('cancel-homebrew-subrace-btn');
    const saveBtn = document.getElementById('save-homebrew-subrace-btn');
    const addTraitBtn = document.getElementById('add-subrace-trait-btn');

    const closeModal = () => modalContainer.innerHTML = '';

    const saveAndClose = () => {
        const baseRaceName = document.getElementById('homebrew-base-race').value;
        const subraceData = {
            name: document.getElementById('homebrew-subrace-name').value,
            abilityScoreIncrease: {},
            traits: []
        };

        document.querySelectorAll('[data-asi]').forEach(input => {
            const score = input.dataset.asi;
            const value = parseInt(input.value, 10);
            if (value) subraceData.abilityScoreIncrease[score] = value;
        });

        document.querySelectorAll('.trait-entry').forEach(entry => {
            const name = entry.querySelector('.trait-name').value;
            const desc = entry.querySelector('.trait-desc').value;
            if (name) subraceData.traits.push({ name, description: desc, type: 'Racial' });
        });

        if (!baseRaceName || !subraceData.name) {
            window.showMessage('Base Race and Subrace Name are required.', 'red');
            return;
        }

        window.stores.character.saveHomebrewSubrace(baseRaceName, subraceData);
        closeModal();
    };

    addTraitBtn.addEventListener('click', () => {
        const container = document.getElementById('homebrew-subrace-traits-container').querySelector('.space-y-2');
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