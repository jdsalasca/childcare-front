// Standardized error handling utility
import React from 'react';
import { customLogger } from '../configs/logger';
import NavigationService from './navigationService';

export interface ApiError {
  httpStatus: number;
  message: string;
  response?: unknown;
  isNetworkError?: boolean;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  toastRef?: React.RefObject<{
    show: (options: {
      severity: string;
      summary: string;
      detail?: string;
      life?: number;
    }) => void;
  }>;
  redirectOnAuthError?: boolean;
  logError?: boolean;
}

export class ErrorHandler {
  /**
   * Standardized error handling for API responses
   */
  static handleApiError(
    error: unknown,
    context: string,
    options: ErrorHandlerOptions = {}
  ): ApiError {
    const {
      showToast = true,
      toastRef,
      redirectOnAuthError = true,
      logError = true,
    } = options;

    let apiError: ApiError;

    // Handle different types of errors
    if (this.isAxiosError(error)) {
      apiError = this.handleAxiosError(error);
    } else if (error instanceof Error) {
      apiError = this.handleGenericError(error);
    } else {
      apiError = this.handleUnknownError(error);
    }

    // Log error if enabled
    if (logError) {
      customLogger.error(`Error in ${context}:`, apiError);
    }

    // Handle authentication errors
    if (apiError.httpStatus === 401 && redirectOnAuthError) {
      NavigationService.navigateToSessionExpired();
    }

    // Show toast notification if enabled and toast ref is provided
    if (showToast && toastRef?.current) {
      toastRef.current.show({
        severity: 'error',
        summary: 'Error',
        detail: apiError.message,
        life: 5000,
      });
    }

    return apiError;
  }

  /**
   * Handle successful API responses
   */
  static handleApiSuccess<T>(
    response: T,
    context: string,
    options: ErrorHandlerOptions = {}
  ): T {
    const { showToast = false, toastRef } = options;

    // Log success if needed
    customLogger.debug(`Success in ${context}:`, response);

    // Show success toast if enabled
    if (showToast && toastRef?.current) {
      toastRef.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Operation completed successfully',
        life: 3000,
      });
    }

    return response;
  }

  /**
   * Check if error is an Axios error
   */
  private static isAxiosError(
    error: unknown
  ): error is { response?: { status: number; data: unknown } } {
    return typeof error === 'object' && error !== null && 'response' in error;
  }

  /**
   * Handle Axios-specific errors
   */
  private static handleAxiosError(error: {
    response?: { status: number; data: unknown };
  }): ApiError {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return {
            httpStatus: status,
            message: 'Bad request. Please check your input.',
            response: data,
          };
        case 401:
          return {
            httpStatus: status,
            message: 'Authentication required. Please log in again.',
            response: data,
          };
        case 403:
          return {
            httpStatus: status,
            message:
              'Access denied. You do not have permission for this action.',
            response: data,
          };
        case 404:
          return {
            httpStatus: status,
            message: 'Resource not found.',
            response: data,
          };
        case 422:
          return {
            httpStatus: status,
            message: 'Validation error. Please check your input.',
            response: data,
          };
        case 500:
          return {
            httpStatus: status,
            message: 'Server error. Please try again later.',
            response: data,
          };
        default:
          return {
            httpStatus: status,
            message: `Request failed with status ${status}`,
            response: data,
          };
      }
    } else {
      return {
        httpStatus: 0,
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      };
    }
  }

  /**
   * Handle generic JavaScript errors
   */
  private static handleGenericError(error: Error): ApiError {
    return {
      httpStatus: 0,
      message: error.message || 'An unexpected error occurred.',
      response: error,
    };
  }

  /**
   * Handle unknown error types
   */
  private static handleUnknownError(error: unknown): ApiError {
    return {
      httpStatus: 0,
      message: 'An unknown error occurred.',
      response: error,
    };
  }

  /**
   * Create a standardized error message for user display
   */
  static getUserFriendlyMessage(error: ApiError): string {
    return error.message || 'An error occurred. Please try again.';
  }

  /**
   * Check if error is recoverable (user can retry)
   */
  static isRecoverableError(error: ApiError): boolean {
    return error.httpStatus >= 500 || error.isNetworkError === true;
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: ApiError): boolean {
    return error.httpStatus === 400 || error.httpStatus === 422;
  }

  /**
   * Check if error is an authentication error
   */
  static isAuthError(error: ApiError): boolean {
    return error.httpStatus === 401 || error.httpStatus === 403;
  }
}

export default ErrorHandler;
