/**
 * CANVAS MODULE
 * Responsible for rendering the animation on the HTML5 Canvas.
 */

const Canvas = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 450,

    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with ID ${canvasId} not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.clear();

        console.log('Canvas Module: Initialized');
    },

    resize: function() {
        // Set fixed internal resolution for consistency
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    clear: function() {
        this.ctx.fillStyle = '#ffffff'; // Default canvas background (can be changed later)
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw a simple grid or "No Scene" message for now
        this.ctx.strokeStyle = '#eeeeee';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
            this.stroke();
        }
        for (let i = 0; i < this.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.width, i);
            this.stroke();
        }
    },

    stroke: function() {
        this.ctx.stroke();
    }
};

// Initialize Canvas when the main app starts
document.addEventListener('DOMContentLoaded', () => {
    Canvas.init('animation-canvas');
});
