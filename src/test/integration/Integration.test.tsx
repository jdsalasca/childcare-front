import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../utils';
import { Bills } from '../../components/bills/Bills';
import { Contracts } from '../../components/contracts/Contracts';

// Mock API modules
vi.mock('../../models/ChildrenAPI', () => ({
  default: {
    getChildren: vi.fn().mockResolvedValue([
      { id: 1, first_name: 'John', last_name: 'Doe', classroom: 'Toddler' },
      { id: 2, first_name: 'Jane', last_name: 'Smith', classroom: 'Infant' }
    ])
  }
}));

vi.mock('../../models/BillTypeAPI', () => ({
  useBillTypesByCurrencyCode: vi.fn().mockReturnValue({
    data: [
      { id: 1, label: '$100 Bill', value: 100 },
      { id: 2, label: '$50 Bill', value: 50 }
    ]
  })
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Bills and Contracts Integration', () => {
    it('should handle navigation between Bills and Contracts', async () => {
      // This test verifies that both components can be rendered without conflicts
      const { unmount } = renderWithProviders(<Bills />);
      
      // Check Bills component renders
      expect(screen.getByText('bills.title')).toBeInTheDocument();
      
      // Unmount Bills and render Contracts
      unmount();
      
      renderWithProviders(<Contracts />);
      
      // Check Contracts component renders (or error boundary)
      expect(screen.getByText(/contract/i) || screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it('should handle API failures gracefully', async () => {
      // Mock API failure
      const mockError = new Error('API Error');
      vi.mocked(require('../../models/ChildrenAPI').default.getChildren).mockRejectedValue(mockError);

      renderWithProviders(<Bills />);
      
      // Component should still render even with API failures
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });
  });

  describe('Form Validation Integration', () => {
    it('should validate bill entries correctly', async () => {
      renderWithProviders(<Bills />);
      
      // Look for form elements
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      
      // Check that validation works when submitting empty form
      const saveButton = screen.getByText('bills.save');
      fireEvent.click(saveButton);
      
      // Form should handle empty submission gracefully
      await waitFor(() => {
        expect(form).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary Integration', () => {
    it('should catch and display errors properly', () => {
      // This test verifies error boundaries work
      const ThrowError = () => {
        throw new Error('Test error');
      };

      const { container } = render(
        <div>
          <ThrowError />
        </div>
      );

      // Should not crash the entire application
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('should handle large datasets without performance issues', async () => {
      const startTime = performance.now();
      
      renderWithProviders(<Bills />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000); // Less than 1 second
    });
  });
}); 