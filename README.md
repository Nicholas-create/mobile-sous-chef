# 🍳 Mobile Sous-Chef

An AI-powered recipe discovery and meal planning mobile application built with React Native, Expo, and Google Gemini AI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)

## 🌟 Features

### Recipe Generation
- **📝 Text-to-Recipe (Planner)**: Generate 3 distinct recipes from natural language descriptions
- **📸 Image-to-Recipe (Scavenger)**: Snap a photo of ingredients and get AI-powered recipe suggestions
- **✨ Daily Menu Inspiration**: Curated daily menu with Fast, Efficient, and Craving categories

### Recipe Management
- **📖 Personal Cookbook**: Save and organize your favorite recipes
- **🛒 Smart Shopping List**: Automatic shopping list generation from recipe ingredients
- **👨‍🍳 Cook Mode**: Step-by-step cooking interface with built-in AI assistant
- **📊 Pantry Audit**: Track ingredient inventory and check off what you have

### User Experience
- **🌍 Measurement Systems**: Toggle between metric and imperial units
- **🎨 Beautiful UI**: Modern, minimalist design inspired by Google AI Studio
- **♿ Accessibility**: Full screen reader support with semantic labels
- **💾 Offline-First**: Local data persistence with AsyncStorage

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠 Tech Stack

### Frontend
- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** ~54.0.25 - Development platform and tooling
- **TypeScript** 5.9.2 - Type-safe JavaScript
- **Expo Router** 6.0.15 - File-based navigation
- **NativeWind** 4.2.1 - Tailwind CSS for React Native
- **Lucide Icons** - Beautiful icon library

### AI & Services
- **Google Gemini 2.5 Flash** - Recipe generation and chat
- **Google Imagen 4.0** - AI image generation
- **Zod** - Runtime validation

### State Management
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local storage

### Development & Quality
- **Jest** - Testing framework
- **Testing Library** - React Native testing utilities
- **Sentry** - Error tracking and monitoring
- **ESLint** - Code linting

