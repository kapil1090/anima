/* =========================
   EXPORT SYSTEM
========================= */

const Export = {
    init: function() {
        console.log("Export system initialized");
        this.bindEvents();
    },

    bindEvents: function() {
        const btnExport = document.getElementById('btn-export');
        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportProject());
        }
    },

    exportProject: function() {
        if (!window.App) return;

        const projectData = {
            name: window.App.state.projectName,
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            objects: window.App.state.objects,
            background: window.App.state.background,
            duration: window.App.state.duration
        };

        const json = JSON.stringify(projectData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectData.name.replace(/\s+/g, '_')}_project.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("Project exported as JSON");
    }
};

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
    Export.init();
});
