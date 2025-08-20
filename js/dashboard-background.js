// js/dashboard-background.js
window.DashboardBackgroundPage = (character) => {
    const feats = Object.values(character.feats || {});
    const abilities = Object.values(character.abilities || {});

    const renderFeats = () => {
        if (feats.length === 0) return '<p class="text-gray-500 italic">No feats added yet.</p>';
        return feats.map(feat => `<div class="bg-white p-3 rounded-lg shadow-inner"><h4 class="font-semibold">${feat.name}</h4><p class="text-sm text-gray-600">${feat.description}</p></div>`).join('');
    };

    const renderAbilities = () => {
        if (abilities.length === 0) return '<p class="text-gray-500 italic">No abilities added yet.</p>';
        return abilities.map(ability => `<div class="bg-white p-3 rounded-lg shadow-inner"><h4 class="font-semibold">${ability.name} <span class="text-sm text-gray-500">(${ability.type})</span></h4><p class="text-sm text-gray-600">${ability.description}</p></div>`).join('');
    };

    return `<div class="space-y-6"><div class="bg-gray-50 p-4 rounded-2xl shadow-sm"><h3 class="text-xl font-semibold mb-3">Feats</h3><div class="space-y-2">${renderFeats()}</div></div><div class="bg-gray-50 p-4 rounded-2xl shadow-sm"><h3 class="text-xl font-semibold mb-3">Racial & Class Abilities</h3><div class="space-y-2">${renderAbilities()}</div></div></div>`;
};