/**
 * UTILS MODULE
 * Shared helper functions for the entire application.
 */

window.Utils = {
    /**
     * Generates a unique ID
     */
    generateId: function() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Clamps a number between min and max
     */
    clamp: function(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    /**
     * Simple event emitter implementation
     */
    EventEmitter: class {
        constructor() {
            this.events = {};
        }
        on(event, listener) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(listener);
        }
        emit(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(l => l(data));
            }
        }
    }
};
