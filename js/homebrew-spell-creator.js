// js/homebrew-spell-creator.js

DndSheet.pages.showHomebrewSpellModal = (spellToEdit = null) => {
    const modalContainer = document.getElementById('modal-container');
    const spellSchools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
    const damageTypes = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"];
    const durationUnits = ["Rounds", "Minutes", "Hours"];

    const props = spellToEdit?.properties || spellToEdit || {};
    const trackerInfo = spellToEdit?.trackerInfo || {};

    const modalHTML = `
        <div id="homebrew-spell-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h2 class="text-2xl font-bold mb-4">${spellToEdit ? 'Edit' : 'Create'} Homebrew Spell</h2>
                <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label class="block text-sm font-medium">Spell Name</label><input type="text" id="hb-spell-name" class="w-full p-2 border rounded-md" value="${spellToEdit?.name || ''}"></div>
                        <div><label class="block text-sm font-medium">Level</label><input type="number" id="hb-spell-level" class="w-full p-2 border rounded-md" min="0" max="9" value="${props.Level || 0}"></div>
                        <div><label class="block text-sm font-medium">School</label><select id="hb-spell-school" class="w-full p-2 border rounded-md">${spellSchools.map(s => `<option value="${s}" ${props.School === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
                    </div>
                    
                    <div><label class="block text-sm font-medium">Classes</label><input type="text" id="hb-spell-classes" class="w-full p-2 border rounded-md" placeholder="e.g., Sorcerer, Wizard" value="${props.Classes || ''}"></div>
                    <div><label class="block text-sm font-medium">Description</label><textarea id="hb-spell-description" class="w-full p-2 border rounded-md" rows="4">${spellToEdit?.description || ''}</textarea></div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                        <div><label class="block text-sm font-medium">Casting Time</label><input type="text" id="hb-spell-casting-time" class="w-full p-2 border rounded-md" value="${props['Casting Time'] || '1 Action'}"></div>
                        <div><label class="block text-sm font-medium">Range</label><input type="text" id="hb-spell-range" class="w-full p-2 border rounded-md" value="${props.Range || 'Self'}"></div>
                        <div><label class="block text-sm font-medium">Components</label><input type="text" id="hb-spell-components" placeholder="V, S, M" class="w-full p-2 border rounded-md" value="${props.Components || ''}"></div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label class="block text-sm font-medium">Damage</label><input type="text" id="hb-spell-damage" placeholder="e.g., 3d6" class="w-full p-2 border rounded-md" value="${props.Damage || ''}"></div>
                        <div><label class="block text-sm font-medium">Damage Type</label><select id="hb-spell-damage-type" class="w-full p-2 border rounded-md"><option value="">None</option>${damageTypes.map(d => `<option value="${d}" ${props['Damage Type'] === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
                        <div><label class="block text-sm font-medium">Saving Throw</label><input type="text" id="hb-spell-save" placeholder="e.g., Dexterity" class="w-full p-2 border rounded-md" value="${props.Save || ''}"></div>
                    </div>
                    
                    <div class="border-t pt-4 mt-4">
                        <h3 class="text-lg font-semibold mb-2">Timer / Effect Details</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label class="block text-sm font-medium">Duration Value</label><input type="number" id="hb-tracker-duration-value" class="w-full p-2 border rounded-md" value="${trackerInfo.duration?.value || 0}"></div>
                            <div><label class="block text-sm font-medium">Duration Unit</label><select id="hb-tracker-duration-unit" class="w-full p-2 border rounded-md">${durationUnits.map(u => `<option value="${u}" ${trackerInfo.duration?.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div>
                            <div class="flex items-center pt-6"><input type="checkbox" id="hb-tracker-concentration" class="h-4 w-4 rounded text-indigo-600" ${trackerInfo.requiresConcentration ? 'checked' : ''}><label for="hb-tracker-concentration" class="ml-2 font-medium">Requires Concentration</label></div>
                        </div>
                        <div class="mt-4"><label class="block text-sm font-medium">Effect Description</label><input type="text" id="hb-tracker-effect-desc" class="w-full p-2 border rounded-md" placeholder="e.g., Target adds 1d4 to attacks" value="${trackerInfo.effectDescription || ''}"></div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-4 pt-4 border-t">
                    <button id="cancel-hb-spell" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button id="save-hb-spell" class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Save Spell</button>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalHTML;
    const closeModal = () => modalContainer.innerHTML = '';
    const saveAndClose = () => {
        const homebrewSpell = {
            name: document.getElementById('hb-spell-name').value,
            description: document.getElementById('hb-spell-description').value,
            properties: {
                Classes: document.getElementById('hb-spell-classes').value,
                Level: parseInt(document.getElementById('hb-spell-level').value, 10),
                School: document.getElementById('hb-spell-school').value,
                'Casting Time': document.getElementById('hb-spell-casting-time').value,
                Range: document.getElementById('hb-spell-range').value,
                Components: document.getElementById('hb-spell-components').value,
                Damage: document.getElementById('hb-spell-damage').value,
                'Damage Type': document.getElementById('hb-spell-damage-type').value,
                Save: document.getElementById('hb-spell-save').value,
                Concentration: document.getElementById('hb-tracker-concentration').checked ? 'Yes' : 'No',
                Category: 'Spells'
            }
        };

        const trackerDuration = parseInt(document.getElementById('hb-tracker-duration-value').value, 10);
        if (trackerDuration > 0) {
            homebrewSpell.trackerInfo = {
                duration: {
                    value: trackerDuration,
                    unit: document.getElementById('hb-tracker-duration-unit').value
                },
                requiresConcentration: document.getElementById('hb-tracker-concentration').checked,
                effectDescription: document.getElementById('hb-tracker-effect-desc').value
            };
        }

        if (!homebrewSpell.name) {
            DndSheet.helpers.showMessage('Spell name is required.', 'red');
            return;
        }
        DndSheet.stores.character.saveHomebrewSpell(homebrewSpell);
        closeModal();
    };
    document.getElementById('cancel-hb-spell').addEventListener('click', closeModal);
    document.getElementById('save-hb-spell').addEventListener('click', saveAndClose);
    document.getElementById('homebrew-spell-modal-overlay').addEventListener('click', e => {
        if (e.target.id === 'homebrew-spell-modal-overlay') closeModal();
    });
};