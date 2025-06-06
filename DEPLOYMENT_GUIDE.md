# GAC-Simple Deployment Guide

## Required Information for Cursor LLM

### 1. Project Configuration
```json
{
  "projectName": "GAC-Simple",
  "deploymentPlatform": "Vercel",
  "environmentVariables": {
    "GeminiAPI": "YOUR_GEMINI_API_KEY"
  }
}
```

### 2. Core Files to Modify
1. `index.html`
   - Update title and description
   - Modify mobile plans data structure
   - Adjust UI elements and styling

2. `api/gemini.js`
   - Update API endpoint configuration
   - Modify prompt templates
   - Adjust error handling

3. `package.json`
   - Update project name and description
   - Verify dependencies

### 3. Key Components to Customize

#### Mobile Plans Data Structure
```javascript
const MOBILE_PLANS = [
  {
    id: 1,
    name: "Plan Name",
    carrier: "Carrier Name",
    price: 0,
    data: "Data Amount",
    features: ["Feature 1", "Feature 2"],
    hotspot: "Hotspot Details"
  }
  // Add more plans...
];
```

#### Gemini API Prompts
1. Plan Recommendation Prompt:
```javascript
const recommendationPrompt = `You are a mobile plan expert helping someone who might not be familiar with technical terms. Based on this request: "${userInput}", recommend exactly 3 plan IDs from this list that best match the user's needs. Rank them as "Best", "Great", and "Good". Return ONLY the 3 plan IDs as comma-separated numbers with their rank (example: "1:Best,7:Great,12:Good"). Plans: ${JSON.stringify(MOBILE_PLANS)}`;
```

2. Plan Explanation Prompt:
```javascript
const explanationPrompt = `You are a friendly mobile plan expert explaining things to someone who might not be familiar with technical terms. Use simple, everyday language that a high school student would understand. For each of these plans, provide:
1. A brief explanation (1-2 sentences) of why this plan matches the user's needs
2. A short summary of why these 3 plans were selected overall`;
```

### 4. Required Environment Variables
- `GeminiAPI`: Your Google Gemini API key

### 5. Deployment Steps
1. Create new Vercel project
2. Set up environment variables
3. Deploy serverless functions
4. Configure domain (if needed)

### 6. Testing Checklist
- [ ] API key configuration
- [ ] Serverless function deployment
- [ ] Frontend-backend communication
- [ ] Error handling
- [ ] Response parsing
- [ ] UI responsiveness

### 7. Common Issues and Solutions
1. API Key Issues
   - Verify environment variable setup
   - Check API key permissions
   - Ensure proper error handling

2. Response Parsing
   - Verify prompt structure
   - Check response format
   - Implement proper error handling

3. UI Issues
   - Test responsive design
   - Verify loading states
   - Check error messages

### 8. Performance Considerations
1. API Calls
   - Implement caching
   - Optimize prompt length
   - Monitor token usage

2. Frontend
   - Optimize bundle size
   - Implement lazy loading
   - Use proper caching

### 9. Security Checklist
- [ ] API key security
- [ ] Input validation
- [ ] Error message sanitization
- [ ] Rate limiting
- [ ] CORS configuration

### 10. Maintenance Tasks
1. Regular Updates
   - Dependencies
   - API versions
   - Security patches

2. Monitoring
   - API usage
   - Error rates
   - Performance metrics

## Quick Start Commands
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
# Add GeminiAPI to .env file

# Deploy to Vercel
vercel deploy
```

## Support Resources
1. Google Gemini API Documentation
2. Vercel Deployment Guide
3. Project Documentation
4. Error Handling Guide
5. Performance Optimization Guide 