import * as Sentry from '@sentry/react-native';
import { logError, logMessage, setUserContext, addBreadcrumb } from '../../services/errorTracking';

jest.mock('@sentry/react-native');

describe('Error Tracking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logError', () => {
    it('should capture exception with Sentry', () => {
      const error = new Error('Test error');
      const context = { feature: 'test', userId: '123' };

      logError(error, context);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        contexts: { custom: context },
      });
    });

    it('should capture exception without context', () => {
      const error = new Error('Test error');

      logError(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error, {
        contexts: undefined,
      });
    });
  });

  describe('logMessage', () => {
    it('should capture message with default level', () => {
      logMessage('Test message');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Test message', 'info');
    });

    it('should capture message with custom level', () => {
      logMessage('Error message', 'error');

      expect(Sentry.captureMessage).toHaveBeenCalledWith('Error message', 'error');
    });
  });

  describe('setUserContext', () => {
    it('should set user context with all fields', () => {
      setUserContext('123', 'test@example.com', 'testuser');

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
      });
    });

    it('should set user context with only userId', () => {
      setUserContext('123');

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: '123',
        email: undefined,
        username: undefined,
      });
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb with data', () => {
      const data = { key: 'value' };
      addBreadcrumb('Test breadcrumb', 'navigation', data);

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'Test breadcrumb',
        category: 'navigation',
        data,
        level: 'info',
        timestamp: expect.any(Number),
      });
    });

    it('should add breadcrumb without data', () => {
      addBreadcrumb('Test breadcrumb', 'user-action');

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'Test breadcrumb',
        category: 'user-action',
        data: undefined,
        level: 'info',
        timestamp: expect.any(Number),
      });
    });
  });
});
