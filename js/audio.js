/* =========================
   AUDIO SYSTEM
========================= */

const AudioSystem = {
    tracks: [],

    init: function() {
        console.log("Audio system initialized");
    },

    addAudioTrack: function(url, name) {
        const track = {
            id: 'audio_' + Date.now(),
            url: url,
            name: name || 'Unnamed Track',
            startTime: 0,
            duration: 0, // Should be loaded from audio metadata
            volume: 1
        };
        this.tracks.push(track);
        return track;
    },

    playAll: function(startTime) {
        console.log("Playing all audio tracks from:", startTime);
    },

    stopAll: function() {
        console.log("Stopping all audio tracks");
    }
};

window.AudioSystem = AudioSystem;

document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.init();
});
