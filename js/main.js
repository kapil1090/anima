/**
 * MAIN MODULE
 * Entry point and app initialization.
 */

const App = {
    state: {
        projectName: 'Untitled Project',
        currentScene: null,
        objects: [], // All objects in the current scene
        selectedObject: null,
        isPlaying: false,
        currentTime: 0,
        background: 'bg_white' // Default background ID
    },

    init: function() {
        this.bindEvents();
        console.log('Animaker Clone: Foundation ready.');
    },

    bindEvents: function() {
        // Project name change
        const nameInput = document.getElementById('project-name');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.state.projectName = e.target.value;
            });
        }

        // Button clicks (placeholders)
        document.getElementById('btn-preview')?.addEventListener('click', () => {
            console.log('Preview clicked');
        });
    }
};

// Global access
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
