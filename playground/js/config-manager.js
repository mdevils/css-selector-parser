/**
 * Config Manager - Manages parser configuration and presets
 */

export class ConfigManager {
    constructor() {
        this.defaultConfig = {
            syntax: 'latest',
            strict: true,
            substitutes: false
        };

        this.presets = {
            latest: {
                syntax: 'latest',
                strict: true,
                substitutes: false
            },
            css3: {
                syntax: 'css3',
                strict: true,
                substitutes: false
            },
            progressive: {
                syntax: 'progressive',
                strict: false,
                substitutes: true
            },
            modules: {
                syntax: 'latest',
                strict: true,
                substitutes: false,
                modules: ['css-position-4', 'css-scoping-1', 'css-pseudo-4', 'css-shadow-parts-1', 'css-nesting-1']
            }
        };
    }

    /**
     * Parse configuration from JSON string
     * @param {string} configText - JSON configuration string
     * @returns {Object} Parsed and validated configuration
     * @throws {Error} If JSON is invalid or configuration is invalid
     */
    parseConfig(configText) {
        try {
            const config = JSON.parse(configText);
            return this.validateConfig(config);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON configuration: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Validate configuration object
     * @param {Object} config - Configuration to validate
     * @returns {Object} Validated configuration
     * @throws {Error} If configuration is invalid
     */
    validateConfig(config) {
        if (typeof config !== 'object' || config === null) {
            throw new Error('Configuration must be an object');
        }

        // Validate syntax
        const validSyntax = ['css1', 'css2', 'css3', 'selectors-3', 'selectors-4', 'latest', 'progressive'];

        if (config.syntax && !validSyntax.includes(config.syntax)) {
            throw new Error(`Invalid syntax: ${config.syntax}. Must be one of: ${validSyntax.join(', ')}`);
        }

        // Validate booleans
        if (config.strict !== undefined && typeof config.strict !== 'boolean') {
            throw new Error('strict must be a boolean');
        }

        if (config.substitutes !== undefined && typeof config.substitutes !== 'boolean') {
            throw new Error('substitutes must be a boolean');
        }

        // Validate modules
        if (config.modules !== undefined) {
            if (!Array.isArray(config.modules)) {
                throw new Error('modules must be an array');
            }

            // Validate each module name
            const validModules = [
                'css-position-1',
                'css-position-2',
                'css-position-3',
                'css-position-4',
                'css-scoping-1',
                'css-pseudo-4',
                'css-shadow-parts-1',
                'css-nesting-1'
            ];

            for (const module of config.modules) {
                if (typeof module !== 'string') {
                    throw new Error('module names must be strings');
                }
                if (!validModules.includes(module)) {
                    console.warn(`Unknown module: ${module}. Valid modules are: ${validModules.join(', ')}`);
                }
            }
        }

        return config;
    }

    /**
     * Apply a preset configuration
     * @param {string} presetName - Name of the preset to apply
     * @param {Function} setConfigValue - Function to set config editor value
     */
    applyPreset(presetName, setConfigValue) {
        const preset = this.presets[presetName];
        if (!preset) {
            throw new Error(`Unknown preset: ${presetName}`);
        }

        // Update config editor with preset JSON
        if (setConfigValue) {
            setConfigValue(JSON.stringify(preset, null, 2));
        }

        // Update active preset button
        this.updateActivePreset(presetName);
    }

    /**
     * Update the active preset button
     * @param {string} presetName - Name of the active preset
     */
    updateActivePreset(presetName) {
        document.querySelectorAll('.preset-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.preset === presetName);
        });
    }

    /**
     * Detect which preset (if any) matches the current configuration
     * @param {Object} config - Current configuration
     * @returns {string|null} Name of matching preset, or null if no match
     */
    detectPreset(config) {
        for (const [name, preset] of Object.entries(this.presets)) {
            if (this.configsMatch(config, preset)) {
                return name;
            }
        }
        return null;
    }

    /**
     * Check if two configurations match
     * @param {Object} config1 - First configuration
     * @param {Object} config2 - Second configuration
     * @returns {boolean} True if configurations match
     */
    configsMatch(config1, config2) {
        // Compare as JSON strings for simplicity
        return JSON.stringify(config1) === JSON.stringify(config2);
    }

    /**
     * Get the default configuration
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {...this.defaultConfig};
    }

    /**
     * Get all available presets
     * @returns {Object} Object with preset names and configurations
     */
    getPresets() {
        return {...this.presets};
    }
}
