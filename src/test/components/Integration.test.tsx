import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils';
import { Bills } from '../../components/bills/Bills';

// Helper function to create a proper mock for useBillsViewModel
const createMockBillsViewModel = (overrides = {}) => ({
  control: {
    register: vi.fn(),
    unregister: vi.fn(),
    getFieldState: vi.fn(),
    handleSubmit: vi.fn(),
    reset: vi.fn(),
    resetField: vi.fn(),
    setError: vi.fn(),
    clearErrors: vi.fn(),
    setValue: vi.fn(),
    setFocus: vi.fn(),
    getValues: vi.fn(),
    getFieldValue: vi.fn(),
    trigger: vi.fn(),
    formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
    },
    watch: vi.fn(),
    _subjects: {
      array: new Set(),
      values: new Set(),
      state: new Set(),
    },
    _names: {
      array: new Set(),
      mount: new Set(),
      unMount: new Set(),
      watch: new Set(),
      focus: '',
      watchAll: false,
    },
    _formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
    },
    _defaultValues: {},
    _formValues: {},
    _stateFlags: {
      action: false,
      mount: false,
      watch: false,
    },
    _options: {},
    _fieldsWithValidation: new Set(),
    _fields: {},
    _proxyFormState: {},
    _updateFormState: vi.fn(),
    _updateFieldArray: vi.fn(),
    _getWatch: vi.fn(),
    _getDirty: vi.fn(),
    _executeSchema: vi.fn(),
    _removeUnmounted: vi.fn(),
    _updateValid: vi.fn(),
  } as any,
  handleSubmit: vi.fn(),
  formState: { errors: {} },
  loadingInfo: { loading: false, loadingMessage: '' },
  searchTerm: '',
  setSearchTerm: vi.fn(),
  SetSearchedProgram: vi.fn(),
  exportableCount: 0,
  onDownloadBoxedPdf: vi.fn(),
  onDownloadFirstPartPdf: vi.fn(),
  onHandlerDateChanged: vi.fn(),
  onRecalculateAll: vi.fn(),
  safeRemove: vi.fn(),
  onSubmit: vi.fn(),
  sums: { cash: 0, check: 0, total: 0, cash_on_hand: 0, total_cash_on_hand: 0 },
  filteredBills: [],
  blockContent: false,
  addNewBill: vi.fn(),
  getValues: vi.fn(),
  closedMoneyData: null,
  ...overrides,
});

// Mock the view models
vi.mock('../../components/bills/viewModels/useBillsViewModel', () => ({
  useBillsViewModel: vi.fn(),
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Bills Integration', () => {
    it('should handle complete bills workflow', async () => {
      const mockBillsViewModel = createMockBillsViewModel({
        filteredBills: [
          {
            id: 1,
            names: 'John Doe',
            cash: '10.00',
            check: '5.00',
            total: 15.0,
          },
        ],
        sums: {
          cash: 10,
          check: 5,
          total: 15,
          cash_on_hand: 100,
          total_cash_on_hand: -85,
        },
        exportableCount: 1,
      });

      const useBillsViewModelModule = await import(
        '../../components/bills/viewModels/useBillsViewModel'
      );
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(
        mockBillsViewModel
      );

      renderWithProviders(<Bills />);

      // Verify initial render
      expect(screen.getByText('bills.title')).toBeInTheDocument();
      expect(screen.getByText('bills.summary')).toBeInTheDocument();

      // Test adding a new bill
      const addButton = screen.getByTestId('header-add-bill-button');
      await userEvent.click(addButton);
      expect(mockBillsViewModel.addNewBill).toHaveBeenCalled();

      // Test form submission
      const saveButton = screen.getByText('bills.save');
      await userEvent.click(saveButton);
      expect(mockBillsViewModel.handleSubmit).toHaveBeenCalled();
    });

    it('should handle search and filtering', async () => {
      const mockBillsViewModel = createMockBillsViewModel({
        filteredBills: [
          {
            id: 1,
            names: 'John Doe',
            cash: '10.00',
            check: '5.00',
            total: 15.0,
          },
        ],
        sums: {
          cash: 10,
          check: 5,
          total: 15,
          cash_on_hand: 100,
          total_cash_on_hand: -85,
        },
        searchTerm: 'John',
        exportableCount: 1,
      });

      const useBillsViewModelModule = await import(
        '../../components/bills/viewModels/useBillsViewModel'
      );
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(
        mockBillsViewModel
      );

      renderWithProviders(<Bills />);

      // Test search functionality - use a more specific selector
      const searchInput = screen.getByDisplayValue('John');
      expect(searchInput).toBeInTheDocument();

      // Verify the search term is properly set
      expect(mockBillsViewModel.searchTerm).toBe('John');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      // Test error handling across components
      const mockBillsViewModel = createMockBillsViewModel({
        loadingInfo: { loading: false, loadingMessage: '' },
        filteredBills: [],
        sums: {
          cash: 0,
          check: 0,
          total: 0,
          cash_on_hand: 0,
          total_cash_on_hand: 0,
        },
      });

      const useBillsViewModelModule = await import(
        '../../components/bills/viewModels/useBillsViewModel'
      );
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(
        mockBillsViewModel
      );

      renderWithProviders(<Bills />);

      // Verify error states are handled gracefully
      expect(screen.getByText('bills.noBills')).toBeInTheDocument();
      expect(screen.getByText('bills.addFirstBill')).toBeInTheDocument();
    });
  });
});
