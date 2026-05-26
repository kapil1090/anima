/**
 * MAIN MODULE
 * Entry point and app initialization.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Animaker Clone: Initializing foundation...');

    // Initialize application state
    const App = {
        state: {
            projectName: 'Untitled Project',
            currentScene: null,
            selectedObject: null,
            isPlaying: false,
            currentTime: 0
        },

        init: function() {
            this.bindEvents();
            console.log('Animaker Clone: Foundation ready.');
        },

        bindEvents: function() {
            // Project name change
            const nameInput = document.getElementById('project-name');
            nameInput.addEventListener('input', (e) => {
                this.state.projectName = e.target.value;
            });

            // Button clicks (placeholders)
            document.getElementById('btn-preview').addEventListener('click', () => {
                console.log('Preview clicked');
            });
        }
    };

    // Global access for debugging
    window.App = App;
    App.init();
});
