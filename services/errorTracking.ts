import * as Sentry from '@sentry/react-native';

// Initialize Sentry for error tracking
export const initErrorTracking = () => {
  // Only initialize if DSN is provided (you'll need to add this to .env.local)
  const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: false, // Don't send errors during development
    debug: __DEV__, // Enable debug mode in development
    tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000, // 30 seconds
    // Environment and release info
    environment: __DEV__ ? 'development' : 'production',
    beforeSend(event, hint) {
      // Filter out errors you don't want to track
      if (__DEV__) {
        console.log('Sentry event:', event);
        console.log('Sentry hint:', hint);
        // Don't send events in development
        return null;
      }
      return event;
    },
  });
};

// Helper functions for manual error tracking
export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
};

export const logMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
    timestamp: Date.now() / 1000,
  });
};

export default Sentry;
