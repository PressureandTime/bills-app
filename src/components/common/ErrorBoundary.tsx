import React from 'react';
import { Alert, Typography } from '@mui/material';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
  title?: string;
  description?: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('Error Boundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }

      // Default error display
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="h6">
            {this.props.title || 'Something went wrong'}
          </Typography>
          <Typography variant="body2">
            {this.props.description ||
              'There was an issue loading this component. Please refresh the page.'}
          </Typography>
          {this.state.error && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Error: {this.state.error.message}
            </Typography>
          )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

export function DataGridErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      title="Data Grid Error"
      description="There was an issue loading the data grid. Please refresh the page."
    >
      {children}
    </ErrorBoundary>
  );
}