## ✅ Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Simulator** (macOS) or **Android Studio** (for mobile development)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))
- **Sentry DSN** (optional, [get one here](https://sentry.io/))

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-sous-chef
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY="your-gemini-api-key-here"
   EXPO_PUBLIC_SENTRY_DSN="your-sentry-dsn-here" # Optional
   ```

   **⚠️ Security Note:** Never commit `.env.local` to version control!

## ⚙️ Configuration

### Google Gemini API Setup

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create a new API key
3. Add the key to your `.env.local` file
4. Ensure billing is enabled if you exceed the free tier

### Sentry Setup (Optional but Recommended)

1. Create a Sentry account at [sentry.io](https://sentry.io/)
2. Create a new React Native project
3. Copy the DSN and add it to `.env.local`
4. Error tracking will automatically start capturing exceptions

### AI Model Configuration

Edit `constants/aiConfig.ts` to customize which models are used for each feature:

```typescript
export const AI_CONFIG = {
  textToRecipe: 'gemini-2.5-flash',
  imageToRecipe: 'gemini-2.5-flash',
  dailyMenu: 'gemini-2.5-flash',
  chatAssistant: 'gemini-2.5-flash',
  imageGenerator: 'imagen-4.0',
};
```

## 🚀 Running the App

### Development Mode

```bash
# Start Expo dev server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on Web
npm run web
```

### Clear Cache and Restart

```bash
npx expo start --clear
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Test Coverage Report
```bash
npm run test:coverage
```

### Test Files
- `__tests__/utils/formatting.test.ts` - Utility function tests
- `__tests__/context/AppContext.test.tsx` - State management tests
- `__tests__/services/errorTracking.test.ts` - Error tracking tests

## 📁 Project Structure

```
mobile-sous-chef/
├── app/                          # Screen components (Expo Router)
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx             # Home/Dashboard
│   │   ├── cookbook.tsx          # Saved recipes
│   │   ├── shopping-list.tsx     # Shopping list
│   │   └── preferences.tsx       # Settings
│   ├── recipe/[id].tsx           # Recipe detail (dynamic route)
│   ├── planner.tsx               # Text-to-recipe generation
│   ├── scavenger.tsx             # Image-to-recipe generation
│   ├── daily-menu.tsx            # AI daily menu
│   └── _layout.tsx               # Root layout
├── components/                    # Reusable UI components
│   ├── RecipeCard.tsx            # Recipe preview card
│   ├── CookMode.tsx              # Cooking interface
│   ├── PantryAudit.tsx           # Ingredient audit modal
│   ├── ChatAssistant.tsx         # AI chat sidebar
│   └── ErrorBoundary.tsx         # Error handling
├── services/                      # Business logic
│   ├── geminiService.ts          # AI API integration
│   └── errorTracking.ts          # Sentry integration
├── context/                       # State management
│   └── AppContext.tsx            # Global app state
├── hooks/                         # Custom React hooks
├── utils/                         # Helper functions
│   └── formatting.ts             # Unit conversion
├── constants/                     # Configuration
│   ├── aiConfig.ts               # AI model settings
│   └── theme.ts                  # Design tokens
├── types.ts                       # TypeScript types & Zod schemas
├── __tests__/                     # Test files
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment template
├── jest.config.js                 # Jest configuration
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

## 🏗 Architecture

### Design Patterns

**1. Context API for State Management**
- Single `AppContext` for global state (recipes, shopping list, settings)
- Debounced saves (500ms) to AsyncStorage for performance
- Memoized values and callbacks to prevent unnecessary re-renders

**2. File-Based Routing (Expo Router)**
- Screens organized by route structure
- Dynamic routes for recipe details: `/recipe/[id]`
- Grouped routes for tab navigation: `(tabs)`

**3. Service Layer Architecture**
- `geminiService.ts` handles all AI API calls
- Centralized error handling and logging
- Response validation with Zod schemas

**4. Component Composition**
- Reusable feature components (RecipeCard, CookMode, etc.)
- Themed components for consistent styling
- Separation of concerns (UI vs. business logic)

### Data Flow

```
User Input → Component → Context API → Service → API
                ↓                         ↓
            Local State              AsyncStorage
                ↓
           UI Update
```

### Type Safety

- **Strict TypeScript** enabled throughout
- **Zod Runtime Validation** for all API responses
- **Type Guards** for safe data access

## 🔒 Security

### Implemented Security Measures

✅ **API Key Management**
- Keys stored in environment variables (`.env.local`)
- Never committed to version control
- Headers used instead of URL parameters

✅ **Input Validation**
- User input sanitized and validated
- Character length limits enforced
- Rate limiting on API calls

✅ **Error Handling**
- Global error boundary
- Sentry error tracking
- No sensitive data in error messages

✅ **Data Privacy**
- All data stored locally on device
- No user accounts or authentication required
- No third-party data sharing (except AI API)

### Security Best Practices

- Run `npm audit` regularly
- Keep dependencies updated
- Review `SECURITY.md` for detailed audit
- Rotate API keys if exposed

## 📱 Deployment

### Build for iOS

```bash
# Using EAS Build (recommended)
npx eas build --platform ios

# Or local build
npx expo run:ios --configuration Release
```

### Build for Android

```bash
# Using EAS Build (recommended)
npx eas build --platform android

# Or local build
npx expo run:android --variant release
```

### Environment-Specific Builds

For production builds:
1. Create separate `.env.production` file
2. Use Expo Secrets for sensitive keys
3. Enable Sentry error tracking
4. Configure app versioning in `app.json`

### App Store Submission

Refer to Expo's documentation:
- [iOS App Store Guide](https://docs.expo.dev/submit/ios/)
- [Google Play Store Guide](https://docs.expo.dev/submit/android/)

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module '@env'"**
- Solution: Restart Expo dev server with `--clear` flag

**Issue: API calls failing**
- Check API key is correct in `.env.local`
- Verify internet connection
- Check Google AI API quota

**Issue: Tests failing**
- Clear Jest cache: `npx jest --clearCache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Issue: Expo app not loading**
- Clear Metro bundler cache: `npx expo start --clear`
- Clear iOS/Android build: `npx expo prebuild --clean`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Add accessibility labels to UI components
- Update documentation for API changes
- Run `npm run lint` before committing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful recipe generation
- **Expo Team** for excellent React Native tooling
- **React Native Community** for components and libraries
- **Tailwind CSS** for utility-first styling inspiration

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review security guidelines in `SECURITY.md`

## 🗺 Roadmap

### Upcoming Features
- [ ] User accounts and cloud sync
- [ ] Recipe ratings and reviews
- [ ] Meal planning calendar
- [ ] Grocery store price comparison
- [ ] Nutrition tracking
- [ ] Social sharing
- [ ] Recipe collections/categories
- [ ] Voice input for hands-free cooking

---

**Built with ❤️ using React Native, Expo, and Google Gemini AI**
