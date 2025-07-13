import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { customLogger } from 'configs/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ContractsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    customLogger.error('Contracts module error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <Card className="w-full max-w-md">
            <div className="text-center space-y-4">
              <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
              <h2 className="text-xl font-semibold text-gray-800">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                An error occurred in the contracts module. Please try again or contact support if the problem persists.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 p-4 rounded mt-4">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 text-sm text-red-600 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2 justify-center">
                <Button 
                  label="Try Again" 
                  onClick={this.handleReset}
                  className="p-button-outlined"
                />
                <Button 
                  label="Reload Page" 
                  onClick={this.handleReload}
                  className="p-button-danger"
                />
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 