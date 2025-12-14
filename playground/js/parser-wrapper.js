/**
 * Parser Wrapper - Handles parser integration and error normalization
 */

export class ParserWrapper {
    constructor(parserModule) {
        this.createParser = parserModule.createParser;
        this.render = parserModule.render;
        this.ast = parserModule.ast;
    }

    /**
     * Create a new ParserWrapper by loading the parser from CDN
     * @returns {Promise<ParserWrapper>}
     */
    static async create() {
        try {
            // Try primary CDN (jsdelivr)
            const parserModule = await import('https://cdn.jsdelivr.net/npm/css-selector-parser@3.2.0/+esm');
            return new ParserWrapper(parserModule);
        } catch (error) {
            // Fallback to unpkg CDN
            try {
                const parserModule = await import('https://unpkg.com/css-selector-parser@3.2.0/dist/mjs/index.js');
                return new ParserWrapper(parserModule);
            } catch (fallbackError) {
                throw new Error('Failed to load parser from CDN. Please check your internet connection.');
            }
        }
    }

    /**
     * Parse a CSS selector with the given configuration
     * @param {string} selector - CSS selector to parse
     * @param {Object} config - Parser configuration
     * @returns {Object} Parse result with ast and rendered properties
     */
    parse(selector, config = {}) {
        try {
            // Create parser with config
            const parse = this.createParser(config);

            // Parse selector
            const ast = parse(selector);

            // Render back to string (for validation)
            const rendered = this.render(ast);

            return {
                ast,
                rendered,
                success: true
            };
        } catch (error) {
            // Normalize error and re-throw
            throw this.normalizeError(error, selector);
        }
    }

    /**
     * Normalize parser errors for consistent display
     * @param {Error} error - Original error
     * @param {string} selector - The selector being parsed
     * @returns {Object} Normalized error object
     */
    normalizeError(error, selector) {
        if (error.name === 'ParserError') {
            return {
                type: 'ParserError',
                message: error.message,
                position: error.position,
                formattedMessage: this.formatParserError(error, selector),
                original: error
            };
        }

        return {
            type: 'Error',
            message: error.message || 'Unknown error occurred',
            formattedMessage: error.message || 'Unknown error occurred',
            original: error
        };
    }

    /**
     * Format a parser error with position information
     * @param {Error} error - Parser error
     * @param {string} selector - The selector being parsed
     * @returns {string} Formatted error message
     */
    formatParserError(error, selector) {
        const lines = [error.message];

        if (error.position !== undefined && selector) {
            lines.push('');
            lines.push('Position: ' + error.position);

            // Show context around error position
            const start = Math.max(0, error.position - 20);
            const end = Math.min(selector.length, error.position + 20);
            const context = selector.substring(start, end);
            const pointer = ' '.repeat(error.position - start) + '^';

            lines.push('');
            lines.push('Context:');
            lines.push(context);
            lines.push(pointer);
        }

        return lines.join('\n');
    }

    /**
     * Get information about available CSS modules
     * @returns {Array} Array of module info objects
     */
    getAvailableModules() {
        return [
            {
                name: 'css-position-1',
                description: 'Position-related pseudo-classes (:static, :relative, :absolute)'
            },
            {
                name: 'css-position-2',
                description: 'Position with :fixed'
            },
            {
                name: 'css-position-3',
                description: 'Position with :sticky'
            },
            {
                name: 'css-position-4',
                description: 'Position with :initial (included in latest)'
            },
            {
                name: 'css-scoping-1',
                description: 'Shadow DOM selectors (:host, :host-context(), ::slotted())'
            },
            {
                name: 'css-pseudo-4',
                description: 'Modern pseudo-elements (::selection, ::backdrop, ::marker)'
            },
            {
                name: 'css-shadow-parts-1',
                description: 'Shadow DOM parts (::part())'
            },
            {
                name: 'css-nesting-1',
                description: 'CSS Nesting selector (&)'
            }
        ];
    }
}
