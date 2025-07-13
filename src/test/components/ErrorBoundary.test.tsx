import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/utils/ErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="test-child">Test Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should render error fallback when child throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error fallback
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should not render children when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should not show the child content
    expect(screen.queryByText('No error')).not.toBeInTheDocument();
  });
});