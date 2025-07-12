import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Bills } from '../../components/bills/Bills';
import { renderWithProviders } from '../utils';
import * as useBillsViewModelModule from '../../components/bills/viewModels/useBillsViewModel';

// Create a comprehensive mock for the view model
const createMockViewModel = (overrides = {}) => ({
  control: {} as any,
  handleSubmit: vi.fn((callback) => (e: any) => {
    e?.preventDefault?.();
    callback({});
  }),
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
  getValues: vi.fn(() => ({ cashOnHand: 100 })),
  closedMoneyData: null,
  ...overrides,
} as any);

// Mock the view model hook
vi.mock('../../components/bills/viewModels/useBillsViewModel', () => ({
  useBillsViewModel: vi.fn(),
}));

// Mock PrimeReact components
vi.mock('primereact/button', () => ({
  Button: ({ children, onClick, disabled, label, icon, className, type, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      type={type}
      {...props}
    >
      {icon && <span className={icon}></span>}
      {label || children}
    </button>
  ),
}));

vi.mock('primereact/calendar', () => ({
  Calendar: ({ onChange, value, ...props }: any) => (
    <input
      type="date"
      onChange={(e) => onChange({ value: e.target.value ? new Date(e.target.value) : null })}
      value={value ? (value instanceof Date ? value.toISOString().split('T')[0] : value) : ''}
      {...props}
    />
  ),
}));

vi.mock('primereact/dropdown', () => ({
  Dropdown: ({ onChange, value, options, placeholder, ...props }: any) => (
    <select
      onChange={(e) => onChange({ value: e.target.value })}
      value={value || ''}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('primereact/inputtext', () => ({
  InputText: ({ onChange, value, placeholder, className, readOnly, ...props }: any) => (
    <input
      type="text"
      onChange={onChange}
      value={value || ''}
      placeholder={placeholder}
      className={className}
      readOnly={readOnly}
      {...props}
    />
  ),
}));

vi.mock('primereact/toast', () => ({
  Toast: React.forwardRef(({ ...props }: any, ref: any) => (
    <div ref={ref} {...props} data-testid="toast" />
  )),
}));

vi.mock('primereact/confirmdialog', () => ({
  ConfirmDialog: (props: any) => <div {...props} data-testid="confirm-dialog" />,
}));

vi.mock('primereact/paginator', () => ({
  Paginator: ({ onPageChange, first, rows, totalRecords, ...props }: any) => (
    <div data-testid="paginator" {...props}>
      <button onClick={() => onPageChange({ first: 0, rows })}>First</button>
      <button onClick={() => onPageChange({ first: first + rows, rows })}>Next</button>
      <span>
        {first + 1} - {Math.min(first + rows, totalRecords)} of {totalRecords}
      </span>
    </div>
  ),
}));

// Mock react-hook-form Controller
vi.mock('react-hook-form', () => ({
  Controller: ({ render, name, defaultValue }: any) => {
    const mockField = {
      value: defaultValue || '',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name,
    };
    const mockFieldState = {
      invalid: false,
      isTouched: false,
      isDirty: false,
      error: undefined,
    };
    return render({ field: mockField, fieldState: mockFieldState });
  },
}));

// Mock the Loader component
vi.mock('../../components/utils/Loader', () => ({
  default: ({ message }: { message: string }) => <div data-testid="loader">{message}</div>,
}));

// Mock classNames utility
vi.mock('classnames', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Bills Component', () => {
  let mockViewModel: any;

  beforeEach(() => {
    mockViewModel = createMockViewModel();
    vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText(/Children Bill Management/i)).toBeInTheDocument();
    });

    it('displays loading state correctly', () => {
      mockViewModel.loadingInfo = { loading: true, loadingMessage: 'Loading bills...' };
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Loading bills...')).toBeInTheDocument();
    });

    it('displays blocked content warning when content is blocked', () => {
      mockViewModel.blockContent = true;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      expect(screen.getByText(/Please select a date to continue/i)).toBeInTheDocument();
    });

    it('displays main title and description', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText(/Children Bill Management/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage daily payments and generate reports/i)).toBeInTheDocument();
    });
  });

  describe('Bills List Management', () => {
    it('displays empty state when no bills exist', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText(/No bills available/i)).toBeInTheDocument();
      expect(screen.getByText(/Add your first bill to get started/i)).toBeInTheDocument();
    });

    it('renders bills list when bills exist', () => {
      mockViewModel.filteredBills = [
        {
          id: '1',
          names: 'John Doe',
          cash: '10.00',
          check: '5.00',
          total: 15.00,
          originalIndex: 0,
        },
        {
          id: '2',
          names: 'Jane Smith',
          cash: '20.00',
          check: '0.00',
          total: 20.00,
          originalIndex: 1,
        },
      ];
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      // Check that bills table headers are rendered - use more specific selectors
      expect(screen.getByText('Names')).toBeInTheDocument();
      expect(screen.getByText('Cash')).toBeInTheDocument();
      expect(screen.getByText('Check')).toBeInTheDocument();
      // Use getAllByText for Total since it appears multiple times
      expect(screen.getAllByText('Total')).toHaveLength(2); // Once in header, once in summary
      
      // Check that the component shows it has 2 bills in the total count
      expect(screen.getByText(/2.*total/i)).toBeInTheDocument();
    });

    it('calls addNewBill when Add New Bill button is clicked', async () => {
      const addNewBillSpy = vi.fn();
      mockViewModel.addNewBill = addNewBillSpy;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const addButton = screen.getByTestId('empty-state-add-bill-button');
      await userEvent.click(addButton);
      
      expect(addNewBillSpy).toHaveBeenCalledTimes(1);
    });

    it('shows header add button when content is not blocked', () => {
      mockViewModel.blockContent = false;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      expect(screen.getByTestId('header-add-bill-button')).toBeInTheDocument();
    });

    it('hides header add button when content is blocked', () => {
      mockViewModel.blockContent = true;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      expect(screen.queryByTestId('header-add-bill-button')).not.toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    it('renders search input', () => {
      renderWithProviders(<Bills />);
      
      const searchInput = screen.getByPlaceholderText(/Search by child names/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('calls setSearchTerm when search input changes', async () => {
      const setSearchTermSpy = vi.fn();
      mockViewModel.setSearchTerm = setSearchTermSpy;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const searchInput = screen.getByPlaceholderText(/Search by child names/i);
      await userEvent.type(searchInput, 'John');

      expect(setSearchTermSpy).toHaveBeenCalled();
    });

    it('displays filtered results message when search term exists', () => {
      mockViewModel.searchTerm = 'John';
      mockViewModel.filteredBills = [];
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      expect(screen.getByText(/No bills found matching your search/i)).toBeInTheDocument();
    });

    it('renders program filter dropdown', () => {
      renderWithProviders(<Bills />);
      
      const programSelect = screen.getByRole('combobox');
      expect(programSelect).toBeInTheDocument();
      expect(screen.getByText('Select a program')).toBeInTheDocument();
    });

    it('renders date filter input', () => {
      renderWithProviders(<Bills />);
      
      // Use a more specific selector for the date input
      const dateInput = screen.getByLabelText(/Date/i);
      expect(dateInput).toBeInTheDocument();
    });
  });

  describe('PDF Export', () => {
    it('renders PDF export buttons', () => {
      renderWithProviders(<Bills />);
      
      expect(screen.getByText(/Summary Report/i)).toBeInTheDocument();
      expect(screen.getByText(/Full Report/i)).toBeInTheDocument();
    });

    it('calls onDownloadFirstPartPdf when Summary Report button is clicked', async () => {
      const onDownloadFirstPartPdfSpy = vi.fn();
      mockViewModel.onDownloadFirstPartPdf = onDownloadFirstPartPdfSpy;
      mockViewModel.exportableCount = 1;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const summaryButton = screen.getByText(/Summary Report/i);
      await userEvent.click(summaryButton);
      
      expect(onDownloadFirstPartPdfSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onDownloadBoxedPdf when Full Report button is clicked', async () => {
      const onDownloadBoxedPdfSpy = vi.fn();
      mockViewModel.onDownloadBoxedPdf = onDownloadBoxedPdfSpy;
      mockViewModel.exportableCount = 1;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const fullReportButton = screen.getByText(/Full Report/i);
      await userEvent.click(fullReportButton);
      
      expect(onDownloadBoxedPdfSpy).toHaveBeenCalledTimes(1);
    });

    it('disables export buttons when exportableCount is 0', () => {
      mockViewModel.exportableCount = 0;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const summaryButton = screen.getByText(/Summary Report/i);
      const fullReportButton = screen.getByText(/Full Report/i);
      
      expect(summaryButton).toBeDisabled();
      expect(fullReportButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('renders save button', () => {
      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).toBeInTheDocument();
    });

    it('calls handleSubmit when save button is clicked', async () => {
      const handleSubmitSpy = vi.fn((callback) => (e: any) => {
        e?.preventDefault?.();
        callback({});
      });
      mockViewModel.handleSubmit = handleSubmitSpy;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      await userEvent.click(saveButton);
      
      expect(handleSubmitSpy).toHaveBeenCalled();
    });

    it('disables save button when content is blocked', () => {
      mockViewModel.blockContent = true;
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Summary Display', () => {
    it('displays summary section with correct values', () => {
      mockViewModel.sums = {
        cash: 100.50,
        check: 50.25,
        total: 150.75,
        cash_on_hand: 75.00,
        total_cash_on_hand: 25.50,
      };
      mockViewModel.getValues = vi.fn(() => ({ cashOnHand: 75.00 }));
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      // Check that summary section is rendered (use more specific selector)
      expect(screen.getByText('Summary')).toBeInTheDocument();
      
      // Check that currency amounts are displayed
      expect(screen.getByText('$100.50')).toBeInTheDocument();
      expect(screen.getByText('$50.25')).toBeInTheDocument();
      expect(screen.getByText('$150.75')).toBeInTheDocument();
    });

    it('handles null/undefined sums gracefully', () => {
      mockViewModel.sums = {
        cash: null,
        check: undefined,
        total: NaN,
        cash_on_hand: null,
        total_cash_on_hand: 0,
      };
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      // Should display $0.00 for invalid values - expect 5 instances (3 summary cards + 2 bottom sections)
      expect(screen.getAllByText('$0.00')).toHaveLength(5);
    });

    it('displays closed money data when available', () => {
      mockViewModel.closedMoneyData = {
        has_closed_money: true,
        total_closing_amount: 200.00,
      };
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders paginator when there are many bills', () => {
      mockViewModel.filteredBills = Array.from({ length: 15 }, (_, i) => ({
        id: `bill-${i}`,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.00,
        originalIndex: i,
      }));
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      expect(screen.getByTestId('paginator')).toBeInTheDocument();
    });

    it('does not render paginator when there are few bills', () => {
      mockViewModel.filteredBills = Array.from({ length: 5 }, (_, i) => ({
        id: `bill-${i}`,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.00,
        originalIndex: i,
      }));
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles null/undefined values gracefully', () => {
      mockViewModel.filteredBills = [
        {
          id: '1',
          names: null,
          cash: undefined,
          check: '',
          total: 0,
          originalIndex: 0,
        },
      ];
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

      renderWithProviders(<Bills />);
      
      // Should render without crashing
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });

    it('handles empty search results', () => {
      // Mock the search to return no results
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue({
        ...mockViewModel,
        searchTerm: 'nonexistent',
        filteredBills: [],
      });

      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.noResultsFound')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeBillsList = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.00,
        program: 'Infant',
      }));

      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue({
        ...mockViewModel,
        billsFields: largeBillsList,
        filteredBills: largeBillsList.slice(0, 10), // Paginated
      });

      renderWithProviders(<Bills />);
      
      // Should render pagination controls
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates all components without errors', () => {
      renderWithProviders(<Bills />);

      // Check that all main sections are rendered using translation keys
      expect(screen.getByText('bills.title')).toBeInTheDocument();
      expect(screen.getByText('bills.filters')).toBeInTheDocument();
      expect(screen.getByText('bills.summary')).toBeInTheDocument();
      expect(screen.getByText('bills.save')).toBeInTheDocument();
    });
  });
}); 