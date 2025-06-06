# GeminiService Documentation

## Overview

The `GeminiService` class provides a comprehensive interface for interacting with the Gemini API to get plan recommendations based on user preferences. It includes features for caching, rate limiting, error handling, security, and testing.

## Installation

```javascript
import { GeminiService } from './js/gemini-service.js';
```

## Basic Usage

```javascript
// Initialize the service
const geminiService = new GeminiService();

// Get recommendations
const recommendations = await geminiService.getRecommendations({
  preferences: {
    location: 'Atlanta, GA',
    income: 50000,
    householdSize: 2
  }
});

// Handle the response
if (recommendations.recommendations) {
  recommendations.recommendations.forEach(plan => {
    console.log(`${plan.name}: ${plan.description}`);
  });
}
```

## Configuration

The `GeminiService` constructor accepts the following configuration options:

```javascript
const service = new GeminiService({
  apiKey: 'your-api-key',           // Gemini API key
  apiEndpoint: 'https://api.example.com', // API endpoint URL
  mockMode: false,                  // Enable mock mode for testing
  maxRetries: 3,                    // Maximum number of retry attempts
  retryDelay: 1000,                 // Delay between retries in milliseconds
  timeout: 30000                    // Request timeout in milliseconds
});
```

## API Reference

### getRecommendations(options)

Gets plan recommendations based on user preferences.

#### Parameters

- `options` (Object)
  - `preferences` (Object)
    - `location` (string) - User's location
    - `income` (number) - Annual household income
    - `householdSize` (number) - Number of people in household
    - `hasDisability` (boolean, optional) - Whether any household member has a disability
    - `isVeteran` (boolean, optional) - Whether any household member is a veteran
    - `isSenior` (boolean, optional) - Whether any household member is a senior
    - `hasChildren` (boolean, optional) - Whether household has children
    - `isStudent` (boolean, optional) - Whether any household member is a student
    - `isUnemployed` (boolean, optional) - Whether any household member is unemployed
    - `isHomeless` (boolean, optional) - Whether household is experiencing homelessness
    - `isImmigrant` (boolean, optional) - Whether any household member is an immigrant
    - `isRefugee` (boolean, optional) - Whether any household member is a refugee
    - `isLGBTQ` (boolean, optional) - Whether any household member identifies as LGBTQ+
    - `isSingleParent` (boolean, optional) - Whether household is headed by a single parent
    - `isFoster` (boolean, optional) - Whether household includes foster children
    - `isAdopted` (boolean, optional) - Whether household includes adopted children
    - `isBlind` (boolean, optional) - Whether any household member is blind
    - `isDeaf` (boolean, optional) - Whether any household member is deaf
    - `isMobilityImpaired` (boolean, optional) - Whether any household member has mobility impairments
    - `isDevelopmentallyDisabled` (boolean, optional) - Whether any household member has developmental disabilities
    - `isMentallyIll` (boolean, optional) - Whether any household member has mental illness
    - `isSubstanceAbuse` (boolean, optional) - Whether any household member has substance abuse issues
    - `isDomesticViolence` (boolean, optional) - Whether household is experiencing domestic violence
    - `isNaturalDisaster` (boolean, optional) - Whether household is affected by natural disaster
    - `isPandemic` (boolean, optional) - Whether household is affected by pandemic
    - `isOther` (boolean, optional) - Whether household has other special circumstances
    - `otherCircumstances` (string, optional) - Description of other circumstances
  - `forceRefresh` (boolean, optional) - Force refresh cache

#### Returns

- `Promise<Object>` - Recommendations response

#### Examples

```javascript
// Get recommendations for a family
const recommendations = await geminiService.getRecommendations({
  preferences: {
    location: 'Atlanta, GA',
    income: 50000,
    householdSize: 4,
    hasChildren: true,
    isSingleParent: true
  }
});

// Get recommendations for a senior
const recommendations = await geminiService.getRecommendations({
  preferences: {
    location: 'Atlanta, GA',
    income: 30000,
    householdSize: 1,
    isSenior: true,
    hasDisability: true
  }
});

// Get recommendations with force refresh
const recommendations = await geminiService.getRecommendations({
  preferences: {
    location: 'Atlanta, GA',
    income: 50000,
    householdSize: 2
  },
  forceRefresh: true
});
```

### Testing

The service includes a comprehensive testing framework. You can run tests and generate reports in various formats.

```javascript
// Run all tests
const results = await geminiService.runTests();

// Get test results
const allResults = geminiService.getTestResults();
const apiResults = geminiService.getTestResults('API Tests');

// Generate test reports
const jsonReport = geminiService.generateTestReport('json');
const htmlReport = geminiService.generateTestReport('html');
const textReport = geminiService.generateTestReport('text');
```

### Debugging

The service provides tools for debugging and monitoring.

```javascript
// Get debug information
const debugInfo = geminiService.getDebugInfo();

// Export logs
const jsonLogs = geminiService.exportLogs('json');
const csvLogs = geminiService.exportLogs('csv');
const textLogs = geminiService.exportLogs('text');
```

## Error Handling

The service includes comprehensive error handling for various scenarios:

- Network errors
- API errors
- Validation errors
- Rate limiting
- Security violations

Errors are logged and can be exported for analysis.

## Security Features

- API key management
- Request validation
- IP blocking
- Rate limiting
- Response sanitization

## Performance Monitoring

The service includes performance monitoring features:

- Request tracking
- Cache performance
- Error rates
- Response times

## Caching

The service implements a robust caching system:

- In-memory caching
- Persistent storage
- Cache expiration
- Force refresh option

## Rate Limiting

The service includes rate limiting features:

- Request tracking
- Token bucket algorithm
- Automatic retries
- Rate limit headers

## Best Practices

1. Always handle errors appropriately
2. Use the force refresh option when needed
3. Monitor performance metrics
4. Keep API keys secure
5. Use appropriate timeouts
6. Implement proper error recovery
7. Monitor cache performance
8. Use appropriate rate limits

## Contributing

Please read the contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License. 