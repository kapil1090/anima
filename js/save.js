/* =========================
   SAVE SYSTEM
========================= */

const Save = {
    saveProject() {
        if (!window.App) return;
        const projectData = JSON.stringify(window.App.state);
        localStorage.setItem('animaker_clone_project', projectData);

        const saveStatus = document.querySelector('.save-status');
        if (saveStatus) {
            saveStatus.textContent = 'Saved';
        }
    },

    loadProject() {
        const projectData = localStorage.getItem('animaker_clone_project');
        if (projectData && window.App) {
            window.App.state = JSON.parse(projectData);
            if (window.Timeline) window.Timeline.update();
            if (window.Canvas) window.Canvas.render();
            if (window.UI) window.UI.updateProjectName();
        }
    },

    exportJSON() {
        if (!window.App) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.App.state));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "project.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};

// Export to window
window.Save = Save;
