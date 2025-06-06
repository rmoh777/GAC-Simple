# Lifeline Plan Finder

A web application that helps users find the best Lifeline wireless plan based on their location and preferences.

## Features

- State-based plan filtering
- Preference-based recommendations
- Detailed plan comparisons
- Provider information and contact details
- Mobile-responsive design
- Analytics tracking

## Setup

1. Clone the repository
2. Add your Gemini API key to `config/api-config.js`
3. Open `index.html` in a web browser

## Project Structure

```
├── css/
│   ├── interview.css
│   ├── results.css
│   └── styles.css
├── js/
│   ├── analytics.js
│   ├── gemini-service.js
│   ├── interview-controller.js
│   ├── lifeline-providers.js
│   ├── results-renderer.js
│   └── state-manager.js
├── config/
│   └── api-config.js
├── images/
│   └── providers/
│       ├── assurance.svg
│       ├── safelink.svg
│       └── qlink.svg
└── index.html
```

## Components

### State Manager
- Manages application state
- Handles user preferences
- Validates user inputs
- Persists state in session storage

### Interview Controller
- Manages the interview flow
- Handles user interactions
- Validates step completion
- Coordinates between services

### Gemini Service
- Handles API communication
- Processes recommendations
- Manages error handling
- Implements retry logic

### Results Renderer
- Displays plan comparisons
- Creates interactive UI elements
- Handles user interactions
- Manages responsive layout

### Analytics
- Tracks user interactions
- Records step completion times
- Monitors error rates
- Provides usage insights

## Usage

1. Select your state
2. Choose your preferences
3. Review plan recommendations
4. Compare plan details
5. Select a plan and sign up

## Development

### Adding New Providers
1. Add provider data to `js/lifeline-providers.js`
2. Add provider logo to `images/providers/`
3. Update state coverage in provider data

### Modifying Styles
- Use design tokens in CSS files
- Follow mobile-first approach
- Maintain consistent spacing
- Test responsive layouts

### API Integration
- Configure API key in `config/api-config.js`
- Adjust rate limits as needed
- Monitor API usage
- Handle errors appropriately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details 