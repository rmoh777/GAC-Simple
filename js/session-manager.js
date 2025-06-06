/**
 * SessionManager class for handling interview session persistence
 * Manages saving and restoring interview state using localStorage
 */
class SessionManager {
    constructor() {
        this.STORAGE_KEY = 'lifeline_interview_session';
        this.SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.currentSession = null;
        this.initialize();
    }

    /**
     * Initialize the session manager
     * Loads existing session if available and not expired
     */
    initialize() {
        try {
            const savedSession = localStorage.getItem(this.STORAGE_KEY);
            if (savedSession) {
                const session = JSON.parse(savedSession);
                if (!this.isSessionExpired(session)) {
                    this.currentSession = session;
                } else {
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Error initializing session:', error);
            this.clearSession();
        }
    }

    /**
     * Check if a session has expired
     * @param {Object} session - The session to check
     * @returns {boolean} - True if session is expired
     */
    isSessionExpired(session) {
        return Date.now() - session.timestamp > this.SESSION_EXPIRY;
    }

    /**
     * Save the current interview state
     * @param {Object} state - The current interview state
     * @param {string} state.currentStep - Current step in the interview
     * @param {Object} state.preferences - User preferences
     * @param {string} state.selectedState - Selected state
     * @returns {boolean} - Success status
     */
    saveSession(state) {
        try {
            const session = {
                ...state,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
            this.currentSession = session;
            return true;
        } catch (error) {
            console.error('Error saving session:', error);
            return false;
        }
    }

    /**
     * Load the saved session
     * @returns {Object|null} - The saved session or null if none exists
     */
    loadSession() {
        try {
            if (this.currentSession && !this.isSessionExpired(this.currentSession)) {
                return this.currentSession;
            }
            return null;
        } catch (error) {
            console.error('Error loading session:', error);
            return null;
        }
    }

    /**
     * Clear the current session
     */
    clearSession() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.currentSession = null;
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    /**
     * Check if there is a valid saved session
     * @returns {boolean} - True if a valid session exists
     */
    hasValidSession() {
        return this.currentSession !== null && !this.isSessionExpired(this.currentSession);
    }

    /**
     * Get session age in minutes
     * @returns {number} - Minutes since session was created
     */
    getSessionAge() {
        if (!this.currentSession) return 0;
        return Math.floor((Date.now() - this.currentSession.timestamp) / (60 * 1000));
    }

    /**
     * Get time until session expiry in minutes
     * @returns {number} - Minutes until session expires
     */
    getTimeUntilExpiry() {
        if (!this.currentSession) return 0;
        const timeLeft = this.SESSION_EXPIRY - (Date.now() - this.currentSession.timestamp);
        return Math.floor(timeLeft / (60 * 1000));
    }
} 