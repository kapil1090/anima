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
        this.setupCanvasTools();

        // Initial asset load
        this.loadAssets('characters');
    },

    /**
     * Handles selection of canvas tools (Select, Hand)
     */
    setupCanvasTools: function() {
        const toolBtns = document.querySelectorAll('.toolbar-group .tool-btn');

        toolBtns.forEach(btn => {
            if (btn.id.startsWith('tool-')) {
                btn.addEventListener('click', () => {
                    const tool = btn.id.replace('tool-', '');
                    this.switchTool(tool);
                });
            }
        });
    },

    switchTool: function(tool) {
        console.log(`UI Module: Switching to ${tool} tool`);

        const toolBtns = document.querySelectorAll('.toolbar-group .tool-btn');
        toolBtns.forEach(btn => {
            if (btn.id === `tool-${tool}`) {
                btn.classList.add('active');
            } else if (btn.id.startsWith('tool-')) {
                btn.classList.remove('active');
            }
        });

        if (window.App) {
            window.App.state.currentTool = tool;
        }
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
        library.innerHTML = ''; // Clear current view

        if (category === 'characters') {
            this.renderCharacterLibrary();
        } else {
            library.innerHTML = `<div class="empty-state">No ${category} found.</div>`;
        }
    },

    /**
     * Renders character cards in the sidebar
     */
    renderCharacterLibrary: function() {
        const library = document.getElementById('asset-library');

        if (!window.Characters || !window.Characters.library) {
            library.innerHTML = '<div class="empty-state">Character module not loaded.</div>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'asset-grid';

        window.Characters.library.forEach(char => {
            const card = document.createElement('div');
            card.className = 'asset-card character-card';
            card.setAttribute('data-id', char.id);
            card.title = `Add ${char.name}`;

            card.innerHTML = `
                <div class="asset-preview">
                    <span class="avatar-placeholder" style="background-color: ${char.outfitColor}"></span>
                </div>
                <div class="asset-name">${char.name}</div>
                <button class="btn-add-asset">+</button>
            `;

            card.addEventListener('click', () => {
                console.log(`UI Module: Adding character ${char.id} to scene`);
                // Logic for adding to canvas will be in Phase 2 Step 6 next
                if (window.Canvas && window.Canvas.addCharacter) {
                    window.Canvas.addCharacter(char.id);
                }
            });

            grid.appendChild(card);
        });

        library.appendChild(grid);
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
