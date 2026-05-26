/* =========================
   BACKGROUND SYSTEM DATA
========================= */

const Backgrounds = {
    library: [
        { id: 'bg_white', name: 'Plain White', type: 'color', value: '#ffffff' },
        { id: 'bg_dark', name: 'Dark Studio', type: 'color', value: '#1e1e2e' },
        { id: 'bg_blue', name: 'Sky Blue', type: 'color', value: '#87ceeb' },
        { id: 'bg_green', name: 'Grass Green', type: 'color', value: '#7cfc00' },
        { id: 'bg_sunset', name: 'Sunset Gradient', type: 'gradient', value: ['#ff5f6d', '#ffc371'] },
        { id: 'bg_ocean', name: 'Deep Ocean', type: 'gradient', value: ['#2193b0', '#6dd5ed'] }
    ],

    init() {
    },

    getBackgroundById(id) {
        return this.library.find(bg => bg.id === id);
    }
};

// Export to window
window.Backgrounds = Backgrounds;
