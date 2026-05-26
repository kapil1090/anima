/* =========================
   TEXT SYSTEM
========================= */

const Text = {
    addText() {
        if (!window.App) return;

        const newObj = {
            id: Utils.generateId(),
            type: 'text',
            name: 'Text',
            text: 'Double click to edit',
            x: 640,
            y: 360,
            scale: 1,
            rotation: 0,
            opacity: 1,
            fontSize: 40,
            fontFamily: 'Inter',
            color: '#000000',
            keyframes: []
        };

        window.App.state.objects.push(newObj);
        window.App.state.selectedObject = newObj;
        if (window.Timeline) window.Timeline.update(true);
    }
};

// Export to window
window.Text = Text;
