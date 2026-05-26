/**
 * UI MODULE
 * Handles general UI interactions, tab switching, and modal management.
 */

const UI = {
    init: function() {
        this.setupSidebarTabs();
        this.setupAssetSearch();
        this.setupTopbarActions();
        this.setupCanvasTools();

        // Initial asset load
        this.loadAssets('characters');

        // Properties update loop
        setInterval(() => this.updatePropertiesPanel(), 500);
    },

    updateProjectName: function() {
        if (window.App) {
            const nameInput = document.getElementById('project-name');
            if (nameInput) {
                nameInput.value = window.App.state.projectName;
            }
        }
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
                // History logic will be implemented in Phase 6
            });
        }

        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                // History logic will be implemented in Phase 6
            });
        }

        // Preview
        const previewBtn = document.getElementById('btn-preview');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                // Preview modal/system will be implemented in Phase 4
            });
        }

        // Export
        const exportBtn = document.getElementById('btn-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
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
                    if (window.Save) window.Save.saveProject();
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

    updatePropertiesPanel: function() {
        const panel = document.querySelector('#right-sidebar .panel-content');
        if (!panel) return;

        const obj = window.App?.state.selectedObject;
        if (!obj) {
            if (panel.innerHTML !== '<div class="empty-state">No object selected</div>') {
                panel.innerHTML = '<div class="empty-state">No object selected</div>';
                panel.dataset.selectedId = '';
            }
            return;
        }

        // If it's a new object, re-render the whole panel
        if (panel.dataset.selectedId !== obj.id) {
            this.renderPropertiesPanel(obj);
            return;
        }

        // If it's the same object, just update the input values to avoid focus loss
        this.syncPropertiesValues(obj);
    },

    syncPropertiesValues: function(obj) {
        const inputs = {
            'prop-name': obj.name,
            'prop-x': Math.round(obj.x),
            'prop-y': Math.round(obj.y),
            'prop-scale': obj.scale || 1,
            'prop-rotation': Math.round(obj.rotation || 0)
        };

        for (const [id, val] of Object.entries(inputs)) {
            const el = document.getElementById(id);
            if (el && document.activeElement !== el) {
                el.value = val;
            }
        }

        if (obj.type === 'text') {
            const txt = document.getElementById('prop-text');
            if (txt && document.activeElement !== txt) txt.value = obj.text;
            const size = document.getElementById('prop-fontSize');
            if (size && document.activeElement !== size) size.value = obj.fontSize;
        }
    },

    renderPropertiesPanel: function(obj) {
        const panel = document.querySelector('#right-sidebar .panel-content');
        panel.dataset.selectedId = obj.id;
        panel.innerHTML = `
            <div class="props-group">
                <label>Name</label>
                <input id="prop-name" type="text" value="${obj.name}" oninput="window.UI.updateObjProp('name', this.value)">
            </div>
            <div class="props-group">
                <label>Position X</label>
                <input id="prop-x" type="number" value="${Math.round(obj.x)}" oninput="window.UI.updateObjProp('x', parseFloat(this.value))">
            </div>
            <div class="props-group">
                <label>Position Y</label>
                <input id="prop-y" type="number" value="${Math.round(obj.y)}" oninput="window.UI.updateObjProp('y', parseFloat(this.value))">
            </div>
            <div class="props-group">
                <label>Scale</label>
                <input id="prop-scale" type="range" min="0.1" max="5" step="0.1" value="${obj.scale || 1}" oninput="window.UI.updateObjProp('scale', parseFloat(this.value))">
            </div>
            <div class="props-group">
                <label>Rotation</label>
                <input id="prop-rotation" type="number" value="${Math.round(obj.rotation || 0)}" oninput="window.UI.updateObjProp('rotation', parseFloat(this.value))">
            </div>
            ${obj.type === 'text' ? `
                <div class="props-group">
                    <label>Text Content</label>
                    <textarea id="prop-text" oninput="window.UI.updateObjProp('text', this.value)">${obj.text}</textarea>
                </div>
                <div class="props-group">
                    <label>Font Size</label>
                    <input id="prop-fontSize" type="number" value="${obj.fontSize}" oninput="window.UI.updateObjProp('fontSize', parseFloat(this.value))">
                </div>
            ` : ''}
            <div class="props-group">
                <button class="btn-danger" onclick="window.UI.deleteSelected()">Delete Object</button>
            </div>
        `;
    },

    updateObjProp: function(prop, value) {
        const obj = window.App?.state.selectedObject;
        if (obj) {
            obj[prop] = value;
        }
    },

    deleteSelected: function() {
        const obj = window.App?.state.selectedObject;
        if (obj && window.App) {
            window.App.state.objects = window.App.state.objects.filter(o => o.id !== obj.id);
            window.App.state.selectedObject = null;
            if (window.Timeline) window.Timeline.update(true);
        }
    },

    switchSidebarTab: function(tabName) {

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
        } else if (category === 'backgrounds') {
            this.renderBackgroundLibrary();
        } else if (category === 'props') {
            this.renderPropsLibrary();
        } else if (category === 'text') {
            this.renderTextLibrary();
        } else {
            library.innerHTML = `<div class="empty-state">No ${category} found.</div>`;
        }
    },

    renderTextLibrary: function() {
        const library = document.getElementById('asset-library');
        library.innerHTML = `
            <div class="asset-grid">
                <div class="asset-card text-card" title="Add Text">
                    <div class="asset-preview">T</div>
                    <div class="asset-name">Add Text</div>
                    <button class="btn-add-asset" onclick="window.Text.addText()">+</button>
                </div>
            </div>
        `;
    },

    /**
     * Renders props cards in the sidebar
     */
    renderPropsLibrary: function() {
        const library = document.getElementById('asset-library');

        if (!window.Props || !window.Props.library) {
            library.innerHTML = '<div class="empty-state">Props module not loaded.</div>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'asset-grid';

        window.Props.library.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'asset-card prop-card';
            card.setAttribute('data-id', prop.id);
            card.title = `Add ${prop.name}`;

            card.innerHTML = `
                <div class="asset-preview" style="background-color: ${prop.color}"></div>
                <div class="asset-name">${prop.name}</div>
                <button class="btn-add-asset">+</button>
            `;

            card.addEventListener('click', () => {
                if (window.Canvas && window.Canvas.addProp) {
                    window.Canvas.addProp(prop.id);
                }
            });

            grid.appendChild(card);
        });

        library.appendChild(grid);
    },

    /**
     * Renders background cards in the sidebar
     */
    renderBackgroundLibrary: function() {
        const library = document.getElementById('asset-library');

        if (!window.Backgrounds || !window.Backgrounds.library) {
            library.innerHTML = '<div class="empty-state">Background module not loaded.</div>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'asset-grid';

        window.Backgrounds.library.forEach(bg => {
            const card = document.createElement('div');
            card.className = 'asset-card background-card';
            card.setAttribute('data-id', bg.id);
            card.title = `Apply ${bg.name}`;

            let previewStyle = '';
            if (bg.type === 'color') {
                previewStyle = `background-color: ${bg.value}`;
            } else if (bg.type === 'gradient') {
                previewStyle = `background: linear-gradient(${bg.value[0]}, ${bg.value[1]})`;
            }

            card.innerHTML = `
                <div class="asset-preview" style="${previewStyle}"></div>
                <div class="asset-name">${bg.name}</div>
                <button class="btn-add-asset">+</button>
            `;

            card.addEventListener('click', () => {
                if (window.App) {
                    window.App.state.background = bg.id;
                    if (window.Canvas) window.Canvas.render();
                }
            });

            grid.appendChild(card);
        });

        library.appendChild(grid);
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
                // Search logic will be implemented in Phase 2
            });
        }
    }
};

// Global access
window.UI = UI;

// Initialize UI when the main app starts
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
