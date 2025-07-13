import { Component, ErrorInfo, ReactNode } from 'react';
import { customLogger } from '../../configs/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    customLogger.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='error-boundary-container p-6 max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg shadow-sm'>
          <div className='flex items-center mb-4'>
            <i className='pi pi-exclamation-triangle text-red-600 text-2xl mr-3'></i>
            <h2 className='text-lg font-semibold text-red-800'>
              Something went wrong
            </h2>
          </div>
          <p className='text-red-700 mb-4'>
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>
          <button
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && (
            <details className='mt-4 p-2 bg-gray-100 rounded text-sm'>
              <summary className='cursor-pointer font-medium text-gray-700'>
                Error Details (Development)
              </summary>
              <pre className='mt-2 text-xs text-gray-600 overflow-auto'>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
