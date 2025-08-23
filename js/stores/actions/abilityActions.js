// js/stores/actions/abilityActions.js
(function(store, actions) {

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function addAbility(abilityData) {
        const character = store.get();
        const newAbility = { ...abilityData, id: uuid() };
        const newAbilities = { ...character.abilities, [newAbility.id]: newAbility };
        store.set({ abilities: newAbilities });
    }

    function deleteAbility(abilityId) {
        const character = store.get();
        const newAbilities = { ...character.abilities };
        delete newAbilities[abilityId];
        store.set({ abilities: newAbilities });
    }

    Object.assign(actions, {
        addAbility,
        deleteAbility,
    });

})(DndSheet.stores.character, DndSheet.stores.characterActions);