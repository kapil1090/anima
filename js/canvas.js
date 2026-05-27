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
    },

    startRenderLoop: function() {
        const loop = () => {
            this.render();
            if (window.Timeline) window.Timeline.update(false);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    setupEventListeners: function() {
        // Mouse Events for Selection and Dragging
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

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

    handleMouseDown: function(e) {
        const { x, y } = this.getMousePos(e);

        // Check if clicking on handles of selected object
        const selected = window.App?.state.selectedObject;
        if (selected) {
            const handle = this.getHandleAt(x, y, selected);
            if (handle) {
                window.Transform.startTransform(selected, handle, x, y);
                return;
            }
        }

        const obj = this.getObjectAt(x, y);

        if (window.App) {
            window.App.state.selectedObject = obj;
        }

        if (obj && window.Drag) {
            window.Drag.startDrag(obj, x, y);
        }
    },

    handleMouseMove: function(e) {
        const { x, y } = this.getMousePos(e);
        if (window.Drag && window.Drag.isDragging) {
            window.Drag.updateDrag(x, y);
        } else if (window.Transform && (window.Transform.isResizing || window.Transform.isRotating)) {
            window.Transform.updateTransform(x, y);
        }
    },

    handleMouseUp: function() {
        if (window.Drag) window.Drag.stopDrag();
        if (window.Transform) window.Transform.stopTransform();
    },

    getMousePos: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        // Adjust for CSS zoom/scale
        return {
            x: (e.clientX - rect.left) * (this.width / rect.width),
            y: (e.clientY - rect.top) * (this.height / rect.height)
        };
    },

    getObjectAt: function(x, y) {
        if (!window.App || !window.App.state.objects) return null;

        // Iterate backwards to select the topmost object
        const objects = window.App.state.objects;
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (this.isPointInObject(x, y, obj)) {
                return obj;
            }
        }
        return null;
    },

    isPointInObject: function(x, y, obj) {
        const s = (obj.scale || 1) * 2;
        let w = 40 * s;
        let h = 80 * s; // Default character size approx

        if (obj.type === 'prop') {
            if (obj.propId === 'prop_table') { w = 50 * s; h = 30 * s; }
            else if (obj.propId === 'prop_tree') { w = 40 * s; h = 60 * s; }
            else if (obj.propId === 'prop_bubble') { w = 60 * s; h = 50 * s; }
            else { w = 40 * s; h = 40 * s; }
        }

        // Basic AABB hit detection (can be refined)
        return x >= obj.x - w/2 && x <= obj.x + w/2 &&
               y >= obj.y - h/2 && y <= obj.y + h/2;
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
                } else if (obj.type === 'text') {
                    this.drawText(obj);
                }

                // Draw selection highlight
                if (window.App.state.selectedObject === obj) {
                    this.drawSelection(obj);
                }
            });
        }
    },

    drawSelection: function(obj) {
        const ctx = this.ctx;
        const { w, h } = this.getObjectBounds(obj);

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);

        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(-w/2 - 5, -h/2 - 5, w + 10, h + 10);

        // Draw Handles
        ctx.setLineDash([]);
        ctx.fillStyle = '#fff';

        // Resize handle (Bottom-Right)
        ctx.fillRect(w/2 + 2, h/2 + 2, 8, 8);
        ctx.strokeRect(w/2 + 2, h/2 + 2, 8, 8);

        // Rotation handle (Top-Center)
        ctx.beginPath();
        ctx.arc(0, -h/2 - 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    getObjectBounds: function(obj) {
        const s = (obj.scale || 1);
        let w = 40 * s * 2;
        let h = 80 * s * 2;

        if (obj.type === 'prop') {
            const ps = s * 2;
            if (obj.propId === 'prop_table') { w = 50 * ps; h = 30 * ps; }
            else if (obj.propId === 'prop_tree') { w = 40 * ps; h = 60 * ps; }
            else if (obj.propId === 'prop_bubble') { w = 60 * ps; h = 50 * ps; }
            else { w = 40 * ps; h = 40 * ps; }
        } else if (obj.type === 'text') {
            this.ctx.font = `${obj.fontSize * s}px ${obj.fontFamily}`;
            const metrics = this.ctx.measureText(obj.text);
            w = metrics.width + 20;
            h = obj.fontSize * s + 10;
        }
        return { w, h };
    },

    getHandleAt: function(x, y, obj) {
        const { w, h } = this.getObjectBounds(obj);

        // Rotate point (x, y) back by obj.rotation around (obj.x, obj.y)
        const rad = -obj.rotation * Math.PI / 180;
        const dx = x - obj.x;
        const dy = y - obj.y;
        const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

        // Resize handle check - increase hit area slightly
        if (rx >= w/2 - 5 && rx <= w/2 + 15 && ry >= h/2 - 5 && ry <= h/2 + 15) return 'resize';

        // Rotation handle check
        const distToRot = Math.hypot(rx - 0, ry - (-h/2 - 20));
        if (distToRot <= 15) return 'rotate';

        return null;
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
            window.App.state.selectedObject = newObj;
            if (window.Timeline) window.Timeline.update(true);
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
            window.App.state.selectedObject = newObj;
            if (window.Timeline) window.Timeline.update();
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

    drawText: function(obj) {
        const ctx = this.ctx;
        const s = (obj.scale || 1);

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.globalAlpha = obj.opacity;

        ctx.fillStyle = obj.color;
        ctx.font = `${obj.fontSize * s}px ${obj.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.text, 0, 0);

        ctx.restore();
    },

    drawCharacter: function(obj) {
        const ctx = this.ctx;
        const s = (obj.scale || 1) * 2;

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.globalAlpha = obj.opacity;

        // Animation state
        const time = Date.now() * 0.005;
        let bob = 0;
        let legSwing = 0;
        let armSwing = 0;

        if (window.App && window.App.state.isPlaying) {
            bob = Math.sin(time * 2) * 3 * s;
            legSwing = Math.sin(time * 2) * 10 * s;
            armSwing = Math.sin(time * 2) * 15 * s;
        } else {
            bob = Math.sin(time) * 2 * s;
        }

        ctx.translate(0, bob);

        // Legs (Pants/Shoes)
        ctx.fillStyle = obj.outfitColor;
        // Left Leg
        ctx.save();
        ctx.translate(-8 * s, 35 * s);
        ctx.rotate(legSwing * Math.PI / 180);
        ctx.fillRect(-5 * s, 0, 10 * s, 15 * s);
        // Shoe
        ctx.fillStyle = '#333';
        ctx.fillRect(-6 * s, 12 * s, 12 * s, 4 * s);
        ctx.restore();

        // Right Leg
        ctx.fillStyle = obj.outfitColor;
        ctx.save();
        ctx.translate(8 * s, 35 * s);
        ctx.rotate(-legSwing * Math.PI / 180);
        ctx.fillRect(-5 * s, 0, 10 * s, 15 * s);
        // Shoe
        ctx.fillStyle = '#333';
        ctx.fillRect(-6 * s, 12 * s, 12 * s, 4 * s);
        ctx.restore();

        // Arms (Behind body)
        ctx.fillStyle = obj.skinColor;
        // Left Arm
        ctx.save();
        ctx.translate(-22 * s, 10 * s);
        ctx.rotate(-armSwing * Math.PI / 180);
        ctx.fillRect(-4 * s, 0, 8 * s, 25 * s);
        ctx.restore();

        // Right Arm
        ctx.save();
        ctx.translate(22 * s, 10 * s);
        ctx.rotate(armSwing * Math.PI / 180);
        ctx.fillRect(-4 * s, 0, 8 * s, 25 * s);
        ctx.restore();

        // Body (Shirt/Outfit)
        ctx.fillStyle = obj.outfitColor;
        this.drawRoundRect(ctx, -20 * s, 0, 40 * s, 40 * s, 10 * s);

        // Neck
        ctx.fillStyle = obj.skinColor;
        ctx.fillRect(-5 * s, -5 * s, 10 * s, 10 * s);

        // Head
        ctx.beginPath();
        ctx.arc(0, -22 * s, 18 * s, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        if (obj.hairColor) {
            ctx.fillStyle = obj.hairColor;
            ctx.beginPath();
            ctx.arc(0, -25 * s, 20 * s, Math.PI, 0);
            ctx.fill();
            // Sideburns / Back of hair
            ctx.fillRect(-20 * s, -25 * s, 5 * s, 10 * s);
            ctx.fillRect(15 * s, -25 * s, 5 * s, 10 * s);
        }

        // Face Details
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-7 * s, -23 * s, 4 * s, 0, Math.PI * 2);
        ctx.arc(7 * s, -23 * s, 4 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-7 * s, -23 * s, 2 * s, 0, Math.PI * 2);
        ctx.arc(7 * s, -23 * s, 2 * s, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5 * s;
        ctx.beginPath();
        ctx.arc(0, -18 * s, 6 * s, 0.1 * Math.PI, 0.9 * Math.PI);
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
