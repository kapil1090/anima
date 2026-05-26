/* =========================
   TRANSFORM SYSTEM (RESIZE & ROTATE)
========================= */

const Transform = {
    isResizing: false,
    isRotating: false,
    targetObject: null,
    handleType: null,
    startX: 0,
    startY: 0,
    initialScale: 1,
    initialRotation: 0,

    startTransform(obj, type, mouseX, mouseY) {
        this.targetObject = obj;
        this.handleType = type;
        this.startX = mouseX;
        this.startY = mouseY;
        this.initialScale = obj.scale || 1;
        this.initialRotation = obj.rotation || 0;

        if (type === 'rotate') {
            this.isRotating = true;
        } else {
            this.isResizing = true;
        }
    },

    updateTransform(mouseX, mouseY) {
        if (!this.targetObject) return;

        if (this.isResizing) {
            // Use distance from center to calculate new scale
            const dxInitial = this.startX - this.targetObject.x;
            const dyInitial = this.startY - this.targetObject.y;
            const distInitial = Math.sqrt(dxInitial * dxInitial + dyInitial * dyInitial);

            const dxCurrent = mouseX - this.targetObject.x;
            const dyCurrent = mouseY - this.targetObject.y;
            const distCurrent = Math.sqrt(dxCurrent * dxCurrent + dyCurrent * dyCurrent);

            if (distInitial > 0) {
                this.targetObject.scale = Utils.clamp(this.initialScale * (distCurrent / distInitial), 0.1, 10);
            }
        }

        if (this.isRotating) {
            const angleStart = Math.atan2(this.startY - this.targetObject.y, this.startX - this.targetObject.x);
            const angleCurrent = Math.atan2(mouseY - this.targetObject.y, mouseX - this.targetObject.x);
            this.targetObject.rotation = this.initialRotation + (angleCurrent - angleStart) * (180 / Math.PI);
        }
    },

    stopTransform() {
        this.isResizing = false;
        this.isRotating = false;
        this.targetObject = null;
        this.handleType = null;
    }
};

// Export to window
window.Transform = Transform;
