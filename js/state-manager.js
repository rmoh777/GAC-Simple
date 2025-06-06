/**
 * StateManager class for handling interview state
 */
class StateManager {
    constructor() {
        this.state = {
            currentStep: 1,
            selectedState: null,
            preferences: {
                freeFormText: '',
                selectedButtons: [],
                priorities: {}
            },
            results: {
                recommendations: [],
                reasoning: '',
                timestamp: null
            },
            analytics: {
                startTime: Date.now(),
                stepTimes: [],
                completionTime: null,
                interactions: []
            }
        };

        // Initialize from session storage if available
        this.loadFromStorage();
    }

    /**
     * Get the current step number
     * @returns {number} Current step (1-3)
     */
    getCurrentStep() {
        return this.state.currentStep;
    }

    /**
     * Set the current step
     * @param {number} step - Step number (1-3)
     * @returns {boolean} Whether the step was set successfully
     */
    setCurrentStep(step) {
        if (this.validateStep(step)) {
            this.state.currentStep = step;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Validate step number
     * @param {number} step - Step number to validate
     * @returns {boolean} Whether the step is valid
     */
    validateStep(step) {
        return Number.isInteger(step) && step >= 1 && step <= 3;
    }

    /**
     * Set the selected state
     * @param {string} state - Two-letter state code
     * @returns {boolean} Whether the state was set successfully
     */
    setSelectedState(state) {
        if (this.validateState(state)) {
            this.state.selectedState = state.toUpperCase();
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Validate state code
     * @param {string} state - State code to validate
     * @returns {boolean} Whether the state is valid
     */
    validateState(state) {
        return typeof state === 'string' && 
               state.length === 2 && 
               /^[A-Za-z]{2}$/.test(state);
    }

    /**
     * Add a preference button selection
     * @param {string} preference - Preference type
     * @returns {boolean} Whether the preference was added
     */
    addPreference(preference) {
        if (this.validatePreference(preference)) {
            if (!this.state.preferences.selectedButtons.includes(preference)) {
                this.state.preferences.selectedButtons.push(preference);
                this.updatePriorities();
                this.saveToStorage();
                return true;
            }
        }
        return false;
    }

    /**
     * Remove a preference button selection
     * @param {string} preference - Preference type
     * @returns {boolean} Whether the preference was removed
     */
    removePreference(preference) {
        const index = this.state.preferences.selectedButtons.indexOf(preference);
        if (index > -1) {
            this.state.preferences.selectedButtons.splice(index, 1);
            this.updatePriorities();
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Validate preference type
     * @param {string} preference - Preference to validate
     * @returns {boolean} Whether the preference is valid
     */
    validatePreference(preference) {
        const validPreferences = [
            'unlimited-data', 'unlimited-talk', 'unlimited-text',
            'free-phone', 'no-contract', 'nationwide-coverage',
            // Retaining old values in case they are used elsewhere, can be cleaned up later
            'price', 'data', 'support', 'network', 'features'
        ];
        return validPreferences.includes(preference);
    }

    /**
     * Get the preferences object
     * @returns {Object} Preferences state
     */
    getPreferences() {
        return this.state.preferences;
    }

    /**
     * Update priorities based on selected preferences
     */
    updatePriorities() {
        const priorities = {};
        this.state.preferences.selectedButtons.forEach(pref => {
            priorities[pref] = 1;
        });
        this.state.preferences.priorities = priorities;
    }

    /**
     * Set the free form text preferences
     * @param {string} text - User's text input
     * @returns {boolean} Whether the text was set successfully
     */
    setFreeFormText(text) {
        if (typeof text === 'string') {
            this.state.preferences.freeFormText = text.trim();
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Set the results data
     * @param {Object} results - Results data from Gemini
     * @returns {boolean} Whether the results were set successfully
     */
    setResults(results) {
        if (this.validateResults(results)) {
            this.state.results = {
                ...results,
                timestamp: Date.now()
            };
            this.state.analytics.completionTime = Date.now();
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Validate results data
     * @param {Object} results - Results to validate
     * @returns {boolean} Whether the results are valid
     */
    validateResults(results) {
        return results && 
               Array.isArray(results.recommendations) && 
               results.recommendations.length === 3 &&
               typeof results.explanation === 'string';
    }

    /**
     * Get the complete state object
     * @returns {Object} Complete state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Reset the state to initial values
     */
    resetState() {
        this.state = {
            currentStep: 1,
            selectedState: null,
            preferences: {
                freeFormText: '',
                selectedButtons: [],
                priorities: {}
            },
            results: {
                recommendations: [],
                reasoning: '',
                timestamp: null
            },
            analytics: {
                startTime: Date.now(),
                stepTimes: [],
                completionTime: null,
                interactions: []
            }
        };
        this.saveToStorage();
    }

    /**
     * Save state to session storage
     */
    saveToStorage() {
        try {
            sessionStorage.setItem('interviewState', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving state to storage:', error);
        }
    }

    /**
     * Load state from session storage
     */
    loadFromStorage() {
        try {
            const savedState = sessionStorage.getItem('interviewState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (this.validateStateStructure(parsed)) {
                    this.state = parsed;
                }
            }
        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }

    /**
     * Validate state structure
     * @param {Object} state - State to validate
     * @returns {boolean} Whether the state structure is valid
     */
    validateStateStructure(state) {
        return state &&
               typeof state.currentStep === 'number' &&
               (state.selectedState === null || typeof state.selectedState === 'string') &&
               state.preferences &&
               Array.isArray(state.preferences.selectedButtons) &&
               typeof state.preferences.freeFormText === 'string' &&
               state.results &&
               Array.isArray(state.results.recommendations) &&
               state.analytics &&
               typeof state.analytics.startTime === 'number';
    }

    /**
     * Record step time
     * @param {number} step - Step number
     */
    recordStepTime(step) {
        if (this.validateStep(step)) {
            this.state.analytics.stepTimes[step - 1] = Date.now();
            this.saveToStorage();
        }
    }

    /**
     * Record user interaction
     * @param {string} type - Interaction type
     * @param {Object} data - Interaction data
     */
    recordInteraction(type, data = {}) {
        this.state.analytics.interactions.push({
            type,
            timestamp: Date.now(),
            data
        });
        this.saveToStorage();
    }

    /**
     * Get analytics data
     * @returns {Object} Analytics data
     */
    getAnalytics() {
        return {
            ...this.state.analytics,
            totalTime: this.state.analytics.completionTime - this.state.analytics.startTime
        };
    }
} 