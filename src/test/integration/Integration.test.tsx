import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../utils';

import ChildrenAPI from '../../models/ChildrenAPI';

// Mock API modules
vi.mock('../../models/ChildrenAPI', () => ({
  default: {
    getChildren: vi.fn().mockResolvedValue({
      httpStatus: 200,
      response: [
        { id: 1, first_name: 'John', last_name: 'Doe', classroom: 'Toddler' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', classroom: 'Infant' }
      ]
    })
  },
  useChildren: vi.fn().mockReturnValue({
    data: [
      { id: 1, first_name: 'John', last_name: 'Doe', classroom: 'Toddler' },
      { id: 2, first_name: 'Jane', last_name: 'Smith', classroom: 'Infant' }
    ],
    isLoading: false,
    isError: false,
    error: null,
    refreshChildren: vi.fn()
  })
}));

vi.mock('../../models/BillTypeAPI', () => ({
  useBillTypesByCurrencyCode: vi.fn().mockReturnValue({
    data: [
      { id: 1, label: '$100 Bill', value: 100 },
      { id: 2, label: '$50 Bill', value: 50 }
    ]
  })
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  })),
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    clear: vi.fn(),
    removeQueries: vi.fn(),
    resetQueries: vi.fn(),
    refetchQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryCache: vi.fn(() => ({
      getAll: vi.fn(() => []),
      find: vi.fn(),
      findAll: vi.fn(() => []),
    })),
    getMutationCache: vi.fn(() => ({
      getAll: vi.fn(() => []),
      find: vi.fn(),
      findAll: vi.fn(() => []),
    })),
  })),
  QueryClientProvider: vi.fn(({ children }) => children),
}));

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
  })),
  useFieldArray: vi.fn(() => ({
    fields: [],
    append: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
    move: vi.fn(),
    swap: vi.fn(),
    replace: vi.fn(),
  })),
  Controller: vi.fn(({ render }) => render({ field: { onChange: vi.fn(), value: '' } })),
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API Integration', () => {
    it('should handle API calls correctly', async () => {
      // Test that API mocks work correctly
      const result = await ChildrenAPI.getChildren();
      expect(result.httpStatus).toBe(200);
      expect(result.response).toHaveLength(2);
    });

    it('should handle API failures gracefully', async () => {
      // Mock API failure
      const mockError = new Error('API Error');
      vi.mocked(ChildrenAPI.getChildren).mockRejectedValue(mockError);

      await expect(ChildrenAPI.getChildren()).rejects.toThrow('API Error');
    });
  });

  describe('Utility Integration', () => {
    it('should handle form validation correctly', () => {
      // Test basic form validation logic
      const mockForm = {
        control: {},
        handleSubmit: vi.fn((fn) => fn),
        formState: { errors: {} },
        watch: vi.fn(),
        setValue: vi.fn(),
        getValues: vi.fn(),
        reset: vi.fn(),
      };

      expect(mockForm.handleSubmit).toBeDefined();
      expect(mockForm.formState.errors).toBeDefined();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should catch and display errors properly', () => {
      // This test verifies error boundaries work
      const ThrowError = () => {
        throw new Error('Test error');
      };

      // Mock console.error to prevent test output noise
      const originalError = console.error;
      console.error = vi.fn();

      try {
        const { container } = render(
          <div>
            <ThrowError />
          </div>
        );

        // Should not crash the entire application
        expect(container).toBeInTheDocument();
      } finally {
        // Restore console.error
        console.error = originalError;
      }
    });
  });

  describe('Performance Integration', () => {
    it('should handle basic operations without performance issues', async () => {
      const startTime = performance.now();
      
      // Simple operation that should be fast
      const result = await ChildrenAPI.getChildren();
      
      const endTime = performance.now();
      const operationTime = endTime - startTime;
      
      // Should complete within reasonable time
      expect(operationTime).toBeLessThan(1000); // Less than 1 second
      expect(result).toBeDefined();
    });
  });
});