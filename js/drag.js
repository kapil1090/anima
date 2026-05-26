/* =========================
   DRAG SYSTEM
========================= */

const Drag = {
    isDragging: false,
    draggedObject: null,
    startX: 0,
    startY: 0,
    initialObjX: 0,
    initialObjY: 0,

    startDrag(obj, mouseX, mouseY) {
        this.isDragging = true;
        this.draggedObject = obj;
        this.startX = mouseX;
        this.startY = mouseY;
        this.initialObjX = obj.x;
        this.initialObjY = obj.y;
    },

    updateDrag(mouseX, mouseY) {
        if (!this.isDragging || !this.draggedObject) return;

        const dx = mouseX - this.startX;
        const dy = mouseY - this.startY;

        this.draggedObject.x = this.initialObjX + dx;
        this.draggedObject.y = this.initialObjY + dy;
    },

    stopDrag() {
        this.isDragging = false;
        this.draggedObject = null;
    }
};

// Export to window
window.Drag = Drag;
