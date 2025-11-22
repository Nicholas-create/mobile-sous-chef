import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Sentry from '@sentry/react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  eventId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Send to Sentry with error info
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    this.setState({ eventId });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center p-6 bg-slate-50">
          <Text className="text-2xl font-bold text-slate-900 mb-4">
            Oops! Something went wrong
          </Text>
          <Text className="text-slate-600 text-center mb-6">
            We're having trouble loading this content. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <View className="bg-red-50 p-4 rounded-lg mb-4 w-full">
              <Text className="text-red-800 text-sm font-mono">
                {this.state.error.message}
              </Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-orange-600 px-6 py-3 rounded-xl"
            onPress={this.handleReset}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
