/**
 * InterviewController class for managing the interview flow
 */
class InterviewController {
    constructor() {
        this.stateManager = new StateManager();
        this.geminiService = new GeminiService();
        this.resultsRenderer = new ResultsRenderer();
        this.analytics = new Analytics();
        this.sessionManager = new SessionManager();
        
        // Error handling state
        this.errorState = {
            hasError: false,
            currentError: null,
            errorContext: null
        };
        
        // Initialize UI elements
        this.initializeElements();
        
        // Bind event handlers
        this.bindEvents();
        
        // Start analytics tracking
        this.analytics.trackInterviewStart();
        
        // Initialize session
        this.initializeSession();

        this.currentStep = 'preferences';
        this.steps = ['preferences', 'results'];
        this.preferences = new Set();
        this.isMobile = window.innerWidth <= 768;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Initialize the UI to show the first step
        this.showStep('preferences');
    }

    /**
     * Initialize UI elements
     */
    initializeElements() {
        // Step containers
        this.stepPreferences = document.getElementById('step-preferences');
        this.stepResults = document.getElementById('step-results');
        
        // Preference buttons
        this.preferenceButtons = document.querySelectorAll('.preference-btn');
        this.preferencesError = document.getElementById('preferencesError');
        
        // Text input
        this.preferencesText = document.getElementById('preferencesText');
        this.textInputError = document.getElementById('textInputError');
        
        // Navigation buttons
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        
        // Results container
        this.resultsContainer = document.getElementById('resultsContainer');
        
        // Loading indicator
        this.loadingIndicator = document.getElementById('loadingIndicator');

        // Restore previous preferences if they exist
        this.restorePreferences();
    }

