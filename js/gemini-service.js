/**
 * GeminiService class for handling API interactions with Gemini
 */
class GeminiService {
    constructor() {
        this.apiKey = API_CONFIG.GEMINI_API_KEY;
        this.apiEndpoint = API_CONFIG.GEMINI_API_ENDPOINT;
        this.model = API_CONFIG.GEMINI_MODEL;
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Get plan recommendations based on user preferences
     * @param {string} state - Two-letter state code
     * @param {Object} preferences - User preferences
     * @returns {Promise<Object>} Recommendations object
     */
    async getRecommendations(state, preferences) {
        try {
            const prompt = this.buildPrompt(state, preferences);
            const response = await this.makeApiRequest(prompt);
            return this.parseResponse(response);
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw new Error('Failed to get recommendations. Please try again.');
        }
    }

    /**
     * Build the prompt for Gemini
     * @param {string} state - Two-letter state code
     * @param {Object} preferences - User preferences
     * @returns {string} Formatted prompt
     */
    buildPrompt(state, preferences) {
        const selectedPreferences = preferences.selectedButtons.join(', ');
        const freeFormText = preferences.freeFormText;
        
        return `As a Lifeline plan expert, analyze the following user preferences and recommend the top 3 most suitable Lifeline plans in ${state}:

User Preferences:
- Selected priorities: ${selectedPreferences}
- Additional preferences: ${freeFormText}

Please provide recommendations in the following JSON format:
{
    "recommendations": [
        {
            "provider": "Provider name",
            "plan": "Plan name",
            "matchScore": 0.95,
            "reasoning": "Detailed explanation of why this plan matches the user's preferences",
            "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
            "monthlyPrice": 0,
            "dataAllowance": "Unlimited",
            "voiceMinutes": "Unlimited",
            "textMessages": "Unlimited",
            "setupFee": 0,
            "signupUrl": "https://provider.com/signup",
            "eligibilityUrl": "https://provider.com/eligibility"
        }
    ],
    "explanation": "Overall explanation of the recommendations"
}

Focus on matching the user's priorities and preferences while considering:
1. Plan availability in ${state}
2. User's selected priorities
3. Additional preferences mentioned
4. Value for money
5. Customer support quality
6. Network coverage in ${state}`;
    }

    /**
     * Make API request to Gemini
     * @param {string} prompt - The prompt to send
     * @returns {Promise<Object>} API response
     */
    async makeApiRequest(prompt) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        prompt: prompt,
                        max_tokens: 1000,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed:`, error);
                
                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        throw lastError;
    }

    /**
     * Parse the API response
     * @param {Object} response - API response
     * @returns {Object} Parsed recommendations
     */
    parseResponse(response) {
        try {
            // Extract the JSON string from the response
            const jsonStr = response.choices[0].text.trim();
            const data = JSON.parse(jsonStr);
            
            // Validate the response structure
            if (!this.validateResponse(data)) {
                throw new Error('Invalid response structure');
            }
            
            return data;
        } catch (error) {
            console.error('Error parsing response:', error);
            throw new Error('Failed to parse recommendations');
        }
    }

    /**
     * Validate the response structure
     * @param {Object} data - Response data to validate
     * @returns {boolean} Whether the response is valid
     */
    validateResponse(data) {
        return data &&
               Array.isArray(data.recommendations) &&
               data.recommendations.length === 3 &&
               typeof data.explanation === 'string' &&
               data.recommendations.every(rec => 
                   rec.provider &&
                   rec.plan &&
                   typeof rec.matchScore === 'number' &&
                   rec.matchScore >= 0 &&
                   rec.matchScore <= 1 &&
                   rec.reasoning &&
                   Array.isArray(rec.keyFeatures) &&
                   typeof rec.monthlyPrice === 'number' &&
                   rec.dataAllowance &&
                   rec.voiceMinutes &&
                   rec.textMessages &&
                   typeof rec.setupFee === 'number' &&
                   rec.signupUrl &&
                   rec.eligibilityUrl
               );
    }

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
} 