/**
 * API Configuration
 */
const API_CONFIG = {
    // Gemini API Configuration
    GEMINI_API_KEY: 'AIzaSyBZpY3-IjZCgxF0a-nQ6Ovs4Pz6N6z1UM0',
    GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    GEMINI_MODEL: 'gemini-pro',
    
    // API Request Configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    TIMEOUT: 30000, // 30 seconds
    
    // Rate Limiting
    RATE_LIMIT: {
        MAX_REQUESTS_PER_MINUTE: 60,
        MAX_REQUESTS_PER_HOUR: 1000
    },
    
    // Cache Configuration
    CACHE: {
        ENABLED: true,
        DURATION: 3600000, // 1 hour
        MAX_ITEMS: 100
    },
    
    // Error Handling
    ERROR_MESSAGES: {
        API_KEY_MISSING: 'API key is not configured. Please add your Gemini API key to config/api-config.js',
        RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
        REQUEST_TIMEOUT: 'Request timed out. Please try again.',
        INVALID_RESPONSE: 'Invalid response from the API.',
        NETWORK_ERROR: 'Network error occurred. Please check your connection.'
    }
};

/**
 * Validate API configuration
 * @returns {boolean} Whether the configuration is valid
 */
function validateConfig() {
    if (!API_CONFIG.GEMINI_API_KEY) {
        console.error(API_CONFIG.ERROR_MESSAGES.API_KEY_MISSING);
        return false;
    }
    
    if (API_CONFIG.MAX_RETRIES < 1) {
        console.error('MAX_RETRIES must be at least 1');
        return false;
    }
    
    if (API_CONFIG.RETRY_DELAY < 0) {
        console.error('RETRY_DELAY must be non-negative');
        return false;
    }
    
    if (API_CONFIG.TIMEOUT < 0) {
        console.error('TIMEOUT must be non-negative');
        return false;
    }
    
    if (API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE < 1) {
        console.error('MAX_REQUESTS_PER_MINUTE must be at least 1');
        return false;
    }
    
    if (API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_HOUR < API_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
        console.error('MAX_REQUESTS_PER_HOUR must be greater than MAX_REQUESTS_PER_MINUTE');
        return false;
    }
    
    if (API_CONFIG.CACHE.DURATION < 0) {
        console.error('CACHE_DURATION must be non-negative');
        return false;
    }
    
    if (API_CONFIG.CACHE.MAX_ITEMS < 1) {
        console.error('CACHE_MAX_ITEMS must be at least 1');
        return false;
    }
    
    return true;
}

/**
 * Get API configuration
 * @returns {Object} API configuration
 */
function getConfig() {
    if (!validateConfig()) {
        throw new Error('Invalid API configuration');
    }
    return { ...API_CONFIG };
}

/**
 * Get API key
 * @returns {string} API key
 */
function getApiKey() {
    if (!API_CONFIG.GEMINI_API_KEY) {
        throw new Error(API_CONFIG.ERROR_MESSAGES.API_KEY_MISSING);
    }
    return API_CONFIG.GEMINI_API_KEY;
}

/**
 * Get API endpoint
 * @returns {string} API endpoint
 */
function getApiEndpoint() {
    return API_CONFIG.GEMINI_API_ENDPOINT;
}

/**
 * Get model name
 * @returns {string} Model name
 */
function getModel() {
    return API_CONFIG.GEMINI_MODEL;
}

/**
 * Get rate limit configuration
 * @returns {Object} Rate limit configuration
 */
function getRateLimitConfig() {
    return { ...API_CONFIG.RATE_LIMIT };
}

/**
 * Get cache configuration
 * @returns {Object} Cache configuration
 */
function getCacheConfig() {
    return { ...API_CONFIG.CACHE };
}

/**
 * Get error message
 * @param {string} key - Error message key
 * @returns {string} Error message
 */
function getErrorMessage(key) {
    return API_CONFIG.ERROR_MESSAGES[key] || 'An unknown error occurred';
}

// Export configuration and utility functions
export {
    API_CONFIG,
    validateConfig,
    getConfig,
    getApiKey,
    getApiEndpoint,
    getModel,
    getRateLimitConfig,
    getCacheConfig,
    getErrorMessage
}; 