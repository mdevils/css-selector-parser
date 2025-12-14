/**
 * Main Application - CSS Selector Parser Playground
 */

import { ConfigManager } from './config-manager.js';
import { ParserWrapper } from './parser-wrapper.js';
import { UIController } from './ui-controller.js';

class PlaygroundApp {
  constructor() {
    this.parser = null;
    this.ui = new UIController();
    this.config = new ConfigManager();
    this.debounceTimer = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Show loading state
      this.showLoadingMessage();

      // Load parser from CDN
      this.parser = await ParserWrapper.create();

      // Initialize CodeMirror editors
      await this.ui.initializeEditors(
        () => this.debouncedParse(),
        () => {
          this.debouncedParse();
          this.updateActivePresetFromConfig();
        }
      );

      // Setup other event listeners
      this.setupEventListeners();

      // Perform initial parse
      this.handleSelectorChange();

      // Mark as initialized
      this.isInitialized = true;

      // Clear loading message
      this.clearLoadingMessage();
    } catch (error) {
      console.error('Failed to initialize playground:', error);
      this.ui.showError({
        type: 'InitializationError',
        message: 'Failed to load the CSS selector parser',
        formattedMessage: error.message
      });
    }
  }

  /**
   * Show loading message
   */
  showLoadingMessage() {
    // Will be shown in editor once initialized
  }

  /**
   * Clear loading message
   */
  clearLoadingMessage() {
    // Will be cleared by first parse
  }

  /**
   * Setup all event listeners (except editor changes)
   */
  setupEventListeners() {
    // Config preset buttons
    document.querySelectorAll('[data-preset]').forEach((button) => {
      button.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.config.applyPreset(preset, (value) => {
          this.ui.setConfigValue(value);
        });
        this.handleSelectorChange();
      });
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        this.ui.switchTab(e.target.dataset.tab);
      });
    });

    // Close error button
    const closeErrorButton = document.getElementById('close-error');
    if (closeErrorButton) {
      closeErrorButton.addEventListener('click', () => {
        this.ui.hideError();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to re-parse
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.handleSelectorChange();
      }
    });
  }

  /**
   * Debounced parse - waits for user to stop typing
   */
  debouncedParse() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.handleSelectorChange();
    }, 300); // 300ms debounce
  }

  /**
   * Handle selector or config change - parse and display results
   */
  handleSelectorChange() {
    if (!this.parser) return;

    const selector = this.ui.getSelectorValue().trim();
    const configText = this.ui.getConfigValue();

    // Don't parse empty selectors
    if (!selector) {
      this.ui.clearOutputs();
      this.ui.hideError();
      this.ui.clearConfigError();
      return;
    }

    try {
      // Parse configuration
      const config = this.config.parseConfig(configText);
      this.ui.clearConfigError();

      // Parse selector
      const result = this.parser.parse(selector, config);

      // Display results
      this.ui.showAST(result.ast);
      this.ui.showRendered(result.rendered);
      this.ui.hideError();
      this.ui.clearSelectorError();
    } catch (error) {
      console.error('Parse error:', error);

      // Handle config errors silently with just a visual indicator
      if (error.message && error.message.includes('JSON')) {
        this.ui.showConfigError();
        this.ui.showErrorInAST('⚠ Fix JSON configuration error');
        this.ui.showErrorInRendered('⚠ Fix JSON configuration error');
      } else {
        // Handle parser errors inline without popup
        this.ui.showSelectorError(error);
        const errorMsg = error.formattedMessage || error.message || 'Parse error';
        const positionInfo = error.position !== undefined ? ` at position ${error.position}` : '';
        const errorText = `⚠ Parser Error${positionInfo}\n\n${errorMsg}`;
        this.ui.showErrorInAST(errorText);
        this.ui.showErrorInRendered(errorText);
        this.ui.clearConfigError();
      }

      // Never show the popup during typing
      this.ui.hideError();
    }
  }

  /**
   * Update active preset button based on current config
   */
  updateActivePresetFromConfig() {
    try {
      const configText = this.ui.getConfigValue();
      const config = this.config.parseConfig(configText);
      const matchingPreset = this.config.detectPreset(config);

      if (matchingPreset) {
        this.config.updateActivePreset(matchingPreset);
      } else {
        // Clear all active states if no preset matches
        document.querySelectorAll('.preset-btn').forEach((btn) => {
          btn.classList.remove('active');
        });
      }
    } catch (error) {
      // Ignore errors during preset detection
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new PlaygroundApp();
    app.init();
  });
} else {
  // DOM already loaded
  const app = new PlaygroundApp();
  app.init();
}
