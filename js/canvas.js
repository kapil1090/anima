/**
 * CANVAS MODULE
 * Responsible for rendering the animation on the HTML5 Canvas.
 */

const Canvas = {
    canvas: null,
    ctx: null,
    width: 1280, // Default HD resolution
    height: 720,
    zoom: 1,
    showGrid: false,
    gridSize: 50,

    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.render();

        console.log('Canvas Module: Initialized');
    },

    setupEventListeners: function() {
        // Zoom Buttons
        document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.setZoom(this.zoom + 0.1));
        document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.setZoom(this.zoom - 0.1));
        document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.setZoom(1));

        // Grid Toggle
        document.getElementById('btn-grid')?.addEventListener('click', (e) => {
            this.showGrid = !this.showGrid;
            e.currentTarget.classList.toggle('active', this.showGrid);
            this.render();
        });

        // Resize observer to keep viewport centered if needed
        window.addEventListener('resize', () => this.render());
    },

    setZoom: function(level) {
        this.zoom = Utils.clamp(level, 0.1, 3);
        const viewport = document.getElementById('viewport');
        if (viewport) {
            viewport.style.transform = `scale(${this.zoom})`;
        }

        const zoomLabel = document.getElementById('zoom-level');
        if (zoomLabel) {
            zoomLabel.textContent = `${Math.round(this.zoom * 100)}%`;
        }

        console.log(`Canvas Module: Zoom set to ${this.zoom}`);
    },

    render: function() {
        this.resize();
        this.clear();
        if (this.showGrid) this.drawGrid();

        // Final render call will eventually involve scenes and objects
        console.log('Canvas Module: Rendered frame');
    },

    resize: function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    clear: function() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    },

    drawGrid: function() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        ctx.beginPath();
        // Vertical lines
        for (let x = 0; x <= this.width; x += this.gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
        }
        // Horizontal lines
        for (let y = 0; y <= this.height; y += this.gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
        }
        ctx.stroke();

        // Draw center lines
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2, this.height);
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(this.width, this.height / 2);
        ctx.stroke();
    }
};

// Initialize Canvas when the main app starts
document.addEventListener('DOMContentLoaded', () => {
    Canvas.init('animation-canvas');
});
