/**
 * ResultsRenderer class for displaying plan comparisons
 */
class ResultsRenderer {
    constructor() {
        this.container = document.getElementById('resultsContainer');
        this.analytics = new Analytics();
    }

    /**
     * Render the plan comparison
     * @param {Object} data - Recommendations data
     */
    renderComparison(data) {
        try {
            // Clear existing content
            this.container.innerHTML = '';
            
            // Sort recommendations by match score
            const sortedRecommendations = [...data.recommendations].sort((a, b) => b.matchScore - a.matchScore);
            
            // Create comparison grid
            const grid = document.createElement('div');
            grid.className = 'comparison-grid';
            
            // Add each plan card
            sortedRecommendations.forEach((plan, index) => {
                const card = this.createPlanCard(plan, index + 1);
                grid.appendChild(card);
            });
            
            // Add explanation section
            const explanation = this.createExplanation(data.explanation);
            
            // Add to container
            this.container.appendChild(grid);
            this.container.appendChild(explanation);
            
            // Track results view
            this.analytics.trackResultsView();
        } catch (error) {
            console.error('Error rendering comparison:', error);
            this.showError('Failed to display results. Please try again.');
        }
    }

    /**
     * Create a plan card
     * @param {Object} plan - Plan data
     * @param {number} rank - Plan rank
     * @returns {HTMLElement} Plan card element
     */
    createPlanCard(plan, rank) {
        const card = document.createElement('div');
        card.className = 'plan-card';
        
        // Add rank badge
        const rankBadge = document.createElement('div');
        rankBadge.className = 'rank-badge';
        rankBadge.textContent = `#${rank}`;
        card.appendChild(rankBadge);
        
        // Add provider info
        const providerInfo = document.createElement('div');
        providerInfo.className = 'provider-info';
        providerInfo.innerHTML = `
            <h3 class="provider-name">${plan.provider}</h3>
            <h4 class="plan-name">${plan.plan}</h4>
        `;
        card.appendChild(providerInfo);
        
        // Add match score
        const matchScore = document.createElement('div');
        matchScore.className = 'match-score';
        matchScore.innerHTML = `
            <div class="score">${Math.round(plan.matchScore * 100)}%</div>
            <div class="label">Match</div>
        `;
        card.appendChild(matchScore);
        
        // Add pricing
        const pricing = document.createElement('div');
        pricing.className = 'pricing';
        pricing.innerHTML = `
            <div class="monthly-price">$${plan.monthlyPrice}/mo</div>
            ${plan.setupFee > 0 ? `<div class="setup-fee">Setup: $${plan.setupFee}</div>` : ''}
        `;
        card.appendChild(pricing);
        
        // Add features
        const features = this.createFeatureList(plan);
        card.appendChild(features);
        
        // Add reasoning
        const reasoning = document.createElement('div');
        reasoning.className = 'reasoning';
        reasoning.textContent = plan.reasoning;
        card.appendChild(reasoning);
        
        // Add actions
        const actions = this.createActionButtons(plan);
        card.appendChild(actions);
        
        return card;
    }

    /**
     * Create feature list
     * @param {Object} plan - Plan data
     * @returns {HTMLElement} Feature list element
     */
    createFeatureList(plan) {
        const features = document.createElement('div');
        features.className = 'plan-features';
        
        // Add key features
        const keyFeatures = document.createElement('div');
        keyFeatures.className = 'key-features';
        plan.keyFeatures.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${feature}</span>
            `;
            keyFeatures.appendChild(featureItem);
        });
        features.appendChild(keyFeatures);
        
        // Add plan details
        const details = document.createElement('div');
        details.className = 'plan-details';
        details.innerHTML = `
            <div class="detail-item">
                <i class="fas fa-database"></i>
                <span>${plan.dataAllowance}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>${plan.voiceMinutes}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-comment"></i>
                <span>${plan.textMessages}</span>
            </div>
        `;
        features.appendChild(details);
        
        return features;
    }

    /**
     * Create action buttons
     * @param {Object} plan - Plan data
     * @returns {HTMLElement} Action buttons container
     */
    createActionButtons(plan) {
        const actions = document.createElement('div');
        actions.className = 'plan-actions';
        
        // Sign up button
        const signUpBtn = document.createElement('a');
        signUpBtn.href = plan.signupUrl;
        signUpBtn.className = 'btn btn-primary';
        signUpBtn.textContent = 'Sign Up';
        signUpBtn.target = '_blank';
        signUpBtn.addEventListener('click', () => {
            this.analytics.trackPlanSelection(plan.provider, plan.plan);
        });
        actions.appendChild(signUpBtn);
        
        // Check eligibility button
        const eligibilityBtn = document.createElement('a');
        eligibilityBtn.href = plan.eligibilityUrl;
        eligibilityBtn.className = 'btn btn-secondary';
        eligibilityBtn.textContent = 'Check Eligibility';
        eligibilityBtn.target = '_blank';
        actions.appendChild(eligibilityBtn);
        
        return actions;
    }

    /**
     * Create explanation section
     * @param {string} explanation - Overall explanation
     * @returns {HTMLElement} Explanation element
     */
    createExplanation(explanation) {
        const section = document.createElement('div');
        section.className = 'explanation-section';
        
        const heading = document.createElement('h3');
        heading.textContent = 'Why These Plans?';
        section.appendChild(heading);
        
        const content = document.createElement('div');
        content.className = 'explanation-content';
        content.textContent = explanation;
        section.appendChild(content);
        
        return section;
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        
        this.container.innerHTML = '';
        this.container.appendChild(error);
    }

    /**
     * Highlight key features based on user priorities
     * @param {HTMLElement} card - Plan card element
     * @param {Array<string>} priorities - User priorities
     */
    highlightKeyFeatures(card, priorities) {
        const features = card.querySelectorAll('.feature-item');
        features.forEach(feature => {
            const text = feature.textContent.toLowerCase();
            if (priorities.some(priority => text.includes(priority.toLowerCase()))) {
                feature.classList.add('highlighted');
            }
        });
    }
} 