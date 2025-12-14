/**
 * UI Controller - Manages UI state, Ace editors, and display
 */

export class UIController {
    constructor() {
        this.currentTab = 'ast';
        this.selectorEditor = null;
        this.configEditor = null;
        this.astOutputEditor = null;
        this.renderedOutputEditor = null;
    }

    /**
     * Initialize Ace editors
     * @param {Function} onSelectorChange - Callback when selector changes
     * @param {Function} onConfigChange - Callback when config changes
     */
    async initializeEditors(onSelectorChange, onConfigChange) {
        // Wait for Ace to be available
        if (typeof ace === 'undefined') {
            throw new Error('Ace Editor not loaded');
        }

        // Detect user's color scheme preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDark ? 'ace/theme/monokai' : 'ace/theme/github';

        // Create CSS selector editor
        const selectorContainer = document.getElementById('selector-editor');
        if (selectorContainer) {
            this.selectorEditor = ace.edit(selectorContainer, {
                mode: 'ace/mode/css',
                theme: theme,
                fontSize: 14,
                minLines: 10,
                maxLines: 20,
                showPrintMargin: false,
                highlightActiveLine: true,
                wrap: true,
                useWorker: false  // Disable built-in CSS validation
            });
            this.selectorEditor.setValue('div.container:has(> nav.main) > a[href^="https"]:hover::before', -1);
            this.selectorEditor.on('change', () => {
                onSelectorChange();
            });
        }

        // Create JSON config editor
        const configContainer = document.getElementById('config-editor');
        if (configContainer) {
            this.configEditor = ace.edit(configContainer, {
                mode: 'ace/mode/json',
                theme: theme,
                fontSize: 14,
                minLines: 6,
                maxLines: 10,
                showPrintMargin: false,
                highlightActiveLine: true,
                wrap: true
            });
            const defaultConfig = JSON.stringify({
                syntax: 'latest',
                strict: true,
                substitutes: false
            }, null, 2);
            this.configEditor.setValue(defaultConfig, -1);
            this.configEditor.on('change', () => {
                onConfigChange();
            });

            // Add custom autocomplete for config options
            this.addConfigAutocomplete();
        }

        // Create read-only AST output editor
        const astContainer = document.getElementById('ast-output');
        if (astContainer) {
            this.astOutputEditor = ace.edit(astContainer, {
                mode: 'ace/mode/json',
                theme: theme,
                fontSize: 13,
                readOnly: true,
                showPrintMargin: false,
                highlightActiveLine: false,
                highlightGutterLine: false,
                wrap: true
            });
            this.astOutputEditor.renderer.setShowGutter(false);
            this.astOutputEditor.setValue('', -1);
        }

        // Create read-only rendered output editor
        const renderedContainer = document.getElementById('rendered-output');
        if (renderedContainer) {
            this.renderedOutputEditor = ace.edit(renderedContainer, {
                mode: 'ace/mode/css',
                theme: theme,
                fontSize: 13,
                readOnly: true,
                showPrintMargin: false,
                highlightActiveLine: false,
                highlightGutterLine: false,
                wrap: true
            });
            this.renderedOutputEditor.renderer.setShowGutter(false);
            this.renderedOutputEditor.setValue('', -1);
        }

        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.updateTheme(e.matches);
        });
    }

    /**
     * Add custom autocomplete for config editor
     */
    addConfigAutocomplete() {
        if (!this.configEditor) return;

        const configCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                // Get current line and context
                const line = session.getLine(pos.row);
                const beforeCursor = line.substring(0, pos.column);
                const afterCursor = line.substring(pos.column);

                // Get all text before cursor position (including previous lines)
                let fullTextBeforeCursor = '';
                for (let i = 0; i < pos.row; i++) {
                    fullTextBeforeCursor += session.getLine(i) + '\n';
                }
                fullTextBeforeCursor += beforeCursor;

                // Check if there's already an opening quote before the cursor
                const hasOpeningQuote = pos.column > 0 && line[pos.column - 1] === '"';
                // Check if there's already a closing quote after the cursor
                const hasClosingQuote = afterCursor.length > 0 && afterCursor[0] === '"';

                // Helper to format values based on whether quotes are already present
                const formatValue = (text) => {
                    let result = text;

                    // Remove leading quote if already typed
                    if (hasOpeningQuote && result.startsWith('"')) {
                        result = result.substring(1);
                    }

                    // Remove trailing quote if already typed
                    if (hasClosingQuote && result.endsWith('"')) {
                        result = result.substring(0, result.length - 1);
                    }

                    return result;
                };

                // Config keys
                const configKeys = [
                    { value: formatValue('"syntax"'), meta: 'config key', score: 1000, caption: 'syntax' },
                    { value: formatValue('"strict"'), meta: 'config key', score: 1000, caption: 'strict' },
                    { value: formatValue('"substitutes"'), meta: 'config key', score: 1000, caption: 'substitutes' },
                    { value: formatValue('"modules"'), meta: 'config key', score: 1000, caption: 'modules' }
                ];

                // Syntax values
                const syntaxValues = [
                    { value: formatValue('"css1"'), meta: 'syntax', score: 900, caption: 'css1' },
                    { value: formatValue('"css2"'), meta: 'syntax', score: 900, caption: 'css2' },
                    { value: formatValue('"css3"'), meta: 'syntax', score: 900, caption: 'css3' },
                    { value: formatValue('"selectors-3"'), meta: 'syntax', score: 900, caption: 'selectors-3' },
                    { value: formatValue('"selectors-4"'), meta: 'syntax', score: 900, caption: 'selectors-4' },
                    { value: formatValue('"latest"'), meta: 'syntax', score: 900, caption: 'latest' },
                    { value: formatValue('"progressive"'), meta: 'syntax', score: 900, caption: 'progressive' }
                ];

                // Boolean values (no quotes needed)
                const booleanValues = [
                    { value: 'true', meta: 'boolean', score: 900, caption: 'true' },
                    { value: 'false', meta: 'boolean', score: 900, caption: 'false' }
                ];

                // Module names
                const moduleNames = [
                    { value: formatValue('"css-position-4"'), meta: 'module', score: 900, caption: 'css-position-4' },
                    { value: formatValue('"css-scoping-1"'), meta: 'module', score: 900, caption: 'css-scoping-1' },
                    { value: formatValue('"css-pseudo-4"'), meta: 'module', score: 900, caption: 'css-pseudo-4' },
                    { value: formatValue('"css-shadow-parts-1"'), meta: 'module', score: 900, caption: 'css-shadow-parts-1' },
                    { value: formatValue('"css-nesting-1"'), meta: 'module', score: 900, caption: 'css-nesting-1' }
                ];

                // Check if we're inside modules array (look for unclosed "modules": [ ... ])
                const modulesMatch = fullTextBeforeCursor.match(/"modules"\s*:\s*\[/);
                if (modulesMatch) {
                    // Check if the array is still open (no closing ] after the opening [)
                    const afterModulesArray = fullTextBeforeCursor.substring(modulesMatch.index + modulesMatch[0].length);
                    const openBrackets = (afterModulesArray.match(/\[/g) || []).length;
                    const closeBrackets = (afterModulesArray.match(/\]/g) || []).length;

                    if (openBrackets >= closeBrackets) {
                        // We're inside the modules array
                        callback(null, moduleNames);
                        return;
                    }
                }

                // Find the last key-value pattern to determine context
                // Look for the last "key": pattern before cursor
                const keyValuePattern = /"(syntax|strict|substitutes|modules)"\s*:\s*([^,}\]]*?)$/;
                const match = fullTextBeforeCursor.match(keyValuePattern);

                if (match) {
                    const key = match[1];
                    const valueStarted = match[2].trim();

                    // If we're right after the colon (value position)
                    if (key === 'syntax' && !valueStarted.includes(',')) {
                        callback(null, syntaxValues);
                        return;
                    }

                    if ((key === 'strict' || key === 'substitutes') && !valueStarted.includes(',')) {
                        callback(null, booleanValues);
                        return;
                    }
                }

                // Default: suggest config keys
                callback(null, configKeys);
            }
        };

        // Add the completer
        this.configEditor.completers = [configCompleter];

        // Enable live autocomplete
        this.configEditor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    }

    /**
     * Update editor themes based on dark mode
     * @param {boolean} isDark - Whether dark mode is enabled
     */
    updateTheme(isDark) {
        const theme = isDark ? 'ace/theme/monokai' : 'ace/theme/github';

        if (this.selectorEditor) this.selectorEditor.setTheme(theme);
        if (this.configEditor) this.configEditor.setTheme(theme);
        if (this.astOutputEditor) this.astOutputEditor.setTheme(theme);
        if (this.renderedOutputEditor) this.renderedOutputEditor.setTheme(theme);
    }

    /**
     * Get selector editor content
     * @returns {string}
     */
    getSelectorValue() {
        return this.selectorEditor ? this.selectorEditor.getValue() : '';
    }

    /**
     * Get config editor content
     * @returns {string}
     */
    getConfigValue() {
        return this.configEditor ? this.configEditor.getValue() : '';
    }

    /**
     * Set selector editor content
     * @param {string} value
     */
    setSelectorValue(value) {
        if (this.selectorEditor) {
            this.selectorEditor.setValue(value, -1);
        }
    }

    /**
     * Set config editor content
     * @param {string} value
     */
    setConfigValue(value) {
        if (this.configEditor) {
            this.configEditor.setValue(value, -1);
        }
    }

    /**
     * Display AST in the output panel
     * @param {Object} ast - The parsed AST object
     */
    showAST(ast) {
        if (!this.astOutputEditor) return;
        // Switch to JSON mode for proper highlighting
        this.astOutputEditor.session.setMode('ace/mode/json');
        const formatted = JSON.stringify(ast, null, 2);
        this.astOutputEditor.setValue(formatted, -1);
    }

    /**
     * Display error message in AST output (as plain text)
     * @param {string} message - Error message to display
     */
    showErrorInAST(message) {
        if (!this.astOutputEditor) return;
        // Switch to text mode to avoid incorrect JSON highlighting
        this.astOutputEditor.session.setMode('ace/mode/text');
        this.astOutputEditor.setValue(message, -1);
    }

    /**
     * Display rendered CSS selector
     * @param {string} rendered - The rendered CSS selector string
     */
    showRendered(rendered) {
        if (!this.renderedOutputEditor) return;
        // Switch to CSS mode for proper highlighting
        this.renderedOutputEditor.session.setMode('ace/mode/css');
        this.renderedOutputEditor.setValue(rendered, -1);
    }

    /**
     * Display error message in rendered output (as plain text)
     * @param {string} message - Error message to display
     */
    showErrorInRendered(message) {
        if (!this.renderedOutputEditor) return;
        // Switch to text mode to avoid incorrect CSS highlighting
        this.renderedOutputEditor.session.setMode('ace/mode/text');
        this.renderedOutputEditor.setValue(message, -1);
    }

    /**
     * Show an error message
     * @param {Object|Error} error - Error object with message and optional position
     */
    showError(error) {
        const errorDisplay = document.getElementById('error-display');
        const errorMessage = document.getElementById('error-message');
        const errorDetails = document.getElementById('error-details');

        if (!errorDisplay || !errorMessage || !errorDetails) return;

        // Set error message
        const message = error.formattedMessage || error.message || 'An error occurred';
        errorMessage.textContent = message;

        // Set error details if position is available
        if (error.position !== undefined) {
            errorDetails.innerHTML = `
        <p><strong>Error Type:</strong> ${error.type || 'ParserError'}</p>
        <p><strong>Position:</strong> Character ${error.position}</p>
        <p>The parser encountered an error at position ${error.position} in your selector.</p>
      `;
        } else if (error.type) {
            errorDetails.innerHTML = `
        <p><strong>Error Type:</strong> ${error.type}</p>
      `;
        } else {
            errorDetails.innerHTML = '';
        }

        errorDisplay.classList.remove('hidden');
    }

    /**
     * Hide the error display
     */
    hideError() {
        const errorDisplay = document.getElementById('error-display');
        if (errorDisplay) {
            errorDisplay.classList.add('hidden');
        }
    }

    /**
     * Show visual indicator for config error
     */
    showConfigError() {
        const configContainer = document.getElementById('config-editor');
        if (configContainer) {
            configContainer.classList.add('has-error');
        }
    }

    /**
     * Clear config error indicator
     */
    clearConfigError() {
        const configContainer = document.getElementById('config-editor');
        if (configContainer) {
            configContainer.classList.remove('has-error');
        }
    }

    /**
     * Show visual indicator for selector error and display error annotation
     * @param {Object} error - Error object with message and optional position
     */
    showSelectorError(error) {
        const selectorContainer = document.getElementById('selector-editor');
        if (selectorContainer) {
            selectorContainer.classList.add('has-error');
        }

        // Show error as Ace annotation
        if (this.selectorEditor && error) {
            const selector = this.selectorEditor.getValue();
            const position = error.position !== undefined ? error.position : 0;

            // Calculate row and column from position
            let row = 0;
            let column = 0;
            for (let i = 0; i < position && i < selector.length; i++) {
                if (selector[i] === '\n') {
                    row++;
                    column = 0;
                } else {
                    column++;
                }
            }

            const annotations = [{
                row: row,
                column: column,
                text: error.formattedMessage || error.message || 'Parse error',
                type: 'error'
            }];

            this.selectorEditor.getSession().setAnnotations(annotations);
        }
    }

    /**
     * Clear selector error indicator and annotations
     */
    clearSelectorError() {
        const selectorContainer = document.getElementById('selector-editor');
        if (selectorContainer) {
            selectorContainer.classList.remove('has-error');
        }

        // Clear Ace annotations
        if (this.selectorEditor) {
            this.selectorEditor.getSession().clearAnnotations();
        }
    }

    /**
     * Switch to a different tab
     * @param {string} tabName - Name of the tab to switch to (ast, rendered, info)
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach((content) => {
            const contentId = `${tabName}-view`;
            content.classList.toggle('active', content.id === contentId);
        });

        this.currentTab = tabName;
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (default 2000)
     */
    showToast(message, duration = 2000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Set loading state for output panel
     * @param {boolean} isLoading - Whether loading state should be shown
     */
    setLoading(isLoading) {
        if (isLoading) {
            if (this.astOutputEditor) {
                this.astOutputEditor.setValue('Parsing...', -1);
            }
            if (this.renderedOutputEditor) {
                this.renderedOutputEditor.setValue('Parsing...', -1);
            }
        }
    }

    /**
     * Clear all outputs
     */
    clearOutputs() {
        if (this.astOutputEditor) {
            this.astOutputEditor.setValue('', -1);
        }
        if (this.renderedOutputEditor) {
            this.renderedOutputEditor.setValue('', -1);
        }
    }
}
