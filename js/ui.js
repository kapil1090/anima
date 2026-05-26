/**
 * UI MODULE
 * Handles general UI interactions, tab switching, and modal management.
 */

const UI = {
    init: function() {
        console.log('UI Module: Initialized');
        this.setupSidebarTabs();
        this.setupAssetSearch();
        this.setupTopbarActions();
    },

    /**
     * Handles topbar buttons like Undo, Redo, Preview, Export
     */
    setupTopbarActions: function() {
        // Undo/Redo
        const undoBtn = document.getElementById('btn-undo');
        const redoBtn = document.getElementById('btn-redo');

        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                console.log('UI Module: Undo triggered');
                // History logic will be implemented in Phase 6
            });
        }

        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                console.log('UI Module: Redo triggered');
                // History logic will be implemented in Phase 6
            });
        }

        // Preview
        const previewBtn = document.getElementById('btn-preview');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                console.log('UI Module: Preview triggered');
                // Preview modal/system will be implemented in Phase 4
            });
        }

        // Export
        const exportBtn = document.getElementById('btn-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('UI Module: Export triggered');
                // Export system will be implemented in Phase 7
            });
        }

        // Project Name Auto-Save effect
        const projectNameInput = document.getElementById('project-name');
        const saveStatus = document.querySelector('.save-status');

        if (projectNameInput && saveStatus) {
            projectNameInput.addEventListener('input', () => {
                saveStatus.textContent = 'Saving...';

                // Simulate auto-save delay
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    saveStatus.textContent = 'Saved';
                }, 1000);
            });
        }
    },

    /**
     * Handles switching between asset categories in the left sidebar
     */
    setupSidebarTabs: function() {
        const navItems = document.querySelectorAll('#left-sidebar .nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');
                this.switchSidebarTab(tabName);
            });
        });
    },

    switchSidebarTab: function(tabName) {
        console.log(`UI Module: Switching to ${tabName} tab`);

        // Update Active State in Nav
        const navItems = document.querySelectorAll('#left-sidebar .nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update App State (optional, if we need to track it globally)
        if (window.App) {
            window.App.state.currentTab = tabName;
        }

        // Placeholder for loading assets for the selected tab
        this.loadAssets(tabName);
    },

    loadAssets: function(category) {
        const library = document.getElementById('asset-library');
        // This will be implemented in the Asset Library module (Phase 2)
        library.innerHTML = `<div class="empty-state">Loading ${category}...</div>`;

        // Simulating loading for now
        setTimeout(() => {
            library.innerHTML = `<div class="empty-state">No ${category} found.</div>`;
        }, 300);
    },

    setupAssetSearch: function() {
        const searchInput = document.getElementById('asset-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                console.log(`UI Module: Searching for "${query}"`);
                // Search logic will be implemented in Phase 2
            });
        }
    }
};

// Initialize UI when the main app starts
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
