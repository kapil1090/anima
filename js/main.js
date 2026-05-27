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

        // Auto-load project if exists
        if (window.Save) {
            window.Save.loadProject();
        }
    },

    bindEvents: function() {
        // Project name change
        const nameInput = document.getElementById('project-name');
        if (nameInput) {
            nameInput.addEventListener('change', (e) => {
                this.state.projectName = e.target.value;
            });
        }

        // Preview button
        document.getElementById('btn-preview')?.addEventListener('click', () => {
            if (window.Timeline) window.Timeline.togglePlay();
        });
    }
};

// Global access
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
