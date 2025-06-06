/**
 * Analytics class for tracking user interactions and events
 */
class Analytics {
    constructor() {
        this.events = [];
        this.startTime = Date.now();
        this.sessionId = this.generateSessionId();
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
    }

    /**
     * Track a generic event
     * @param {string} name - Event name
     * @param {Object} data - Additional event data
     */
    trackEvent(name, data = {}) {
        const event = {
            name,
            timestamp: Date.now(),
            data,
            sessionId: this.sessionId
        };

        this.events.push(event);
        this.logEvent(event);
    }

    /**
     * Track step completion
     * @param {number} step - Step number
     * @param {number} timeSpent - Time spent on step in milliseconds
     */
    trackStepCompletion(step, timeSpent = null) {
        this.trackEvent('step_completed', {
            step,
            timeSpent: timeSpent || this.calculateStepTime(step)
        });
    }

    /**
     * Track preference selection
     * @param {string} preference - Selected preference
     * @param {boolean} isSelected - Whether preference was selected or deselected
     */
    trackPreferenceSelection(preference, isSelected) {
        this.trackEvent('preference_selection', {
            preference,
            action: isSelected ? 'selected' : 'deselected'
        });
    }

    /**
     * Track results view
     * @param {Object} data - Results data
     */
    trackResultsView(data = null) {
        this.trackEvent('results_viewed', {
            totalTime: this.getTotalTime(),
            recommendationsCount: data?.recommendations?.length || 0
        });
    }

    /**
     * Track plan selection
     * @param {string} provider - Provider name
     * @param {string} plan - Plan name
     */
    trackPlanSelection(provider, plan) {
        this.trackEvent('plan_selected', {
            provider,
            plan,
            timeToSelection: Date.now() - this.startTime
        });
    }

    /**
     * Track error
     * @param {Error} error - Error object
     * @param {string} context - Error context
     */
    trackError(error, context = '') {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: Date.now()
        });
    }

    /**
     * Track user interaction
     * @param {string} type - Interaction type
     * @param {Object} data - Interaction data
     */
    trackInteraction(type, data = {}) {
        this.trackEvent('user_interaction', {
            type,
            ...data,
            timestamp: Date.now()
        });
    }

    /**
     * Track form submission
     * @param {string} formId - Form identifier
     * @param {boolean} success - Whether submission was successful
     * @param {Object} data - Form data
     */
    trackFormSubmission(formId, success, data = {}) {
        this.trackEvent('form_submission', {
            formId,
            success,
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Track page view
     * @param {string} page - Page identifier
     * @param {Object} data - Additional page data
     */
    trackPageView(page, data = {}) {
        this.trackEvent('page_view', {
            page,
            ...data,
            timestamp: Date.now()
        });
    }

    /**
     * Log event to console in development mode
     * @param {Object} event - Event to log
     */
    logEvent(event) {
        if (this.isDevelopment) {
            console.log('Analytics Event:', {
                ...event,
                timeFromStart: event.timestamp - this.startTime
            });
        }
    }

    /**
     * Get all tracked events
     * @returns {Array} Array of events
     */
    getEvents() {
        return [...this.events];
    }

    /**
     * Get total time spent
     * @returns {number} Total time in milliseconds
     */
    getTotalTime() {
        return Date.now() - this.startTime;
    }

    /**
     * Calculate time spent on a step
     * @param {number} step - Step number
     * @returns {number} Time spent in milliseconds
     */
    calculateStepTime(step) {
        const stepEvents = this.events.filter(event => 
            event.name === 'step_completed' && 
            event.data.step === step
        );

        if (stepEvents.length > 0) {
            const lastEvent = stepEvents[stepEvents.length - 1];
            return lastEvent.timestamp - this.startTime;
        }

        return 0;
    }

    /**
     * Generate a unique session ID
     * @returns {string} Session ID
     */
    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get analytics summary
     * @returns {Object} Analytics summary
     */
    getSummary() {
        return {
            sessionId: this.sessionId,
            startTime: this.startTime,
            totalTime: this.getTotalTime(),
            eventCount: this.events.length,
            eventsByType: this.getEventsByType(),
            stepTimes: this.getStepTimes(),
            errorCount: this.getErrorCount()
        };
    }

    /**
     * Get events grouped by type
     * @returns {Object} Events by type
     */
    getEventsByType() {
        return this.events.reduce((acc, event) => {
            acc[event.name] = (acc[event.name] || 0) + 1;
            return acc;
        }, {});
    }

    /**
     * Get time spent on each step
     * @returns {Object} Step times
     */
    getStepTimes() {
        const stepTimes = {};
        this.events
            .filter(event => event.name === 'step_completed')
            .forEach(event => {
                stepTimes[event.data.step] = event.data.timeSpent;
            });
        return stepTimes;
    }

    /**
     * Get error count
     * @returns {number} Number of errors
     */
    getErrorCount() {
        return this.events.filter(event => event.name === 'error').length;
    }
}

// Create global analytics instance
window.analytics = new Analytics(); 