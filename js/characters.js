/**
 * CHARACTERS MODULE
 * Stores character definitions and handle character-specific logic.
 */

window.Characters = {
    // Character Definitions
    library: [
        {
            id: 'char_hero',
            name: 'Hero',
            category: 'Human',
            skinColor: '#f4c88a',
            outfitColor: '#4361ee',
            hairColor: '#2d3436'
        },
        {
            id: 'char_star',
            name: 'Star',
            category: 'Human',
            skinColor: '#f4a77b',
            outfitColor: '#e84393',
            hairColor: '#6c5ce7'
        },
        {
            id: 'char_bot',
            name: 'Bot',
            category: 'Robot',
            skinColor: '#adb5bd',
            outfitColor: '#4361ee',
            hairColor: null
        },
        {
            id: 'char_boss',
            name: 'Boss',
            category: 'Human',
            skinColor: '#d4a574',
            outfitColor: '#2d3436',
            hairColor: '#2d3436'
        }
    ],

    /**
     * Get a character by ID
     */
    getById: function(id) {
        return this.library.find(char => char.id === id);
    }
};
