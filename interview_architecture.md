# Lifeline Interview Feature - Phase 1 Architecture

## Project Overview
A multi-step interview system for Georgia Connects that helps users find the best Lifeline mobile internet plans based on their state, preferences, and priorities. Uses Google Gemini Flash 1.5 for intelligent plan recommendations.

## File Structure

```
gaconnects-website/
├── interview.html                  # Main interview page
├── interview-results.html          # Results display page (optional fallback)
├── css/
│   ├── variables.css              # Existing design tokens
│   ├── components.css             # Existing components
│   ├── interview.css              # Interview-specific styles
│   └── results.css                # Results comparison styles
├── js/
│   ├── main.js                    # Existing functionality
│   ├── lifeline-providers.js      # Provider master data file
│   ├── interview-controller.js    # Main interview orchestration
│   ├── gemini-service.js          # Gemini API integration
│   ├── state-manager.js           # Interview state management
│   ├── results-renderer.js        # Results display logic
│   └── analytics.js               # Basic analytics tracking
├── data/
│   └── providers.json             # Fallback provider data
└── config/
    └── api-config.js              # API configuration
```

## Component Architecture

### 1. Interview Controller (`js/interview-controller.js`)
**Purpose**: Main orchestrator for the entire interview flow
**Responsibilities**:
- Initialize interview steps
- Handle step navigation (next/previous/restart)
- Coordinate between UI components and services
- Manage loading states and error handling

**Key Methods**:
```javascript
class InterviewController {
  init()                    // Initialize interview
  nextStep()               // Progress to next step
  previousStep()           // Go back to previous step
  restart()                // Reset interview to beginning
  handleStateSelection()   // Process state choice
  handlePreferences()      // Process user preferences
  processRecommendations() // Get and display results
}
```

### 2. State Manager (`js/state-manager.js`)
**Purpose**: Centralized state management for interview data
**Responsibilities**:
- Store current interview step
- Track user selections (state, preferences, button clicks)
- Provide state validation
- Handle state persistence (sessionStorage)

**State Structure**:
```javascript
const interviewState = {
  currentStep: 1,           // 1: state, 2: preferences, 3: results
  selectedState: null,      // Two-letter state code
  preferences: {
    freeFormText: '',       // User's written preferences
    selectedButtons: [],    // Array of selected preference buttons
    priorities: {}          // Weighted priorities derived from input
  },
  results: {
    recommendations: [],    // LLM recommendations
    reasoning: '',         // LLM explanation
    timestamp: null        // When results were generated
  },
  analytics: {
    startTime: null,
    stepTimes: [],
    completionTime: null
  }
}
```

### 3. Gemini Service (`js/gemini-service.js`)
**Purpose**: Handle all Gemini Flash 1.5 API interactions
**Responsibilities**:
- Format prompts for Gemini
- Make API calls with proper error handling
- Parse and validate JSON responses
- Handle rate limiting and retries

**Key Methods**:
```javascript
class GeminiService {
  async getRecommendations(state, preferences, providers)
  buildPrompt(state, preferences, providers)
  parseResponse(response)
  handleRateLimit()
  validateResponse(response)
}
```

**Prompt Structure**:
```
You are a Lifeline program expert helping users find the best mobile plans.

USER PROFILE:
- State: [STATE]
- Preferences: [FREE_FORM_TEXT]
- Priority Focus: [SELECTED_BUTTONS]

AVAILABLE PROVIDERS:
[FILTERED_PROVIDER_DATA]

Return JSON with exactly 3 recommendations:
{
  "recommendations": [
    {
      "providerId": "string",
      "planId": "string", 
      "matchScore": number,
      "reasoning": "string"
    }
  ],
  "explanation": "string"
}
```

### 4. Results Renderer (`js/results-renderer.js`)
**Purpose**: Generate and display plan comparison results
**Responsibilities**:
- Render shopping-style comparison cards
- Handle plan details display
- Manage CTA button interactions
- Generate "start over" functionality

**Rendering Pattern**:
```javascript
class ResultsRenderer {
  renderComparison(recommendations)
  createPlanCard(provider, plan, reasoning)
  highlightKeyFeatures(plan, userPriorities)
  generateComparisonTable()
  handlePlanSelection(planId)
}
```

### 5. Provider Data Management (`js/lifeline-providers.js`)
**Purpose**: Manage provider data and filtering
**Responsibilities**:
- Load provider master data
- Filter providers by state
- Provide plan lookup functionality
- Handle data validation

