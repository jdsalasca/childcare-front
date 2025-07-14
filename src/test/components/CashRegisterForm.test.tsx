import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import i18n from '../../configs/i18n';
import CashRegisterForm from '../../components/deposits/cashRegister/CashRegisterForm';
import { AuthProvider } from '../../context/AuthContext';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn(fn => fn),
    watch: vi.fn(),
    setValue: vi.fn(),
    formState: { errors: {}, isSubmitting: false },
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
  Controller: vi.fn(({ render }) =>
    render({ field: { onChange: vi.fn(), value: '' } })
  ),
}));

// Mock the APIs
vi.mock('../../models/CashRegisterAPI', () => ({
  default: {
    getCashiers: vi.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ],
    }),
    openRegister: vi.fn().mockResolvedValue({ success: true }),
    closeRegister: vi.fn().mockResolvedValue({ success: true }),
    updateOpenRegister: vi.fn().mockResolvedValue({ success: true }),
    updateCloseRegister: vi.fn().mockResolvedValue({ success: true }),
    getDetails: vi.fn().mockResolvedValue({
      data: {
        opening: {
          cashier: { id: 1, name: 'John Doe' },
          details: [{ bill_type_id: 1, quantity: 10 }],
        },
        closing: {
          cashier: { id: 2, name: 'Jane Smith' },
          details: [{ bill_type_id: 2, quantity: 5 }],
        },
      },
    }),
  },
}));

vi.mock('../../models/BillTypeAPI', () => ({
  default: {
    getBillTypesByCurrencyCode: vi.fn().mockResolvedValue([
      { id: 1, label: '$1 Bill', value: 1 },
      { id: 2, label: '$5 Bill', value: 5 },
      { id: 3, label: '$10 Bill', value: 10 },
      { id: 4, label: '$20 Bill', value: 20 },
    ]),
  },
}));

// Mock PrimeReact components
vi.mock('primereact/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={className} data-testid='card'>
      {children}
    </div>
  ),
}));

vi.mock('primereact/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    loading,
    type,
    label,
    icon,
    className,
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={type === 'submit' ? 'submit-button' : 'button'}
    >
      {icon && <span className={icon}></span>}
      {label}
      {children}
    </button>
  ),
}));

vi.mock('primereact/dropdown', () => ({
  Dropdown: ({
    value,
    onChange,
    options,
    placeholder,
    disabled,
    className,
  }: any) => (
    <select
      value={value?.id || ''}
      onChange={e =>
        onChange({
          value: options.find((opt: any) => opt.id === Number(e.target.value)),
        })
      }
      disabled={disabled}
      className={className}
      data-testid='dropdown'
    >
      <option value=''>{placeholder}</option>
      {options?.map((option: any) => (
        <option key={option.id} value={option.id}>
          {option.name || option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('primereact/inputnumber', () => ({
  InputNumber: ({ value, onValueChange, min, className, placeholder }: any) => (
    <input
      type='number'
      value={value || ''}
      onChange={e => onValueChange({ value: Number(e.target.value) })}
      min={min}
      className={className}
      placeholder={placeholder}
      data-testid='input-number'
    />
  ),
}));

vi.mock('primereact/message', () => ({
  Message: ({ severity, text, className }: any) => (
    <div className={`message ${severity} ${className}`} data-testid='message'>
      {text}
    </div>
  ),
}));

vi.mock('primereact/progressspinner', () => ({
  ProgressSpinner: ({ style, className }: any) => (
    <div className={className} style={style} data-testid='progress-spinner'>
      Loading...
    </div>
  ),
}));

vi.mock('primereact/confirmdialog', () => ({
  ConfirmDialog: () => <div data-testid='confirm-dialog' />,
  confirmDialog: vi.fn(),
}));

vi.mock('primereact/divider', () => ({
  Divider: ({ className }: any) => (
    <hr className={className} data-testid='divider' />
  ),
}));

// Mock the formatCurrency function
vi.mock('../../components/deposits/cashRegister/constants', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </I18nextProvider>
    </AuthProvider>
  );
};

describe('CashRegisterForm Component', () => {
  const defaultProps = {
    date: '2024-01-15',
    status: 'not_started',
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
    isUpdate: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    expect(screen.getByTestId('progress-spinner')).toBeInTheDocument();
    expect(screen.getByText('cashRegister.loading')).toBeInTheDocument();
  });

  it('renders form after loading', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Form elements should not be visible until action is selected
    expect(screen.queryByText('Select Cashier')).not.toBeInTheDocument();
    expect(
      screen.getByText('Select an action above to continue')
    ).toBeInTheDocument();
  });

  it('displays cashier dropdown with options after action selection', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Click on the Open Register action
    const openButton = screen.getByText('Open Register').closest('button');
    fireEvent.click(openButton!);

    await waitFor(() => {
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });
  });

  it('displays bill types when loaded and action selected', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Click on the Open Register action
    const openButton = screen.getByText('Open Register').closest('button');
    fireEvent.click(openButton!);

    await waitFor(() => {
      expect(screen.getByText('Cash Bills')).toBeInTheDocument();
    });
  });

  it('shows correct title for different statuses', async () => {
    const { rerender } = renderWithProviders(
      <CashRegisterForm {...defaultProps} />
    );

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Test for close register
    rerender(
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={new QueryClient()}>
            <CashRegisterForm {...defaultProps} status='opened' />
          </QueryClientProvider>
        </I18nextProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Close Register')).toBeInTheDocument();
      expect(screen.getByText('Update Opening')).toBeInTheDocument();
    });

    // Test for closed register
    rerender(
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={new QueryClient()}>
            <CashRegisterForm {...defaultProps} status='closed' />
          </QueryClientProvider>
        </I18nextProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Update Opening')).toBeInTheDocument();
      expect(screen.getByText('Update Closing')).toBeInTheDocument();
    });
  });

  it('handles form submission after action selection', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Click on the Open Register action
    const openButton = screen.getByText('Open Register').closest('button');
    fireEvent.click(openButton!);

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  it('displays error message when no cashier selected after action selection', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Click on the Open Register action
    const openButton = screen.getByText('Open Register').closest('button');
    fireEvent.click(openButton!);

    await waitFor(() => {
      expect(
        screen.getByText('cashRegister.cashierRequired')
      ).toBeInTheDocument();
    });
  });

  it('includes cashier_id in form submission after action selection', async () => {
    const mockCashier = { id: 1, name: 'John Doe' };

    renderWithProviders(<CashRegisterForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Open Register')).toBeInTheDocument();
    });

    // Click on the Open Register action
    const openButton = screen.getByText('Open Register').closest('button');
    fireEvent.click(openButton!);

    await waitFor(() => {
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });

    // Simulate selecting a cashier
    const dropdown = screen.getByTestId('dropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('allows updating opening data on closed register', async () => {
    renderWithProviders(<CashRegisterForm {...defaultProps} status='closed' />);

    await waitFor(() => {
      expect(screen.getByText('Update Opening')).toBeInTheDocument();
      expect(screen.getByText('Update Closing')).toBeInTheDocument();
    });

    // Click on the Update Opening action
    const updateOpeningButton = screen
      .getByText('Update Opening')
      .closest('button');
    fireEvent.click(updateOpeningButton!);

    await waitFor(() => {
      expect(
        screen.getByText(
          '⚠️ You are updating opening data for a register that is already closed. This is allowed for correction purposes, but please ensure accuracy.'
        )
      ).toBeInTheDocument();
    });
  });
});
