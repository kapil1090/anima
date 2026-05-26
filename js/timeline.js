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
    pixelsPerSecond: 50,

    init: function() {
        this.setupEventListeners();
        this.renderRuler();
        this.update();
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

        // Timeline Zoom
        const zoomSlider = document.getElementById('timeline-zoom');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                this.pixelsPerSecond = parseInt(e.target.value);
                this.update();
            });
        }
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

        if (this.currentTime >= this.duration) {
            this.currentTime = 0;
        }

        this.update();
        requestAnimationFrame(() => this.play());
    },

    renderRuler: function() {
        const ruler = document.getElementById('timeline-ruler');
        if (!ruler) return;

        ruler.innerHTML = '';
        const width = this.duration * this.pixelsPerSecond;
        ruler.style.width = `${width}px`;

        for (let i = 0; i <= this.duration; i++) {
            const mark = document.createElement('div');
            mark.className = 'ruler-mark';
            mark.style.left = `${i * this.pixelsPerSecond}px`;
            mark.innerHTML = `<span>${i}s</span>`;
            ruler.appendChild(mark);
        }
    },

    update: function(forceUIRefresh = false) {
        this.updateTimeDisplay();
        this.updatePlayhead();
        if (forceUIRefresh) this.renderTracks();
        this.animateObjects();

        if (window.App) {
            window.App.state.currentTime = this.currentTime;
        }
    },

    animateObjects: function() {
        const objects = window.App?.state.objects || [];
        objects.forEach(obj => {
            if (obj.keyframes && obj.keyframes.length > 0) {
                this.interpolateKeyframes(obj, this.currentTime);
            }
        });
    },

    interpolateKeyframes: function(obj, time) {
        const kfs = obj.keyframes;

        // Find surrounding keyframes
        let prev = null;
        let next = null;

        for (let i = 0; i < kfs.length; i++) {
            if (kfs[i].time <= time) {
                prev = kfs[i];
            } else {
                next = kfs[i];
                break;
            }
        }

        if (!prev && next) {
            // Before first keyframe
            this.applyKf(obj, next);
        } else if (prev && !next) {
            // After last keyframe
            this.applyKf(obj, prev);
        } else if (prev && next) {
            // Between two keyframes
            const range = next.time - prev.time;
            const progress = (time - prev.time) / range;
            // Simple linear interpolation for now
            obj.x = prev.x + (next.x - prev.x) * progress;
            obj.y = prev.y + (next.y - prev.y) * progress;
            obj.scale = prev.scale + (next.scale - prev.scale) * progress;
            obj.rotation = prev.rotation + (next.rotation - prev.rotation) * progress;
            obj.opacity = prev.opacity + (next.opacity - prev.opacity) * progress;
        }
    },

    applyKf: function(obj, kf) {
        obj.x = kf.x;
        obj.y = kf.y;
        obj.scale = kf.scale;
        obj.rotation = kf.rotation;
        obj.opacity = kf.opacity;
    },

    renderTracks: function() {
        const layerList = document.getElementById('layer-list');
        const trackList = document.getElementById('track-list');
        if (!layerList || !trackList) return;

        const objects = window.App?.state.objects || [];

        if (objects.length === 0) {
            if (layerList.innerHTML !== '<div class="empty-layers">No objects in scene</div>') {
                layerList.innerHTML = '<div class="empty-layers">No objects in scene</div>';
                trackList.innerHTML = '<div class="track-placeholder"></div>';
            }
            return;
        }

        // Very basic diffing to avoid constant innerHTML churn
        if (layerList.children.length !== objects.length || layerList.querySelector('.empty-layers')) {
            layerList.innerHTML = '';
            trackList.innerHTML = '';

            objects.forEach(obj => {
                // Layer Item
                const layerItem = document.createElement('div');
                layerItem.className = 'layer-item';
                layerItem.textContent = obj.name;
                layerItem.dataset.id = obj.id;
                layerItem.onclick = (e) => {
                    e.stopPropagation();
                    window.App.state.selectedObject = obj;
                };
                layerList.appendChild(layerItem);

                // Track Item
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.dataset.id = obj.id;
                trackItem.onclick = (e) => {
                    const rect = trackItem.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const time = clickX / this.pixelsPerSecond;
                    this.addKeyframe(obj, time);
                };
                trackList.appendChild(trackItem);
            });
        }

        // Update selected state and keyframes
        objects.forEach((obj, index) => {
            const layerItem = layerList.children[index];
            const trackItem = trackList.children[index];

            if (layerItem) {
                if (window.App.state.selectedObject === obj) layerItem.classList.add('selected');
                else layerItem.classList.remove('selected');
            }

            if (trackItem) {
                // Update keyframes if needed
                const kfCount = obj.keyframes ? obj.keyframes.length : 0;
                if (trackItem.children.length !== kfCount) {
                    trackItem.innerHTML = '';
                    if (obj.keyframes) {
                        obj.keyframes.forEach(kf => {
                            const kfEl = document.createElement('div');
                            kfEl.className = 'keyframe';
                            kfEl.style.left = `${kf.time * this.pixelsPerSecond}px`;
                            trackItem.appendChild(kfEl);
                        });
                    }
                }
            }
        });
    },

    addKeyframe: function(obj, time) {
        if (!obj.keyframes) obj.keyframes = [];

        const newKf = {
            time: time,
            x: obj.x,
            y: obj.y,
            scale: obj.scale || 1,
            rotation: obj.rotation || 0,
            opacity: obj.opacity || 1
        };

        obj.keyframes.push(newKf);
        obj.keyframes.sort((a, b) => a.time - b.time);
        this.renderTracks();
    },

    updateTimeDisplay: function() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            timeEl.textContent = this.formatTime(this.currentTime);
        }
    },

    updatePlayhead: function() {
        const playhead = document.getElementById('playhead');
        if (playhead) {
            playhead.style.left = `${this.currentTime * this.pixelsPerSecond}px`;
        }
    },

    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }
};

// Global access
window.Timeline = Timeline;

document.addEventListener('DOMContentLoaded', () => {
    Timeline.init();
});
