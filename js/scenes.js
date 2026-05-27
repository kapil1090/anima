/* =========================
   SCENE MANAGEMENT
========================= */

const Scenes = {
    scenes: [],
    currentSceneIndex: 0,

    init: function() {
        console.log("Scene management initialized");
        // Start with one default scene if none exist
        if (this.scenes.length === 0) {
            this.addScene();
        }
    },

    addScene: function() {
        const newScene = {
            id: 'scene_' + Date.now(),
            name: 'Scene ' + (this.scenes.length + 1),
            objects: [],
            background: 'bg_white'
        };
        this.scenes.push(newScene);
        if (window.UI && window.App && window.App.state.currentTab === 'scenes') {
            window.UI.renderSceneLibrary();
        }
        return newScene;
    },

    switchScene: function(index) {
        if (index >= 0 && index < this.scenes.length) {
            // Save current state to current scene before switching
            if (window.App) {
                const currentScene = this.scenes[this.currentSceneIndex];
                currentScene.objects = [...window.App.state.objects];
                currentScene.background = window.App.state.background;

                this.currentSceneIndex = index;
                const nextScene = this.scenes[index];
                window.App.state.objects = [...nextScene.objects];
                window.App.state.background = nextScene.background;
                window.App.state.selectedObject = null;

                if (window.Canvas) window.Canvas.render();
                if (window.Timeline) {
                    window.Timeline.currentTime = 0;
                    window.Timeline.update(true);
                }
                if (window.UI && window.App.state.currentTab === 'scenes') {
                    window.UI.renderSceneLibrary();
                }
            }
        }
    }
};

window.Scenes = Scenes;

document.addEventListener('DOMContentLoaded', () => {
    Scenes.init();
});
