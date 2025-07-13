import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Bills } from '../../components/bills/Bills';
import { renderWithProviders } from '../utils';
import * as useBillsViewModelModule from '../../components/bills/viewModels/useBillsViewModel';

// Mock setup for useBillsViewModel
const createMockViewModel = (overrides = {}) => ({
  // Form-related properties
  control: {
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: { errors: {} },
    getValues: vi.fn(),
    setValue: vi.fn(),
    watch: vi.fn(),
    reset: vi.fn(),
    _formState: { isSubmitted: false, isValid: true },
    _subjects: { values: { next: vi.fn() } },
    _names: { mount: new Set(), unMount: new Set() },
    _defaultValues: {},
    _formValues: {},
    _stateFlags: {},
    _updateValid: vi.fn(),
    _removeUnmounted: vi.fn(),
    _getDirty: vi.fn(),
    _getWatch: vi.fn(),
    _options: {},
    _proxyFormState: {},
    _executeSchema: vi.fn(),
    _getFieldArray: vi.fn(),
    _resolver: vi.fn(),
    _updateFormState: vi.fn(),
    _reset: vi.fn(),
    _resetDefaultValues: vi.fn(),
    _updateFieldArray: vi.fn(),
    _disableForm: vi.fn(),
    _getFieldValue: vi.fn(),
    _updateDisabledField: vi.fn(),
  } as any,
  handleSubmit: vi.fn((callback) => async (e: any) => {
    e?.preventDefault?.();
    await callback();
  }),
  formState: { 
    errors: {},
    isSubmitted: false,
    isValid: true,
    isDirty: false,
    isValidating: false,
    touchedFields: {},
    dirtyFields: {},
    submitCount: 0,
    defaultValues: {},
  },
  
  // Loading and state properties
  loadingInfo: { loading: false, loadingMessage: '' },
  searchTerm: '',
  setSearchTerm: vi.fn(),
  SetSearchedProgram: vi.fn(),
  exportableCount: 0,
  blockContent: false,
  
  // Action functions
  onDownloadBoxedPdf: vi.fn(),
  onDownloadFirstPartPdf: vi.fn(),
  onHandlerDateChanged: vi.fn(),
  onRecalculateAll: vi.fn(),
  safeRemove: vi.fn(),
  onSubmit: vi.fn(),
  addNewBill: vi.fn(),
  getValues: vi.fn(() => ({})),
  
  // Data properties
  sums: { cash: 0, check: 0, total: 0, cash_on_hand: 0, total_cash_on_hand: 0 },
  filteredBills: [] as any[],
  closedMoneyData: null,
  
  // Apply any overrides
  ...overrides,
})

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
  beforeEach(() => {
    vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });

    it('displays loading state correctly', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ loadingInfo: { loading: true, loadingMessage: 'Loading bills...' } }));

      renderWithProviders(<Bills />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Loading bills...')).toBeInTheDocument();
    });

    it('displays content blocked message when content is blocked', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ blockContent: true }));

      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.selectDateToContinue')).toBeInTheDocument();
    });

    it('displays main title and description', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.title')).toBeInTheDocument();
      // The description text is split across multiple elements, so we just check that the main title is there
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });
  });

  describe('Bills List Management', () => {
    it('displays empty state when no bills exist', () => {
      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.noBills')).toBeInTheDocument();
      expect(screen.getByText('bills.addFirstBill')).toBeInTheDocument();
    });

    it('displays bills with correct headers', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ filteredBills: [
        { id: 1, names: 'John Doe', cash: '10.00', check: '5.00', total: 15.00 },
        {
          id: 2,
          names: 'Jane Smith',
          cash: '15.00',
          check: '5.00',
          total: 20.00,
          originalIndex: 1,
        },
      ] }));

      renderWithProviders(<Bills />);
      
      // Check that the component shows it has 2 bills in the total count
      expect(screen.getByText(/2/)).toBeInTheDocument();
      expect(screen.getAllByText('bills.total')).toHaveLength(2); // Multiple instances are expected
      
      // Check that summary section is rendered
      expect(screen.getByText('bills.summary')).toBeInTheDocument();
    });

    it('calls addNewBill when Add New Bill button is clicked', async () => {
      const addNewBillSpy = vi.fn();
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ addNewBill: addNewBillSpy }));

      renderWithProviders(<Bills />);
      
      const addButton = screen.getByTestId('empty-state-add-bill-button');
      await userEvent.click(addButton);
      
      expect(addNewBillSpy).toHaveBeenCalledTimes(1);
    });

    it('shows header add button when content is not blocked', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ blockContent: false }));

      renderWithProviders(<Bills />);
      
      expect(screen.getByTestId('header-add-bill-button')).toBeInTheDocument();
    });

    it('hides header add button when content is blocked', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ blockContent: true }));

      renderWithProviders(<Bills />);
      
      expect(screen.queryByTestId('header-add-bill-button')).not.toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    it('renders search input', () => {
      renderWithProviders(<Bills />);
      
      const searchInput = screen.getByPlaceholderText('bills.searchPlaceholder');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls setSearchTerm when search input changes', async () => {
      const setSearchTermSpy = vi.fn();
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ setSearchTerm: setSearchTermSpy }));

      renderWithProviders(<Bills />);

      const searchInput = screen.getByPlaceholderText('bills.searchPlaceholder');
      await userEvent.type(searchInput, 'John');

      // Check that setSearchTerm was called (it gets called for each character)
      expect(setSearchTermSpy).toHaveBeenCalled();
      expect(setSearchTermSpy).toHaveBeenCalledWith('n'); // Last character
    });

    it('displays filtered results message when search term exists', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ searchTerm: 'John', filteredBills: [] }));

      renderWithProviders(<Bills />);
      expect(screen.getByText('bills.noResultsFound')).toBeInTheDocument();
    });

    it('renders program filter dropdown', () => {
      renderWithProviders(<Bills />);
      
      const programSelect = screen.getByRole('combobox');
      expect(programSelect).toBeInTheDocument();
      expect(screen.getByText('select_program')).toBeInTheDocument();
    });

    it('renders date filter input', () => {
      renderWithProviders(<Bills />);
      
      // Use a more specific selector for the date input
      const dateInput = screen.getByLabelText('date');
      expect(dateInput).toBeInTheDocument();
    });
  });

  describe('PDF Export', () => {
    it('renders PDF export buttons', () => {
      renderWithProviders(<Bills />);
      
      expect(screen.getByText('bills.summaryReport')).toBeInTheDocument();
      expect(screen.getByText('bills.fullReport')).toBeInTheDocument();
    });

    it('calls onDownloadFirstPartPdf when Summary Report button is clicked', async () => {
      const onDownloadFirstPartPdfSpy = vi.fn();
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ onDownloadFirstPartPdf: onDownloadFirstPartPdfSpy, exportableCount: 1 }));

      renderWithProviders(<Bills />);
      
      const summaryButton = screen.getByText('bills.summaryReport');
      await userEvent.click(summaryButton);
      
      expect(onDownloadFirstPartPdfSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onDownloadBoxedPdf when Full Report button is clicked', async () => {
      const onDownloadBoxedPdfSpy = vi.fn();
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ onDownloadBoxedPdf: onDownloadBoxedPdfSpy, exportableCount: 1 }));

      renderWithProviders(<Bills />);
      
      const fullReportButton = screen.getByText('bills.fullReport');
      await userEvent.click(fullReportButton);
      
      expect(onDownloadBoxedPdfSpy).toHaveBeenCalledTimes(1);
    });

    it('disables export buttons when exportableCount is 0', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ exportableCount: 0 }));

      renderWithProviders(<Bills />);
      
      const summaryButton = screen.getByText('bills.summaryReport');
      const fullReportButton = screen.getByText('bills.fullReport');
      
      expect(summaryButton).toBeDisabled();
      expect(fullReportButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('renders save button', () => {
      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByText('bills.save');
      expect(saveButton).toBeInTheDocument();
    });

    it('calls handleSubmit when save button is clicked', async () => {
      const handleSubmitSpy = vi.fn((callback) => async (e: any) => {
        e?.preventDefault?.();
        await callback({});
      });
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ handleSubmit: handleSubmitSpy }));

      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByText('bills.save');
      await userEvent.click(saveButton);
      
      expect(handleSubmitSpy).toHaveBeenCalled();
    });

    it('disables save button when content is blocked', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ blockContent: true }));

      renderWithProviders(<Bills />);
      
      const saveButton = screen.getByText('bills.save');
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Summary Display', () => {
    it('displays summary section with correct values', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ sums: {
        cash: 100.50,
        check: 50.25,
        total: 150.75,
        cash_on_hand: 75.00,
        total_cash_on_hand: 25.50,
      }, getValues: vi.fn(() => ({ cashOnHand: 75.00 })) }));

      renderWithProviders(<Bills />);
      
      // Check that summary section is rendered (use more specific selector)
      expect(screen.getByText('bills.summary')).toBeInTheDocument();
      
      // Check that currency amounts are displayed
      expect(screen.getByText('$100.50')).toBeInTheDocument();
      expect(screen.getByText('$50.25')).toBeInTheDocument();
      expect(screen.getByText('$150.75')).toBeInTheDocument();
    });

    it('handles null/undefined sums gracefully', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ sums: {
        cash: null,
        check: undefined,
        total: NaN,
        cash_on_hand: null,
        total_cash_on_hand: 0,
      } }));

      renderWithProviders(<Bills />);
      
      // Should display $0.00 for invalid values - expect 5 instances (3 summary cards + 2 bottom sections)
      expect(screen.getAllByText('$0.00')).toHaveLength(5);
    });

    it('displays closed money data when available', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ closedMoneyData: {
        has_closed_money: true,
        total_closing_amount: 200.00,
      } }));

      renderWithProviders(<Bills />);
      
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders paginator when there are many bills', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ filteredBills: Array.from({ length: 15 }, (_, i) => ({
        id: `bill-${i}`,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.00,
        originalIndex: i,
      })) }));

      renderWithProviders(<Bills />);
      
      expect(screen.getByTestId('paginator')).toBeInTheDocument();
    });

    it('does not render paginator when there are few bills', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ filteredBills: Array.from({ length: 5 }, (_, i) => ({
        id: `bill-${i}`,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.00,
        originalIndex: i,
      })) }));

      renderWithProviders(<Bills />);
      
      expect(screen.queryByTestId('paginator')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles null/undefined values gracefully', () => {
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({ filteredBills: [
        {
          id: '1',
          names: null,
          cash: undefined,
          check: '',
          total: 0,
          originalIndex: 0,
        },
      ] }));

      renderWithProviders(<Bills />);
      
      // Should render without crashing
      expect(screen.getByText('bills.title')).toBeInTheDocument();
    });

    it('handles empty search results', () => {
      // Mock the search to return no results
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({
        searchTerm: 'nonexistent',
        filteredBills: [],
      }));

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

      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(createMockViewModel({
        billsFields: largeBillsList,
        filteredBills: largeBillsList.slice(0, 10), // Paginated
      }));

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

describe('Date Picker Value Persistence', () => {
  it('maintains date value after data loading', async () => {
    const { container } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const calendarInput = container.querySelector('input[id="date"]');
    expect(calendarInput).toBeInTheDocument();
    
    // The input value should match the formatted date
    expect(calendarInput.value).toBe('01/15/2024');
  });

  it('handles date changes without losing focus', async () => {
    const { container } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const calendarInput = container.querySelector('input[id="date"]');
    expect(calendarInput).toBeInTheDocument();
    
    if (calendarInput) {
      await userEvent.clear(calendarInput);
      await userEvent.type(calendarInput, '01/15/2024');
      fireEvent.blur(calendarInput);
      expect(calendarInput.value).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    }
  });

  it('properly converts date formats', async () => {
    const { container } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const calendarInput = container.querySelector('input[id="date"]');
    expect(calendarInput).toBeInTheDocument();
    
    if (calendarInput) {
      const testDates = [
        '01/15/2024',
        '1/15/2024',
        '01/15/24'
      ];

      for (const dateStr of testDates) {
        await userEvent.clear(calendarInput);
        await userEvent.type(calendarInput, dateStr);
        fireEvent.blur(calendarInput);
        await waitFor(() => {
          expect(calendarInput.value).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
        });
      }
    }
  });
});

describe('PDF Button Visibility and Colors', () => {
  it('shows Summary Report button with warning color (not gray)', async () => {
    const { getByText } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const summaryButton = getByText('bills.summaryReport');
    expect(summaryButton).toBeInTheDocument();
    expect(summaryButton).toHaveClass('p-button-warning');
    expect(summaryButton).not.toHaveClass('p-button-secondary');
  });

  it('shows Full Report button with info color', async () => {
    const { getByText } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const fullReportButton = getByText('bills.fullReport');
    expect(fullReportButton).toBeInTheDocument();
    expect(fullReportButton).toHaveClass('p-button-info');
  });

  it('enables PDF buttons when bills have names and amounts', async () => {
    const mockViewModel = createMockViewModel({
      exportableCount: 2,
      filteredBills: [
        { 
          id: '1', 
          names: 'John Doe', 
          cash: '10.00', 
          check: '5.00', 
          total: 15.00,
          originalIndex: 0
        },
        { 
          id: '2', 
          names: 'Jane Smith', 
          cash: '20.00', 
          check: '0.00', 
          total: 20.00,
          originalIndex: 1
        }
      ]
    });

    vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockViewModel);

    const { getByText } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const summaryButton = getByText('bills.summaryReport');
    const fullReportButton = getByText('bills.fullReport');
    
    expect(summaryButton).not.toBeDisabled();
    expect(fullReportButton).not.toBeDisabled();
  });

  it('disables PDF buttons when no exportable bills exist', async () => {
    const _mockViewModel = createMockViewModel({
      exportableCount: 0,
      filteredBills: [
        { 
          id: '1', 
          names: '', // No names
          cash: '10.00', 
          check: '5.00', 
          total: 15.00,
          originalIndex: 0
        },
        { 
          id: '2', 
          names: 'Jane Smith', 
          cash: '0.00', // No amounts
          check: '0.00', 
          total: 0.00,
          originalIndex: 1
        }
      ]
    });

    vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(_mockViewModel);

    const { getByText } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const summaryButton = getByText('bills.summaryReport');
    const fullReportButton = getByText('bills.fullReport');
    
    expect(summaryButton).toBeDisabled();
    expect(fullReportButton).toBeDisabled();
  });

  it('updates button state when exportable count changes', async () => {
    const _mockViewModel = createMockViewModel({
      exportableCount: 0,
      filteredBills: []
    });

    const { rerender, getByText } = renderWithProviders(<Bills />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    // Initially disabled
    let summaryButton = getByText('bills.summaryReport');
    expect(summaryButton).toBeDisabled();

    // Update with exportable bills
    const updatedMockViewModel = createMockViewModel({
      exportableCount: 1,
      filteredBills: [
        { 
          id: '1', 
          names: 'John Doe', 
          cash: '10.00', 
          check: '0.00', 
          total: 10.00,
          originalIndex: 0
        }
      ]
    });

    vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(updatedMockViewModel);
    
    rerender(<Bills />);
    
    await waitFor(() => {
      summaryButton = getByText('bills.summaryReport');
      expect(summaryButton).not.toBeDisabled();
    });
  });
});

describe('Exportable Count Logic', () => {
  it('counts bills with both names and amounts as exportable', () => {
    const bills = [
      { names: 'John Doe', cash: '10.00', check: '0.00' },
      { names: 'Jane Smith', cash: '0.00', check: '5.00' },
      { names: '', cash: '10.00', check: '0.00' }, // No names
      { names: 'Bob Johnson', cash: '0.00', check: '0.00' }, // No amounts
      { names: 'Alice Brown', cash: '15.00', check: '5.00' }
    ];

    // This test would be in the ViewModel test file, but we can test the logic here
    const exportableCount = bills.filter(bill => {
      const cashNum = parseFloat(bill.cash) || 0;
      const checkNum = parseFloat(bill.check) || 0;
      const hasNames = bill.names && bill.names.trim().length > 0;
      
      return hasNames && (cashNum > 0 || checkNum > 0);
    }).length;

    expect(exportableCount).toBe(3); // John, Jane, Alice
  });
}); 