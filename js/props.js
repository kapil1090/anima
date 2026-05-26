/* =========================
   PROPS SYSTEM DATA
========================= */

const Props = {
    library: [
        { id: 'prop_chair', name: 'Chair', type: 'furniture', color: '#8d6e63' },
        { id: 'prop_table', name: 'Table', type: 'furniture', color: '#795548' },
        { id: 'prop_tree', name: 'Tree', type: 'nature', color: '#4caf50' },
        { id: 'prop_bubble', name: 'Speech Bubble', type: 'shape', color: '#ffffff' }
    ],

    init() {
    },

    getById(id) {
        return this.library.find(p => p.id === id);
    }
};

// Export to window
window.Props = Props;
