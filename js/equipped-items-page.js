// js/equipped-items-page.js

window.EquippedItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const equippedWeapons = allItems.filter(item => item.equippedSlot === 'Wielded');
    
    // --- RESTORED: Full list of equipment slots from your old file ---
    const equipmentSlots = [
        { key: 'Armor', label: 'Armor' }, { key: 'Belt', label: 'Belt' }, { key: 'Body', label: 'Body' },
        { key: 'Chest', label: 'Chest' }, { key: 'Eyes', label: 'Eyes' }, { key: 'Feet', label: 'Feet' },
        { key: 'Hands', label: 'Hands' }, { key: 'Head', label: 'Head' }, { key: 'Headband', label: 'Headband' },
        { key: 'Neck', label: 'Neck' }, { key: 'Ring1', label: 'Ring 1' }, { key: 'Ring2', label: 'Ring 2' },
        { key: 'Shield', label: 'Shield' }, { key: 'Shoulders', label: 'Shoulders' }, { key: 'Wrists', label: 'Wrists' },
    ];

    const equippedMap = new Map();
    allItems.forEach(item => {
        if (item.equippedSlot && item.equippedSlot !== 'Wielded') {
            equippedMap.set(item.equippedSlot, item);
        }
    });

    const renderWeapons = () => {
        if (equippedWeapons.length === 0) {
            return `<div class="text-gray-500 italic p-3 bg-white rounded-lg shadow-inner">(no weapons wielded)</div>`;
        }
        return equippedWeapons.map(item => `
            <div class="font-semibold text-indigo-700 p-3 bg-white rounded-lg shadow-inner cursor-pointer hover:bg-indigo-50" data-action="show-item-details" data-item-id="${item.id}">
                ${item.name}
            </div>
        `).join('');
    };

    const renderedSlots = equipmentSlots.map(slot => {
        const item = equippedMap.get(slot.key);
        const itemDisplay = item 
            ? `<div class="font-semibold text-indigo-700 cursor-pointer hover:text-indigo-900" data-action="show-item-details" data-item-id="${item.id}">${item.name}</div>` 
            : `<div class="text-gray-500 italic">(empty)</div>`;

        return `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-inner">
                <div class="font-bold text-gray-800">${slot.label}</div>
                ${itemDisplay}
            </div>`;
    }).join('');

   return `
       <div class="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-6">
           <div>
               <h3 class="text-xl font-semibold mb-3">Wielded Items</h3>
               <div id="wielded-items-list" class="space-y-2">
                   ${renderWeapons()}
               </div>
           </div>
           <div>
              <h3 class="text-xl font-semibold mb-3">Equipped Items by Slot</h3>
              <div id="equipped-items-list" class="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${renderedSlots}
              </div>
           </div>
       </div>
   `;
};
