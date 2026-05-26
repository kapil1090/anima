/**
 * TIMELINE MODULE
 * Handles playback logic, time tracking, and timeline UI updates.
 */

const Timeline = {
    currentTime: 0,
    duration: 10, // Default 10 seconds
    fps: 30,
    isPlaying: false,
    lastTick: 0,

    init: function() {
        this.setupEventListeners();
        this.updateTimeDisplay();
        console.log('Timeline Module: Initialized');
    },

    setupEventListeners: function() {
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Spacebar for play/pause
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    },

    togglePlay: function() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '<span class="icon">⏸️</span>' : '<span class="icon">▶️</span>';
        }

        if (this.isPlaying) {
            this.lastTick = performance.now();
            this.play();
        }

        if (window.App) {
            window.App.state.isPlaying = this.isPlaying;
        }
    },

    play: function() {
        if (!this.isPlaying) return;

        const now = performance.now();
        const deltaTime = (now - this.lastTick) / 1000;
        this.lastTick = now;

        this.currentTime += deltaTime;

        // Loop playback for now
        if (this.currentTime >= this.duration) {
            this.currentTime = 0;
        }

        this.updateTimeDisplay();
        this.updatePlayhead();

        requestAnimationFrame(() => this.play());
    },

    updateTimeDisplay: function() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            timeEl.textContent = this.formatTime(this.currentTime);
        }
    },

    updatePlayhead: function() {
        const playhead = document.getElementById('playhead');
        const tracksArea = document.querySelector('.timeline-tracks');
        if (playhead && tracksArea) {
            // Calculate position based on pixels per second (50px = 1s from ruler CSS)
            const pps = 50;
            playhead.style.left = `${this.currentTime * pps}px`;
        }
    },

    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }
};

// Initialize Timeline
document.addEventListener('DOMContentLoaded', () => {
    Timeline.init();
});