**Data Structure**:
```javascript
const LIFELINE_PROVIDERS = {
  "assurance-wireless": {
    name: "Assurance Wireless",
    website: "https://www.assurancewireless.com",
    logo: "/images/providers/assurance.png",
    states: ["AL", "AR", "AZ", ...],
    customerSupport: {
      rating: 4.2,
      hours: "24/7",
      methods: ["phone", "chat", "email"]
    },
    plans: [
      {
        id: "basic-plan",
        name: "Basic Lifeline Plan",
        monthlyPrice: 0,
        setupFee: 0,
        dataAllowance: "3GB",
        voiceMinutes: "Unlimited",
        textMessages: "Unlimited",
        features: ["Mobile Hotspot", "Caller ID"],
        signupUrl: "https://...",
        eligibilityUrl: "https://..."
      }
    ]
  }
}
```

## Page Structure

### Interview Page (`interview.html`)
**Layout**:
```html
<main class="interview-container">
  <!-- Progress Indicator -->
  <div class="interview-progress">
    <div class="progress-step active">State</div>
    <div class="progress-step">Preferences</div>
    <div class="progress-step">Results</div>
  </div>

  <!-- Step 1: State Selection -->
  <section id="step-state" class="interview-step active">
    <h2>What state are you in?</h2>
    <select id="stateSelect" class="state-selector">
      <!-- All 50 states + DC -->
    </select>
  </section>

  <!-- Step 2: Preferences -->
  <section id="step-preferences" class="interview-step">
    <h2>What's most important to you?</h2>
    
    <!-- Quick Buttons -->
    <div class="preference-buttons">
      <button class="btn preference-btn" data-preference="price">Lowest Price</button>
      <button class="btn preference-btn" data-preference="data">Most Data</button>
      <button class="btn preference-btn" data-preference="support">Best Support</button>
      <button class="btn preference-btn" data-preference="network">Network Quality</button>
      <button class="btn preference-btn" data-preference="features">Extra Features</button>
    </div>

    <!-- OR Text Input -->
    <div class="preference-text">
      <label for="customPreferences">Or describe what you're looking for:</label>
      <textarea id="customPreferences" placeholder="I need a plan with..."></textarea>
    </div>
  </section>

  <!-- Step 3: Results -->
  <section id="step-results" class="interview-step">
    <div id="resultsContainer">
      <!-- Dynamically populated results -->
    </div>
    <button id="restartBtn" class="btn btn--secondary">Start Over</button>
  </section>

  <!-- Navigation -->
  <div class="interview-nav">
    <button id="prevBtn" class="btn btn--secondary">Previous</button>
    <button id="nextBtn" class="btn btn--primary">Next</button>
  </div>
</main>
```

## CSS Architecture

### Interview Styles (`css/interview.css`)
**Key Components**:
```css
/* Interview Layout */
.interview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.interview-step {
  display: none;
  animation: fadeIn 0.3s ease;
}

.interview-step.active {
  display: block;
}

/* Progress Indicator */
.interview-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
}

.progress-step {
  flex: 1;
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--color-gray-200);
  position: relative;
}

.progress-step.active {
  background: var(--color-primary);
  color: white;
}

/* Preference Buttons */
.preference-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.preference-btn {
  padding: var(--spacing-lg);
  border: 2px solid var(--color-gray-300);
  background: white;
  transition: all var(--transition-base);
}

.preference-btn.selected {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}
```

### Results Styles (`css/results.css`)
**Key Components**:
```css
/* Results Comparison */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.plan-card {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  position: relative;
  transition: transform var(--transition-base);
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.plan-card.recommended {
  border: 2px solid var(--color-primary);
}

.plan-card.recommended::before {
  content: "Recommended";
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--color-primary);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: var(--font-size-sm);
}

/* Plan Details */
.plan-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.plan-price {
  font-size: var(--font-size-3xl);
  font-weight: bold;
  color: var(--color-primary);
}

.plan-features {
  list-style: none;
  margin: var(--spacing-md) 0;
}

.plan-features li {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.plan-cta {
  width: 100%;
  margin-top: var(--spacing-md);
}
```

## Data Flow

### 1. Initialization Flow
```
Page Load → Initialize Interview Controller → Load Provider Data → Show Step 1
```

### 2. State Selection Flow
```
User Selects State → Validate Selection → Filter Providers → Enable Next Button → Save to State Manager
```

