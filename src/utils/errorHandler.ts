import { customLogger } from 'configs/logger';

export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  throwError?: boolean;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handles errors in a consistent way across the application
   */
  public handleError(error: any, options: ErrorHandlerOptions = {}): ErrorInfo {
    const {
      showToast = false,
      logError = true,
      throwError = false,
      context = 'Unknown',
    } = options;

    // Extract error information
    const errorInfo = this.extractErrorInfo(error);

    // Log error if requested
    if (logError) {
      this.logError(errorInfo, context);
    }

    // Show toast if requested
    if (showToast) {
      this.showErrorToast(errorInfo);
    }

    // Throw error if requested
    if (throwError) {
      throw new Error(errorInfo.message);
    }

    return errorInfo;
  }

  /**
   * Extracts error information from various error types
   */
  private extractErrorInfo(error: any): ErrorInfo {
    // Handle API response errors
    if (error && typeof error === 'object' && 'httpStatus' in error) {
      return {
        message:
          error.response?.error || error.response?.message || 'API Error',
        code: error.response?.errorType || 'API_ERROR',
        status: error.httpStatus,
        details: error.response,
      };
    }

    // Handle Axios errors
    if (error && error.isAxiosError) {
      return {
        message:
          error.response?.data?.message || error.message || 'Network Error',
        code: 'NETWORK_ERROR',
        status: error.response?.status,
        details: error.response?.data,
      };
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'STANDARD_ERROR',
        details: error.stack,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: error,
        code: 'STRING_ERROR',
      };
    }

    // Handle unknown errors
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  /**
   * Logs error information consistently
   */
  private logError(errorInfo: ErrorInfo, context: string): void {
    const logMessage = `[${context}] ${errorInfo.message}`;

    if (errorInfo.status && errorInfo.status >= 500) {
      customLogger.error(logMessage, errorInfo.details);
    } else if (errorInfo.status && errorInfo.status >= 400) {
      customLogger.warn(logMessage, errorInfo.details);
    } else {
      customLogger.debug(logMessage, errorInfo.details);
    }
  }

  /**
   * Shows error toast notification
   */
  private showErrorToast(errorInfo: ErrorInfo): void {
    // This will be implemented when we have access to toast context
    // For now, we'll use console.error as fallback
    console.error('Error Toast:', errorInfo.message);
  }

  /**
   * Creates a user-friendly error message
   */
  public getUserFriendlyMessage(error: any): string {
    const errorInfo = this.extractErrorInfo(error);

    // Map error codes to user-friendly messages
    switch (errorInfo.code) {
      case 'NETWORK_ERROR':
        return 'Connection error. Please check your internet connection.';
      case 'API_ERROR':
        return errorInfo.message || 'Server error. Please try again later.';
      case 'AUTH_ERROR':
        return 'Authentication failed. Please log in again.';
      default:
        return errorInfo.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Handles API errors specifically
   */
  public handleApiError(error: any, context: string = 'API'): ErrorInfo {
    return this.handleError(error, {
      logError: true,
      context,
    });
  }

  /**
   * Handles form validation errors
   */
  public handleValidationError(error: any, fieldName: string): ErrorInfo {
    return this.handleError(error, {
      logError: false,
      context: `Validation: ${fieldName}`,
    });
  }

  /**
   * Handles authentication errors
   */
  public handleAuthError(error: any): ErrorInfo {
    return this.handleError(error, {
      logError: true,
      context: 'Authentication',
    });
  }
}

// Export a default instance for easy use
export const errorHandler = ErrorHandler.getInstance();