    /**
     * Restore previous preferences
     */
    restorePreferences() {
        const savedPreferences = this.stateManager.getPreferences();
        
        // Restore button selections
        this.preferenceButtons.forEach(button => {
            const preference = button.dataset.preference;
            if (savedPreferences.selectedButtons.includes(preference)) {
                button.classList.add('selected');
            }
        });
        
        // Restore text input
        if (savedPreferences.freeFormText) {
            this.preferencesText.value = savedPreferences.freeFormText;
        }
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        this.preferenceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.currentTarget = button;
                this.handlePreferenceClick(e);
            });
        });
        this.preferencesText.addEventListener('input', () => this.handleTextInput());
        this.nextBtn.addEventListener('click', () => this.handleNavigation('next'));
        this.prevBtn.addEventListener('click', () => this.handleNavigation('prev'));
    }

    /**
     * Handle preference button selection
     * @param {HTMLElement} button - Clicked button
     */
    handlePreferenceSelection(button) {
        const preference = button.dataset.preference;
        button.classList.toggle('selected');
        if (button.classList.contains('selected')) {
            this.stateManager.addPreference(preference);
        } else {
            this.stateManager.removePreference(preference);
        }
        
        // Track preference selection
        this.analytics.trackEvent('preference_selected', {
            preference: preference,
            selected: button.classList.contains('selected')
        });
        this.updateUI(); // Ensure Next button state is updated
    }

    /**
     * Handle text input
     */
    handleTextInput() {
        const text = this.preferencesText.value.trim();
        
        // Clear previous error
        this.textInputError.textContent = '';
        
        // Update state manager
        if (this.stateManager.setFreeFormText(text)) {
            this.analytics.trackTextInput(text.length);
            this.stateManager.recordInteraction('text_input', { length: text.length });
        }
        
        // Update UI state
        this.updateUI();
    }

    /**
     * Handle next button click
     */
    handleNext() {
        if (this.currentStep === 'preferences') {
            if (this.validateCurrentStep()) {
                this.showStep('results');
                this.processRecommendations();
            }
        } else if (this.currentStep === 'results') {
            // Potentially a "Finish" or "Start Over" action if needed
            // For now, it does nothing on the results page
        }
        
        // Track navigation
        this.analytics.trackEvent('navigation', {
            direction: 'next',
            current_step: this.currentStep
        });
    }

    /**
     * Handle back button click
     */
    handleBack() {
        if (this.currentStep === 'results') {
            this.showStep('preferences');
        }
        // No 'back' from 'preferences' as it's the first step now
        
        // Track navigation
        this.analytics.trackEvent('navigation', {
            direction: 'back',
            current_step: this.currentStep
        });
    }

    /**
     * Show the specified step
     * @param {string} step - The step to show (\`preferences\`, \`results\`)
     */
    showStep(step) {
        // Hide all steps
        this.stepPreferences.classList.remove('active');
        this.stepResults.classList.remove('active');

        // Show the target step
        if (step === 'preferences') {
            this.stepPreferences.classList.add('active');
            this.currentStep = 'preferences';
            this.prevBtn.style.display = 'none'; // Hide Prev on the first step
            this.nextBtn.style.display = 'inline-block';
            this.nextBtn.textContent = 'Next';
        } else if (step === 'results') {
            this.stepResults.classList.add('active');
            this.currentStep = 'results';
            this.prevBtn.style.display = 'inline-block';
            this.nextBtn.style.display = 'none'; // Or "Finish", "Start Over"
        }
        this.updateUI();
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        // Update next button state
        this.nextBtn.disabled = false; // Preferences step is now the first, enable Next by default
        
        // Update progress indicator
        this.updateProgressIndicator();
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator() {
        const steps = ['preferences', 'results'];
        const currentStepIndex = steps.indexOf(this.currentStep);
        
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index === currentStepIndex);
            step.classList.toggle('completed', index < currentStepIndex);
        });
    }

    /**
     * Process recommendations using Gemini service
     */
    async processRecommendations() {
        const selectedPreferences = this.stateManager.getPreferences().selectedButtons;
        const freeFormText = this.preferencesText.value;

        // Track recommendation request
        this.analytics.trackEvent('recommendation_requested', {
            preferences: selectedPreferences,
            free_form_text: freeFormText
        });

        try {
            const recommendations = await this.geminiService.getRecommendations({
                preferences: selectedPreferences,
                freeFormText: freeFormText,
                // state: this.stateManager.getSelectedState() // State removed
            });
            this.displayResults(recommendations);
            // Track recommendation success
            this.analytics.trackEvent('recommendation_success', {
                num_recommendations: recommendations.length 
            });
        } catch (error) {
            this.handleError(error);
            
            // Track error
            this.analytics.trackEvent('recommendations_error', {
                error: error.message
            });
        }
    }

    /**
     * Render the results
     * @param {Object} results - Results from Gemini
     */
    renderResults(results) {
        const renderer = new ResultsRenderer();
        renderer.renderComparison(results.recommendations);
    }

    /**
     * Handle errors in the interview flow
     * @param {Error} error - The error object
     * @param {string} context - The context where the error occurred
     * @param {Object} options - Additional error handling options
     */
    handleError(error, context, options = {}) {
        // Set error state
        this.errorState.hasError = true;
        this.errorState.currentError = error;
        this.errorState.errorContext = context;

        // Track error in analytics
        this.analytics.trackError(error, context);

        // Log error for debugging
        console.error(`Error in ${context}:`, error);

        // Show error message to user
        this.showErrorMessage(error, context, options);

        // Handle specific error types
        if (error instanceof NetworkError) {
            this.handleNetworkError(error);
        } else if (error instanceof ValidationError) {
            this.handleValidationError(error);
        } else if (error instanceof APIError) {
            this.handleAPIError(error);
        } else {
            this.handleGenericError(error);
        }
    }

    /**
     * Show error message to user
     * @param {Error} error - The error object
     * @param {string} context - The context where the error occurred
     * @param {Object} options - Additional error handling options
     */
    showErrorMessage(error, context, options = {}) {
        const errorContainer = document.getElementById('errorContainer');
        if (!errorContainer) return;

        // Create error message
        const errorMessage = this.formatErrorMessage(error, context);
        
        // Update error container
        errorContainer.innerHTML = `
            <div class="error-message ${options.severity || 'error'}">
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <h3>${errorMessage.title}</h3>
                    <p>${errorMessage.message}</p>
                    ${errorMessage.action ? `<button class="error-action">${errorMessage.action}</button>` : ''}
                </div>
            </div>
        `;

        // Show error container
        errorContainer.style.display = 'block';

        // Add action button handler if present
        if (errorMessage.action) {
            const actionButton = errorContainer.querySelector('.error-action');
            actionButton.addEventListener('click', () => this.handleErrorAction(error, context));
        }

        // Auto-hide error after timeout if specified
        if (options.autoHide) {
            setTimeout(() => {
                this.clearError();
            }, options.autoHide);
        }
    }

    /**
     * Format error message for display
     * @param {Error} error - The error object
     * @param {string} context - The context where the error occurred
     * @returns {Object} Formatted error message
     */
    formatErrorMessage(error, context) {
        const errorMessages = {
            network: {
                title: 'Connection Error',
                message: 'Unable to connect to the server. Please check your internet connection and try again.',
                action: 'Retry'
            },
            validation: {
                title: 'Invalid Input',
                message: error.message || 'Please check your input and try again.',
                action: 'Fix Input'
            },
            api: {
                title: 'Service Error',
                message: 'We encountered an issue with our service. Please try again later.',
                action: 'Try Again'
            },
            default: {
                title: 'Something Went Wrong',
                message: 'An unexpected error occurred. Please try again.',
                action: 'Retry'
            }
        };

        return errorMessages[error.type] || errorMessages.default;
    }

    /**
     * Handle network errors
     * @param {NetworkError} error - The network error
     */
    handleNetworkError(error) {
        // Show offline indicator
        this.showOfflineIndicator();
        
        // Attempt to reconnect
        this.attemptReconnection();
    }

    /**
     * Handle validation errors
     * @param {ValidationError} error - The validation error
     */
    handleValidationError(error) {
        // Highlight invalid fields
        this.highlightInvalidFields(error.fields);
        
        // Focus first invalid field
        if (error.fields.length > 0) {
            const firstField = document.getElementById(error.fields[0]);
            if (firstField) firstField.focus();
        }
    }

    /**
     * Handle API errors
     * @param {APIError} error - The API error
     */
    handleAPIError(error) {
        // Check if error is retryable
        if (error.isRetryable) {
            this.retryFailedRequest(error);
        } else {
            // Show fallback content
            this.showFallbackContent();
        }
    }

    /**
     * Handle generic errors
     * @param {Error} error - The generic error
     */
    handleGenericError(error) {
        // Log error for debugging
        console.error('Generic error:', error);
        
        // Show generic error message
        this.showErrorMessage(error, 'generic');
    }

    /**
     * Clear current error state
     */
    clearError() {
        this.errorState.hasError = false;
        this.errorState.currentError = null;
        this.errorState.errorContext = null;

        // Hide error container
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
        }
    }

    /**
     * Handle error action button click
     * @param {Error} error - The error object
     * @param {string} context - The context where the error occurred
     */
    handleErrorAction(error, context) {
        switch (context) {
            case 'network':
                this.retryFailedRequest(error);
                break;
            case 'validation':
                this.focusFirstInvalidField(error);
                break;
            case 'api':
                this.retryAPIRequest(error);
                break;
            default:
                this.retryLastAction();
        }
    }

    initializeSession() {
        // Check for saved session
        this.checkSavedSession();
    }

    checkSavedSession() {
        const savedSession = this.sessionManager.loadSession();
        if (savedSession) {
            // Show resume dialog
            if (confirm('Would you like to continue where you left off?')) {
                this.restoreSession(savedSession);
                this.analytics.trackSessionResume({
                    age: this.sessionManager.getSessionAge(),
                    step: savedSession.currentStep
                });
            } else {
                this.sessionManager.clearSession();
            }
        }
    }

    restoreSession(session) {
        // Restore state
        if (session.selectedState) {
            this.stateManager.setSelectedState(session.selectedState);
        }

        // Restore preferences
        if (session.preferences) {
            this.stateManager.setPreferences(session.preferences);
        }

        // Restore step
        if (session.currentStep) {
            this.stateManager.setCurrentStep(session.currentStep);
        }

        // Update UI
        this.updateUI();
    }

    saveSession() {
        // Get preferences from StateManager instead of local Set
        const preferences = this.stateManager.getPreferences().selectedButtons;
        
        this.sessionManager.saveSession({
            currentStep: this.currentStep,
            state: this.state,
            preferences: preferences,
            additionalInfo: this.preferencesText.value
        });
    }

    init() {
        this.setupEventListeners();
        this.populateStates();
        this.checkForExistingSession();
        this.analytics.trackPageView('interview');
        
        // Add mobile-specific event listeners
        if (this.isMobile) {
            this.setupMobileEventListeners();
        }
    }

    setupEventListeners() {
        // State selection
        if (this.stateSelect) {
            this.stateSelect.addEventListener('change', this.handleStateChange);
        }
        
        // Navigation
        this.prevBtn.addEventListener('click', () => this.handleNavigation('prev'));
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupMobileEventListeners() {
        const container = document.querySelector('.interview-container');
        
        // Touch events for swipe navigation
        container.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        container.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        container.addEventListener('touchend', this.handleTouchEnd);
        
        // Prevent pull-to-refresh
        document.body.style.overscrollBehavior = 'none';
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            this.addHapticFeedback();
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.setupMobileEventListeners();
            } else {
                this.removeMobileEventListeners();
            }
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next step
                this.handleNavigation('next');
            } else {
                // Swipe right - go to previous step
                this.handleNavigation('prev');
            }
            
            // Provide haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
    }

    addHapticFeedback() {
        // Add haptic feedback to buttons
        this.nextBtn.addEventListener('click', () => {
            navigator.vibrate(50);
        });
    }

    handleStateChange(e) {
        this.state = e.target.value;
        this.stateError.textContent = '';
        
        // Track state selection
        this.analytics.trackEvent('state_selected', {
            state: this.state
        });
        
        // Save session
        this.saveSession();
    }

    handlePreferenceClick(e) {
        const btn = e.currentTarget;
        const preference = btn.dataset.preference;
        
        btn.classList.toggle('selected');
        
        if (btn.classList.contains('selected')) {
            this.preferences.add(preference);
            // Update the StateManager
            this.stateManager.addPreference(preference);
        } else {
            this.preferences.delete(preference);
            // Update the StateManager
            this.stateManager.removePreference(preference);
        }
        
        // Track preference selection
        this.analytics.trackEvent('preference_selected', {
            preference,
            selected: btn.classList.contains('selected')
        });
        
        // Save session
        this.saveSession();

        // Update UI state
        this.updateUI();
    }

    handleNavigation(direction) {
        const currentIndex = this.steps.indexOf(this.currentStep);
        let nextIndex;
        
        if (direction === 'next') {
            if (!this.validateCurrentStep()) return;
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1;
        }
        
        if (nextIndex >= 0 && nextIndex < this.steps.length) {
            this.showStep(this.steps[nextIndex]);
        }
        
        // Track navigation
        this.analytics.trackEvent('step_navigation', {
            from: this.currentStep,
            to: this.steps[nextIndex],
            direction
        });
    }

    validateCurrentStep() {
        let isValid = true;
        console.log('validateCurrentStep called, current step:', this.currentStep);
        switch (this.currentStep) {
            case 'preferences':
                isValid = this.validatePreferences();
                console.log('validatePreferences returned:', isValid);
                break;
            // No 'results' validation needed for now
        }
        return isValid;
    }

    validatePreferences() {
        const preferences = this.stateManager.getPreferences();
        console.log('Current preferences state:', preferences);
        console.log('Text input value:', this.preferencesText.value);
        let isValid = true;
        
        // Check if there are any preferences
        if (preferences.selectedButtons.length === 0 && preferences.freeFormText.trim().length === 0) {
            this.preferencesError.textContent = 'Please select at least one preference or enter your requirements';
            console.log('Validation failed: No preferences selected and no text entered');
            isValid = false;
        } else {
            this.preferencesError.textContent = '';
            console.log('Preferences validation passed');
        }
        
        // Validate text input length
        if (preferences.freeFormText.trim().length > 500) {
            this.textInputError.textContent = 'Additional preferences must be 500 characters or less';
            console.log('Validation failed: Text input too long');
            isValid = false;
        } else {
            this.textInputError.textContent = '';
        }
        
        return isValid;
    }

    async fetchRecommendations() {
        const selectedPreferences = Array.from(this.preferences);
        const freeFormText = this.preferencesText.value;

        // Track recommendation request
        this.analytics.trackEvent('recommendation_requested', {
            preferences: selectedPreferences,
            free_form_text: freeFormText
        });

        try {
            const recommendations = await this.geminiService.getRecommendations({
                preferences: selectedPreferences,
                freeFormText: freeFormText,
                // state: this.stateManager.getSelectedState() // State removed
            });
            this.displayResults(recommendations);
            // Track recommendation success
            this.analytics.trackEvent('recommendation_success', {
                num_recommendations: recommendations.length 
            });
        } catch (error) {
            this.handleError(error);
            
            // Track error
            this.analytics.trackEvent('recommendations_error', {
                error: error.message
            });
        }
    }

    displayResults(response) {
        const container = this.resultsContainer;
        container.innerHTML = '';
        
        if (!response.recommendations || response.recommendations.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No Plans Found</h3>
                    <p>We couldn't find any plans matching your preferences. Please try adjusting your selections.</p>
                </div>
            `;
            return;
        }
        
        const resultsList = document.createElement('div');
        resultsList.className = 'results-list';
        
        response.recommendations.forEach(plan => {
            const planElement = document.createElement('div');
            planElement.className = 'plan-card';
            planElement.innerHTML = `
                <h3>${plan.name}</h3>
                <p>${plan.description}</p>
                <div class="plan-details">
                    <span class="price">$${plan.price}/month</span>
                    <a href="${plan.applyUrl}" class="btn btn-primary" target="_blank">Apply Now</a>
                </div>
            `;
            resultsList.appendChild(planElement);
        });
        
        container.appendChild(resultsList);
    }

    checkForExistingSession() {
        const session = this.sessionManager.getSession();
        if (session) {
            const sessionAge = this.sessionManager.getSessionAge();
            if (sessionAge < 24 * 60 * 60 * 1000) { // 24 hours
                if (confirm('Would you like to continue where you left off?')) {
                    this.restoreSession(session);
                    
                    // Track session resume
                    this.analytics.trackEvent('session_resumed', {
                        sessionAge: Math.floor(sessionAge / 1000 / 60), // in minutes
                        currentStep: session.currentStep
                    });
                } else {
                    this.sessionManager.clearSession();
                }
            } else {
                this.sessionManager.clearSession();
            }
        }
    }

} 