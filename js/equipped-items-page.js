// js/equipped-items-page.js

DndSheet.pages.EquippedItemsPage = (character) => {
    const allItems = Object.values(character.inventory.items || {});
    const equippedWeapons = allItems.filter(item => item.equippedSlot === 'Wielded' || item.itemType === 'weapon' && item.equippedSlot);
    const equippedArmor = allItems.find(item => item.equippedSlot === 'Armor');
    const equippedShield = allItems.find(item => item.equippedSlot === 'Shield');
    const currency = character.inventory.currency || { cp: 0, sp: 0, gp: 0, pp: 0 };
    
    const renderAccordionDetails = (item) => {
        let detailsHtml = '';
        if (item.itemType === 'weapon') {
            detailsHtml += `<div><strong>Damage:</strong> ${item.numDice || 1}d${item.dieType || 6}</div>`;
        }
        if (item.itemType === 'armor') {
            detailsHtml += `<div><strong>AC Base:</strong> ${item.acBase || 0}</div>`;
        }
        if (item.itemType === 'shield') {
            detailsHtml += `<div><strong>AC Bonus:</strong> +${item.acBonus || 0}</div>`;
        }
        
        return `
            <div class="text-xs text-gray-600 mt-1 space-y-1">
                <p class="italic">${item.description || 'No description.'}</p>
                ${detailsHtml}
            </div>
        `;
    };

    const renderWeapons = (title, items) => {
         if (items.length === 0) {
            return `<div class="text-gray-500 italic p-3 bg-white rounded-lg shadow-inner">(no ${title.toLowerCase()} equipped)</div>`;
        }
        return items.map(item => `
            <div class="bg-white p-3 rounded-lg shadow-inner" data-accordion-wrapper>
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

   return `
       <div class="space-y-6">
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Wielded & Worn</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <h4 class="font-medium text-center text-gray-600">Weapons</h4>
                        ${renderWeapons('Weapons', equippedWeapons)}
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-center text-gray-600">Armor</h4>
                        ${equippedArmor ? renderWeapons('Armor', [equippedArmor]) : renderWeapons('Armor', [])}
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-center text-gray-600">Shield</h4>
                        ${equippedShield ? renderWeapons('Shield', [equippedShield]) : renderWeapons('Shield', [])}
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <h3 class="text-xl font-semibold mb-3">Currency</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div><label class="font-medium text-gray-600">Copper (CP)</label><input type="number" data-field="inventory" data-subfield="currency.cp" value="${currency.cp}" class="w-full p-2 border rounded-md mt-1 text-center"></div>
                    <div><label class="font-medium text-gray-600">Silver (SP)</label><input type="number" data-field="inventory" data-subfield="currency.sp" value="${currency.sp}" class="w-full p-2 border rounded-md mt-1 text-center"></div>
                    <div><label class="font-medium text-gray-600">Gold (GP)</label><input type="number" data-field="inventory" data-subfield="currency.gp" value="${currency.gp}" class="w-full p-2 border rounded-md mt-1 text-center"></div>
                    <div><label class="font-medium text-gray-600">Platinum (PP)</label><input type="number" data-field="inventory" data-subfield="currency.pp" value="${currency.pp}" class="w-full p-2 border rounded-md mt-1 text-center"></div>
                </div>
            </div>
       </div>
   `;
};