### 3. Preferences Flow
```
User Clicks Button/Types Text → Update State Manager → Validate Input → Enable Next Button
```

### 4. Results Generation Flow
```
User Clicks Next → Show Loading → Call Gemini Service → Process Response → Render Results → Track Analytics
```

### 5. Error Handling Flow
```
API Error → Log Error → Show Fallback Results → Provide Manual Options → Track Error Event
```

## API Integration

### Gemini Flash 1.5 Configuration
```javascript
// config/api-config.js
const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_API_KEY',
  model: 'gemini-1.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  maxTokens: 1000,
  temperature: 0.3,
  rateLimit: {
    requestsPerMinute: 15,
    requestsPerDay: 1500
  }
};
```

### Request Structure
```javascript
const request = {
  contents: [{
    parts: [{
      text: promptText
    }]
  }],
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 1000,
    responseMimeType: "application/json"
  }
};
```

## Analytics Integration

### Basic Analytics (`js/analytics.js`)
**Tracked Events**:
- Interview started
- Step completed
- State selected
- Preference method (buttons vs text)
- Results generated
- Plan clicked
- Interview abandoned
- Errors encountered

**Implementation**:
```javascript
class Analytics {
  trackEvent(eventName, properties) {
    // Google Analytics 4 event
    gtag('event', eventName, properties);
    
    // Console log for debugging
    console.log('Analytics:', eventName, properties);
  }
  
  trackInterviewStart() {
    this.trackEvent('interview_started', {
      timestamp: new Date().toISOString()
    });
  }
  
  trackStateSelection(state) {
    this.trackEvent('state_selected', { state });
  }
  
  trackPreferenceMethod(method) {
    this.trackEvent('preference_method', { method }); // 'buttons' or 'text'
  }
  
  trackResults(recommendationsCount) {
    this.trackEvent('results_generated', { 
      recommendations_count: recommendationsCount 
    });
  }
}
```

## Error Handling Strategy

### 1. API Errors
- Network failures → Show offline message with manual provider list
- Rate limiting → Queue requests and retry with exponential backoff
- Invalid responses → Fallback to rule-based recommendations

### 2. User Input Errors
- No state selected → Highlight required field
- No preferences → Allow continuation with default weighting
- Invalid text input → Sanitize and proceed

### 3. Data Errors
- Provider data missing → Show error message and contact info
- Plan data incomplete → Display available information with disclaimer

## Security Considerations

### 1. API Key Management
- Store in environment variables
- Use different keys for development/production
- Implement key rotation strategy

### 2. Input Sanitization
- Sanitize all user text input
- Validate state selections against allowed list
- Prevent XSS in dynamic content rendering

### 3. Rate Limiting
- Implement client-side rate limiting
- Track requests per session
- Graceful degradation when limits exceeded

## Performance Optimization

### 1. Data Loading
- Lazy load provider data
- Cache provider data in sessionStorage
- Compress provider data file

### 2. API Efficiency
- Batch multiple preference inputs into single request
- Cache API responses for duplicate requests
- Implement request deduplication

### 3. Rendering Performance
- Use DocumentFragment for DOM manipulation
- Lazy render non-visible plan details
- Optimize images and assets

## Testing Strategy

### 1. Unit Testing
- State manager functions
- Gemini service API calls
- Results rendering logic
- Analytics tracking

### 2. Integration Testing
- Complete interview flow
- Error scenarios
- Different state/preference combinations
- API failure scenarios

### 3. User Testing
- Interview completion rates
- Time to completion
- User satisfaction with recommendations
- Mobile usability

## Deployment Strategy

### 1. Environment Setup
- Development: Local testing with mock API
- Staging: Real API with test data
- Production: Full provider data and analytics

### 2. Feature Flags
- Enable/disable interview feature
- Switch between Gemini and fallback logic
- Control analytics collection

### 3. Monitoring
- API response times
- Error rates
- User completion rates
- Popular preferences and states

## Next Phase Considerations

### Phase 2 Enhancements
- Advanced filtering options
- Plan comparison improvements
- User account creation for saved preferences
- Email/SMS plan alerts
- Integration with provider APIs for real-time data

### Phase 3 Scalability
- Backend service for API key management
- Database for user preferences and analytics
- Advanced recommendation algorithms
- A/B testing framework
- Multi-language support

This architecture provides a complete foundation for building the Lifeline interview feature while maintaining your existing website's simplicity and maintainability.