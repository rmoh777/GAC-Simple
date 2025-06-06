/**
 * Lifeline Provider Data Structure
 */
const LIFELINE_PROVIDERS = {
    assurance: {
        id: 'assurance',
        name: 'Assurance Wireless',
        website: 'https://www.assurancewireless.com',
        logo: 'images/providers/assurance.png',
        states: ['AL', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
        customerSupport: {
            rating: 4.2,
            hours: '24/7',
            phone: '1-888-321-5880',
            email: 'support@assurancewireless.com',
            chat: true
        },
        plans: [
            {
                id: 'assurance-basic',
                name: 'Basic Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free Android Smartphone',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free International Calling to 70+ Countries',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling'
                ],
                signupUrl: 'https://www.assurancewireless.com/apply',
                eligibilityUrl: 'https://www.assurancewireless.com/eligibility'
            },
            {
                id: 'assurance-plus',
                name: 'Plus Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free iPhone SE',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free International Calling to 70+ Countries',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling',
                    'Mobile Hotspot',
                    '5G Access'
                ],
                signupUrl: 'https://www.assurancewireless.com/apply',
                eligibilityUrl: 'https://www.assurancewireless.com/eligibility'
            }
        ]
    },
    safelink: {
        id: 'safelink',
        name: 'SafeLink Wireless',
        website: 'https://www.safelinkwireless.com',
        logo: 'images/providers/safelink.png',
        states: ['AL', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
        customerSupport: {
            rating: 4.0,
            hours: '24/7',
            phone: '1-800-723-3546',
            email: 'support@safelinkwireless.com',
            chat: true
        },
        plans: [
            {
                id: 'safelink-basic',
                name: 'Basic Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free Android Smartphone',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling',
                    'Nationwide Coverage'
                ],
                signupUrl: 'https://www.safelinkwireless.com/apply',
                eligibilityUrl: 'https://www.safelinkwireless.com/eligibility'
            },
            {
                id: 'safelink-premium',
                name: 'Premium Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free iPhone SE',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling',
                    'Nationwide Coverage',
                    'Mobile Hotspot',
                    '5G Access',
                    'International Calling'
                ],
                signupUrl: 'https://www.safelinkwireless.com/apply',
                eligibilityUrl: 'https://www.safelinkwireless.com/eligibility'
            }
        ]
    },
    qlink: {
        id: 'qlink',
        name: 'Q Link Wireless',
        website: 'https://www.qlinkwireless.com',
        logo: 'images/providers/qlink.png',
        states: ['AL', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
        customerSupport: {
            rating: 4.1,
            hours: '24/7',
            phone: '1-855-754-6543',
            email: 'support@qlinkwireless.com',
            chat: true
        },
        plans: [
            {
                id: 'qlink-basic',
                name: 'Basic Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free Android Smartphone',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling',
                    'Nationwide Coverage'
                ],
                signupUrl: 'https://www.qlinkwireless.com/apply',
                eligibilityUrl: 'https://www.qlinkwireless.com/eligibility'
            },
            {
                id: 'qlink-premium',
                name: 'Premium Plan',
                monthlyPrice: 0,
                setupFee: 0,
                dataAllowance: 'Unlimited',
                voiceMinutes: 'Unlimited',
                textMessages: 'Unlimited',
                features: [
                    'Free iPhone SE',
                    'Unlimited Data',
                    'Unlimited Talk & Text',
                    'Free Voicemail',
                    'Caller ID',
                    'Call Waiting',
                    'Three-Way Calling',
                    'Nationwide Coverage',
                    'Mobile Hotspot',
                    '5G Access',
                    'International Calling'
                ],
                signupUrl: 'https://www.qlinkwireless.com/apply',
                eligibilityUrl: 'https://www.qlinkwireless.com/eligibility'
            }
        ]
    }
};

/**
 * Get all providers available in a state
 * @param {string} state - Two-letter state code
 * @returns {Array} Array of providers
 */
function getProvidersByState(state) {
    if (!state || typeof state !== 'string' || state.length !== 2) {
        throw new Error('Invalid state code');
    }
    
    return Object.values(LIFELINE_PROVIDERS).filter(provider => 
        provider.states.includes(state.toUpperCase())
    );
}

/**
 * Get a specific provider by ID
 * @param {string} providerId - Provider ID
 * @returns {Object} Provider data
 */
function getProviderById(providerId) {
    if (!providerId || typeof providerId !== 'string') {
        throw new Error('Invalid provider ID');
    }
    
    const provider = LIFELINE_PROVIDERS[providerId.toLowerCase()];
    if (!provider) {
        throw new Error('Provider not found');
    }
    
    return { ...provider };
}

/**
 * Get a specific plan by provider and plan IDs
 * @param {string} providerId - Provider ID
 * @param {string} planId - Plan ID
 * @returns {Object} Plan data
 */
function getPlanById(providerId, planId) {
    if (!providerId || !planId) {
        throw new Error('Provider ID and Plan ID are required');
    }
    
    const provider = getProviderById(providerId);
    const plan = provider.plans.find(p => p.id === planId);
    
    if (!plan) {
        throw new Error('Plan not found');
    }
    
    return { ...plan };
}

/**
 * Get all states where Lifeline service is available
 * @returns {Array} Array of state codes
 */
function getAvailableStates() {
    const states = new Set();
    Object.values(LIFELINE_PROVIDERS).forEach(provider => {
        provider.states.forEach(state => states.add(state));
    });
    return Array.from(states).sort();
}

/**
 * Get all plans from all providers
 * @returns {Array} Array of all plans
 */
function getAllPlans() {
    return Object.values(LIFELINE_PROVIDERS).flatMap(provider => 
        provider.plans.map(plan => ({
            ...plan,
            provider: provider.name,
            providerId: provider.id
        }))
    );
}

/**
 * Get plans by feature
 * @param {string} feature - Feature to search for
 * @returns {Array} Array of plans with the feature
 */
function getPlansByFeature(feature) {
    if (!feature) {
        throw new Error('Feature is required');
    }
    
    return getAllPlans().filter(plan => 
        plan.features.some(f => 
            f.toLowerCase().includes(feature.toLowerCase())
        )
    );
}

/**
 * Get plans by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Array of plans within price range
 */
function getPlansByPriceRange(minPrice, maxPrice) {
    if (typeof minPrice !== 'number' || typeof maxPrice !== 'number') {
        throw new Error('Invalid price range');
    }
    
    return getAllPlans().filter(plan => 
        plan.monthlyPrice >= minPrice && 
        plan.monthlyPrice <= maxPrice
    );
}

// Export provider data and utility functions
export {
    LIFELINE_PROVIDERS,
    getProvidersByState,
    getProviderById,
    getPlanById,
    getAvailableStates,
    getAllPlans,
    getPlansByFeature,
    getPlansByPriceRange
}; 