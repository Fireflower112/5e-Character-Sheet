// js/equipped-items-page.js

window.EquippedItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const equippedWeapons = allItems.filter(item => item.equippedSlot === 'Wielded');
    
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

    const renderAccordionDetails = (item) => {
        // --- UPDATED: Added AC Bonus display for armor and shields ---
        let acBonusHtml = '';
        if (['armor', 'shield'].includes(item.itemType) && item.acBonus) {
            acBonusHtml = `<div class="font-semibold">AC Bonus: +${item.acBonus}</div>`;
        }

        const bonusesHtml = (item.bonuses && item.bonuses.length > 0) ? `
            <div class="mt-2 pt-2 border-t text-xs">
                <h5 class="font-semibold mb-1">Bonuses:</h5>
                <div class="flex flex-wrap gap-1">
                    ${item.bonuses.map(bonus => {
                        const label = bonus.field.charAt(0).toUpperCase() + bonus.field.slice(1);
                        const symbol = bonus.type === 'override' ? '=' : (bonus.value > 0 ? '+' : '');
                        return `<span class="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full">${label}: ${symbol}${bonus.value}</span>`;
                    }).join('')}
                </div>
            </div>` : '';

        return `
            <div class="text-xs text-gray-600 mt-1 space-y-1">
                <p class="italic">${item.description || 'No description.'}</p>
                ${acBonusHtml}
                ${bonusesHtml}
            </div>
        `;
    };

    const renderWeapons = () => {
        if (equippedWeapons.length === 0) {
            return `<div class="text-gray-500 italic p-3 bg-white rounded-lg shadow-inner">(no weapons wielded)</div>`;
        }
        return equippedWeapons.map(item => `
            <div class="bg-white p-3 rounded-lg shadow-inner">
                <button data-action="toggle-accordion" class="w-full flex justify-between items-center text-left font-semibold text-indigo-700 hover:text-indigo-900">
                    <span>${item.name}</span>
                    <span class="accordion-icon text-gray-400 font-mono text-sm">[+]</span>
                </button>
                <div class="accordion-details hidden pt-2 border-t mt-2">
                    ${renderAccordionDetails(item)}
                </div>
            </div>
        `).join('');
    };

    const renderedSlots = equipmentSlots.map(slot => {
        const item = equippedMap.get(slot.key);
        const itemDisplay = item 
            ? `<div>
                 <button data-action="toggle-accordion" class="w-full flex justify-between items-center text-left font-semibold text-indigo-700 hover:text-indigo-900">
                    <span>${item.name}</span>
                    <span class="accordion-icon text-gray-400 font-mono text-sm">[+]</span>
                </button>
                <div class="accordion-details hidden pt-2 border-t mt-2">
                    ${renderAccordionDetails(item)}
                </div>
               </div>`
            : `<div class="text-gray-500 italic text-right">(empty)</div>`;

        return `
            <div class="p-3 bg-white rounded-lg shadow-inner">
                <div class="flex items-center justify-between">
                    <div class="font-bold text-gray-800">${slot.label}</div>
                    ${!item ? itemDisplay : ''}
                </div>
                ${item ? itemDisplay : ''}
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
              <div id="equipped-items-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  ${renderedSlots}
              </div>
           </div>
       </div>
   `;
};