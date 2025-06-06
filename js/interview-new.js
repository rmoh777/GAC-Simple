// Interview New Controller
class InterviewController {
    constructor() {
        this.form = document.getElementById('planForm');
        this.requirementsInput = document.getElementById('requirements');
        this.charCount = document.getElementById('charCount');
        this.loading = document.querySelector('.loading');
        this.errorMessage = document.getElementById('errorMessage');
        this.results = document.getElementById('results');
        this.findPlansBtn = document.getElementById('findPlansBtn');
        this.startOverBtn = document.getElementById('startOverBtn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Character counter
        this.requirementsInput.addEventListener('input', () => {
            this.charCount.textContent = this.requirementsInput.value.length;
        });

        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Start Over button
        this.startOverBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        // Validate input
        const requirements = this.requirementsInput.value.trim();
        if (requirements.length < 20) {
            this.showError('Please provide more details about your requirements (minimum 20 characters)');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            const data = await this.getRecommendations(requirements);
            this.renderResults(data);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async getRecommendations(userInput) {
        const prompt = this.buildPrompt(userInput);

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    temperature: 0.2,
                    maxOutputTokens: 100
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get recommendations');
            }

            const data = await response.json();
            if (!data.text) {
                throw new Error('Invalid response format from Gemini API');
            }

            // Parse the response text to extract plan IDs and ranks
            const planMatches = this.parsePlanMatches(data.text);
            if (!planMatches || planMatches.length !== 3) {
                throw new Error('Invalid plan recommendations received');
            }

            const recommendedPlans = this.getRecommendedPlans(planMatches);
            
            // Get explanations for the recommended plans
            const explanations = await this.getPlanExplanations(userInput, recommendedPlans);
            
            return {
                plans: recommendedPlans,
                explanations: explanations
            };
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Error getting recommendations: ' + error.message);
        }
    }

    buildPrompt(userInput) {
        const prompt = `You are a mobile plan expert helping someone who might not be familiar with technical terms. 
Based on this request: "${userInput}", 
recommend exactly 3 plan IDs from this list that best match the user's needs. 
Rank them as "Best", "Great", and "Good". 
Return ONLY the 3 plan IDs as comma-separated numbers with their rank (example: "1:Best,7:Great,12:Good"). 
Plans: ${JSON.stringify(window.MOBILE_PLANS)}`;

        return prompt;
    }

    parsePlanMatches(text) {
        try {
            // Clean up the text and extract the plan matches
            const cleanText = text.trim();
            const matches = cleanText.split(',').map(item => {
                const [id, rank] = item.split(':').map(part => part.trim());
                if (!id || !rank) {
                    throw new Error('Invalid plan match format');
                }
                return {
                    id: parseInt(id),
                    rank: rank
                };
            });

            // Validate the matches
            if (matches.length !== 3) {
                throw new Error('Expected exactly 3 plan matches');
            }

            if (matches.some(match => isNaN(match.id) || !match.rank)) {
                throw new Error('Invalid plan ID or rank format');
            }

            return matches;
        } catch (error) {
            console.error('Error parsing plan matches:', error);
            throw new Error('Failed to parse plan recommendations');
        }
    }

    getRecommendedPlans(planMatches) {
        if (planMatches.length !== 3 || planMatches.some(match => isNaN(match.id))) {
            throw new Error('Invalid plan recommendations received');
        }

        return planMatches.map(match => ({
            ...window.MOBILE_PLANS.find(plan => plan.id === match.id),
            rank: match.rank
        }));
    }

    async getPlanExplanations(userInput, plans) {
        const prompt = `You are a friendly mobile plan expert explaining things to someone who might not be familiar with technical terms. 
Use simple, everyday language that a high school student would understand. 
For each of these plans, provide:
1. A brief explanation (1-2 sentences) of why this plan matches the user's needs
2. A short summary of why these 3 plans were selected overall

User's request: "${userInput}"

Plans:
${plans.map(plan => `
Plan ${plan.id} (${plan.rank}):
- Name: ${plan.name}
- Carrier: ${plan.carrier}
- Price: $${plan.price}/mo
- Data: ${plan.data}
- Features: ${plan.features.join(', ')}
- Hotspot: ${plan.hotspot}
`).join('\n')}

Format your response exactly like this:
PLAN_EXPLANATIONS:
${plans.map(plan => `Plan ${plan.id}: [Your explanation here]`).join('\n')}

OVERALL_SUMMARY:
[Your summary here]`;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    temperature: 0.7,
                    maxOutputTokens: 500
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get plan explanations');
            }

            const data = await response.json();
            return this.parseExplanations(data.text);
        } catch (error) {
            console.error('Error getting explanations:', error);
            return {
                planExplanations: {},
                summary: 'Unable to generate explanations at this time.'
            };
        }
    }

    parseExplanations(text) {
        const planExplanations = {};
        const planMatches = text.match(/Plan (\d+): (.*?)(?=\nPlan \d+:|$)/gs);
        
        if (planMatches) {
            planMatches.forEach(match => {
                const [_, planId, explanation] = match.match(/Plan (\d+): (.*)/);
                planExplanations[planId] = explanation.trim();
            });
        }

        const summaryMatch = text.match(/OVERALL_SUMMARY:\n(.*)/s);
        const summary = summaryMatch ? summaryMatch[1].trim() : '';

        return {
            planExplanations,
            summary
        };
    }

    renderResults(data) {
        const { plans, explanations } = data;
        
        // Add summary section
        const summaryHtml = `
            <div class="summary">
                <h3>Why These Plans?</h3>
                <p>${explanations.summary}</p>
            </div>
        `;

        // Add plan cards with explanations
        const plansHtml = `
            <div class="plans-row">
                ${plans.map(plan => `
                    <div class="plan-card">
                        <div class="plan-header">
                            <div class="rank-badge rank-${plan.rank.toLowerCase()}">${plan.rank}</div>
                            <div class="carrier">${plan.carrier}</div>
                            <div class="plan-name">${plan.name}</div>
                            <div class="price">$${plan.price}<span style="font-size:0.9rem;font-weight:400;">/mo</span></div>
                        </div>
                        <ul class="features">
                            <li>${plan.data} Data</li>
                            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                            <li>Hotspot: ${plan.hotspot}</li>
                        </ul>
                        <div class="plan-explanation">
                            ${explanations.planExplanations[plan.id] || 'No explanation available.'}
                        </div>
                        <button class="plan-details-btn" tabindex="0">Full Plan Details</button>
                    </div>
                `).join('')}
            </div>
        `;

        this.results.innerHTML = summaryHtml + plansHtml;
        this.results.style.display = 'flex';
        
        // Hide Find My Plans, show Start Over
        this.findPlansBtn.style.display = 'none';
        this.startOverBtn.style.display = 'inline-block';
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.form.style.display = 'none';
        this.errorMessage.style.display = 'none';
        this.results.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.form.style.display = 'block';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }
}

// Initialize the controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InterviewController();
}); 