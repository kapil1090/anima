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
        this.resize();
        this.setupEventListeners();
        this.startRenderLoop();

        window.Canvas = this; // Expose to global for UI interaction
        console.log('Canvas Module: Initialized');
    },

    startRenderLoop: function() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
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
        });

        // Resize observer to keep viewport centered if needed
        window.addEventListener('resize', () => this.resize());
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
        this.drawBackground();
        if (this.showGrid) this.drawGrid();

        // Render Objects
        if (window.App && window.App.state.objects) {
            window.App.state.objects.forEach(obj => {
                if (obj.type === 'character') {
                    this.drawCharacter(obj);
                } else if (obj.type === 'prop') {
                    this.drawProp(obj);
                }
            });
        }
    },

    addProp: function(propId) {
        const propData = window.Props.getById(propId);
        if (!propData) return;

        const newObj = {
            id: Utils.generateId(),
            type: 'prop',
            propId: propId,
            name: propData.name,
            x: this.width / 2,
            y: this.height / 2,
            scale: 1,
            rotation: 0,
            opacity: 1,
            color: propData.color
        };

        if (window.App) {
            window.App.state.objects.push(newObj);
        }
    },

    addCharacter: function(charId) {
        const charData = window.Characters.getById(charId);
        if (!charData) return;

        const newObj = {
            id: Utils.generateId(),
            type: 'character',
            charId: charId,
            name: charData.name,
            x: this.width / 2,
            y: this.height / 2,
            scale: 1,
            rotation: 0,
            opacity: 1,
            skinColor: charData.skinColor,
            outfitColor: charData.outfitColor,
            hairColor: charData.hairColor,
            animation: 'idle'
        };

        if (window.App) {
            window.App.state.objects.push(newObj);
            this.render();
        }
    },

    drawProp: function(obj) {
        const ctx = this.ctx;
        const s = (obj.scale || 1) * 2;

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.globalAlpha = obj.opacity;

        ctx.fillStyle = obj.color;

        if (obj.propId === 'prop_chair') {
            // Simple Chair
            ctx.fillRect(-10 * s, 0, 4 * s, 20 * s); // Leg L
            ctx.fillRect(6 * s, 0, 4 * s, 20 * s); // Leg R
            ctx.fillRect(-12 * s, -2 * s, 24 * s, 4 * s); // Seat
            ctx.fillRect(-12 * s, -20 * s, 4 * s, 20 * s); // Back L
            ctx.fillRect(8 * s, -20 * s, 4 * s, 20 * s); // Back R
            ctx.fillRect(-12 * s, -20 * s, 24 * s, 4 * s); // Top
        } else if (obj.propId === 'prop_table') {
            // Simple Table
            ctx.fillRect(-20 * s, 0, 4 * s, 25 * s); // Leg L
            ctx.fillRect(16 * s, 0, 4 * s, 25 * s); // Leg R
            ctx.fillRect(-25 * s, -5 * s, 50 * s, 8 * s); // Top
        } else if (obj.propId === 'prop_tree') {
            // Simple Tree
            ctx.fillStyle = '#795548'; // Trunk
            ctx.fillRect(-5 * s, 0, 10 * s, 30 * s);
            ctx.fillStyle = obj.color; // Leaves
            ctx.beginPath();
            ctx.arc(0, -10 * s, 20 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-15 * s, -25 * s, 15 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(15 * s, -25 * s, 15 * s, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.propId === 'prop_bubble') {
            // Speech Bubble
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            this.drawRoundRect(ctx, -30 * s, -40 * s, 60 * s, 40 * s, 10 * s);
            ctx.stroke();
            // Tail
            ctx.beginPath();
            ctx.moveTo(-10 * s, 0);
            ctx.lineTo(0, 10 * s);
            ctx.lineTo(10 * s, 0);
            ctx.fill();
            ctx.stroke();
        } else {
            // Fallback square
            ctx.fillRect(-20 * s, -20 * s, 40 * s, 40 * s);
        }

        ctx.restore();
    },

    drawCharacter: function(obj) {
        const ctx = this.ctx;
        const s = (obj.scale || 1) * 2; // Increased base size for visibility

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.globalAlpha = obj.opacity;

        // Simple humanoid drawing (modularized for future animations)
        const bob = Math.sin(Date.now() * 0.005) * 5; // Idle bobbing
        ctx.translate(0, bob);

        // Legs
        ctx.fillStyle = obj.outfitColor;
        ctx.fillRect(-12 * s, 35 * s, 10 * s, 15 * s);
        ctx.fillRect(2 * s, 35 * s, 10 * s, 15 * s);

        // Body
        ctx.fillStyle = obj.outfitColor;
        this.drawRoundRect(ctx, -20 * s, 0, 40 * s, 40 * s, 8 * s);

        // Head
        ctx.fillStyle = obj.skinColor;
        ctx.beginPath();
        ctx.arc(0, -22 * s, 18 * s, 0, Math.PI * 2);
        ctx.fill();

        // Hair (if any)
        if (obj.hairColor) {
            ctx.fillStyle = obj.hairColor;
            ctx.beginPath();
            ctx.arc(0, -26 * s, 20 * s, Math.PI, 0);
            ctx.fill();
        }

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-6 * s, -22 * s, 2 * s, 0, Math.PI * 2);
        ctx.arc(6 * s, -22 * s, 2 * s, 0, Math.PI * 2);
        ctx.fill();

        // Mouth (simple smile)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * s;
        ctx.beginPath();
        ctx.arc(0, -18 * s, 5 * s, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        ctx.restore();
    },

    drawRoundRect: function(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    },

    resize: function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    drawBackground: function() {
        const ctx = this.ctx;
        const bgId = window.App.state.background;
        const bg = window.Backgrounds.getBackgroundById(bgId);

        if (!bg) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, this.width, this.height);
            return;
        }

        if (bg.type === 'color') {
            ctx.fillStyle = bg.value;
            ctx.fillRect(0, 0, this.width, this.height);
        } else if (bg.type === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, bg.value[0]);
            gradient.addColorStop(1, bg.value[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.width, this.height);
        }
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
