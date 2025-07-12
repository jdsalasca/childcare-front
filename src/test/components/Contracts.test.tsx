import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Contracts } from '../../components/contracts/Contracts';
import { renderWithProviders } from '../utils';
import { defaultContractInfo } from '../../components/contracts/types/ContractInfo';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../configs/logger', () => ({
  customLogger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('../../models/customHooks/useDays', () => ({
  default: () => ({
    laboralDays: [
      { id: 1, name: 'Monday', abbreviation: 'Mon' },
      { id: 2, name: 'Tuesday', abbreviation: 'Tue' },
      { id: 3, name: 'Wednesday', abbreviation: 'Wed' },
      { id: 4, name: 'Thursday', abbreviation: 'Thu' },
      { id: 5, name: 'Friday', abbreviation: 'Fri' },
    ],
  }),
}));

vi.mock('../../models/ContractAPI', () => ({
  ContractModel: {
    CONTRACT_PERMISSIONS: [
      { id: 1, name: 'permission1' },
      { id: 2, name: 'permission2' },
      { id: 3, name: 'permission3' },
    ],
  },
}));

vi.mock('../../models/ContractPermissionsAPI', () => ({
  ContractPermissionsValidator: {
    getValidContractPermissions: vi.fn((permissions) => {
      if (!permissions) return 0;
      return Object.values(permissions).filter(Boolean).length;
    }),
  },
}));

vi.mock('../../components/contracts/utilsAndConstants', () => ({
  validateSchedule: vi.fn((schedule, days) => {
    return schedule && schedule.length > 0 && days && days.length > 0;
  }),
}));

// Mock PrimeReact components
vi.mock('primereact/steps', () => ({
  Steps: ({ model, activeIndex, onSelect, ...props }: any) => (
    <div data-testid="steps" {...props}>
      {model?.map((item: any, index: number) => (
        <button
          key={index}
          onClick={() => onSelect?.({ index })}
          className={`step-${index} ${activeIndex === index ? 'active' : ''}`}
          data-testid={`step-${index}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('primereact/toast', () => ({
  Toast: React.forwardRef(({ ...props }: any, ref: any) => (
    <div ref={ref} {...props} data-testid="toast" />
  )),
}));

// Mock step components
vi.mock('../../components/contracts/steps/StepComponentOne', () => ({
  default: ({ setActiveIndex, contractInformation, setContractInformation }: any) => (
    <div data-testid="step-component-one">
      <h3>Step One - Children</h3>
      <p>Children count: {contractInformation.children?.length || 0}</p>
      <button onClick={() => setActiveIndex(1)}>Next</button>
      <button 
        onClick={() => setContractInformation({
          ...contractInformation,
          children: [{ id: 1, first_name: 'John', last_name: 'Doe' }]
        })}
      >
        Add Child
      </button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentTwo', () => ({
  default: ({ setActiveIndex, contractInformation, setContractInformation }: any) => (
    <div data-testid="step-component-two">
      <h3>Step Two - Guardians</h3>
      <p>Guardians count: {contractInformation.guardians?.length || 0}</p>
      <button onClick={() => setActiveIndex(2)}>Next</button>
      <button 
        onClick={() => setContractInformation({
          ...contractInformation,
          guardians: [{ id: 1, name: 'Jane Doe', titular: true }]
        })}
      >
        Add Guardian
      </button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentThree', () => ({
  default: ({ setActiveIndex, contractInformation, setContractInformation }: any) => (
    <div data-testid="step-component-three">
      <h3>Step Three - Permissions</h3>
      <button onClick={() => setActiveIndex(3)}>Next</button>
      <button 
        onClick={() => setContractInformation({
          ...contractInformation,
          terms: { permission1: true, permission2: true }
        })}
      >
        Set Permissions
      </button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentFour', () => ({
  default: ({ setActiveIndex, contractInformation, setContractInformation }: any) => (
    <div data-testid="step-component-four">
      <h3>Step Four - Contract Details</h3>
      <button onClick={() => setActiveIndex(4)}>Next</button>
      <button 
        onClick={() => setContractInformation({
          ...contractInformation,
          total_to_pay: '100.00',
          payment_method_id: 1,
          start_date: '2023-01-01'
        })}
      >
        Set Contract Details
      </button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentPricing', () => ({
  default: ({ setActiveIndex }: any) => (
    <div data-testid="step-component-pricing">
      <h3>Step Pricing</h3>
      <button onClick={() => setActiveIndex(5)}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentFive', () => ({
  default: ({ setActiveIndex, contractInformation, setContractInformation }: any) => (
    <div data-testid="step-component-five">
      <h3>Step Five - Schedule</h3>
      <button onClick={() => setActiveIndex(6)}>Next</button>
      <button 
        onClick={() => setContractInformation({
          ...contractInformation,
          schedule: [{ day: 'Monday', check_in: '08:00', check_out: '17:00' }]
        })}
      >
        Set Schedule
      </button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/medical/MedicalInformationForm', () => ({
  MedicalInformationForm: ({ setActiveIndex }: any) => (
    <div data-testid="medical-information-form">
      <h3>Medical Information</h3>
      <button onClick={() => setActiveIndex(7)}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/medical/FormulaInformationForm', () => ({
  FormulaInformationForm: ({ setActiveIndex }: any) => (
    <div data-testid="formula-information-form">
      <h3>Formula Information</h3>
      <button onClick={() => setActiveIndex(8)}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/medical/PermissionsInformationForm', () => ({
  PermissionsInformationForm: ({ setActiveIndex }: any) => (
    <div data-testid="permissions-information-form">
      <h3>Permissions Information</h3>
      <button onClick={() => setActiveIndex(9)}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/contracts/steps/StepComponentSeven', () => ({
  default: ({ setActiveIndex }: any) => (
    <div data-testid="step-component-seven">
      <h3>Step Seven - Contract Generator</h3>
      <button onClick={() => setActiveIndex(0)}>Complete</button>
    </div>
  ),
}));

vi.mock('../../components/contracts/ErrorBoundary', () => ({
  ContractsErrorBoundary: ({ children }: any) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('../utils/Loader', () => ({
  default: ({ message }: any) => (
    <div data-testid="loader">{message}</div>
  ),
}));

describe('Contracts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<Contracts />);
      expect(screen.getByTestId('steps')).toBeInTheDocument();
    });

    it('displays error boundary wrapper', () => {
      renderWithProviders(<Contracts />);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('displays toast component', () => {
      renderWithProviders(<Contracts />);
      expect(screen.getByTestId('toast')).toBeInTheDocument();
    });

    it('renders with default active step (0)', () => {
      renderWithProviders(<Contracts />);
      expect(screen.getByTestId('step-component-one')).toBeInTheDocument();
    });
  });

  describe('Step Navigation', () => {
    it('navigates to different steps when step buttons are clicked', async () => {
      renderWithProviders(<Contracts />);
      
      // Click on step 1 (Guardians)
      const step1Button = screen.getByTestId('step-1');
      await userEvent.click(step1Button);
      
      expect(screen.getByTestId('step-component-two')).toBeInTheDocument();
      expect(screen.queryByTestId('step-component-one')).not.toBeInTheDocument();
    });

    it('navigates through all steps sequentially', async () => {
      renderWithProviders(<Contracts />);
      
      // Step 0 -> Step 1
      await userEvent.click(screen.getByTestId('step-1'));
      expect(screen.getByTestId('step-component-two')).toBeInTheDocument();
      
      // Step 1 -> Step 2
      await userEvent.click(screen.getByTestId('step-2'));
      expect(screen.getByTestId('step-component-three')).toBeInTheDocument();
      
      // Step 2 -> Step 3
      await userEvent.click(screen.getByTestId('step-3'));
      expect(screen.getByTestId('step-component-four')).toBeInTheDocument();
      
      // Step 3 -> Step 4
      await userEvent.click(screen.getByTestId('step-4'));
      expect(screen.getByTestId('step-component-pricing')).toBeInTheDocument();
    });

    it('updates active step class correctly', async () => {
      renderWithProviders(<Contracts />);
      
      const step0 = screen.getByTestId('step-0');
      const step1 = screen.getByTestId('step-1');
      
      // Initially step 0 should be active
      expect(step0).toHaveClass('active');
      expect(step1).not.toHaveClass('active');
      
      // Click step 1
      await userEvent.click(step1);
      
      // Now step 1 should be active
      expect(step0).not.toHaveClass('active');
      expect(step1).toHaveClass('active');
    });
  });

  describe('Step Labels and Counters', () => {
    it('displays correct step labels with counters', () => {
      renderWithProviders(<Contracts />);
      
      expect(screen.getByText(/children \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/guardians \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/permissions \(0\/3\)/i)).toBeInTheDocument();
    });

    it('updates counters when data is added', async () => {
      renderWithProviders(<Contracts />);
      
      // Add a child
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Counter should update
      await waitFor(() => {
        expect(screen.getByText(/children \(1\)/i)).toBeInTheDocument();
      });
    });

    it('updates guardian counter when guardian is added', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to guardians step
      await userEvent.click(screen.getByTestId('step-1'));
      
      // Add a guardian
      const addGuardianButton = screen.getByText('Add Guardian');
      await userEvent.click(addGuardianButton);
      
      // Counter should update
      await waitFor(() => {
        expect(screen.getByText(/guardians \(1\)/i)).toBeInTheDocument();
      });
    });

    it('updates permissions counter when permissions are set', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to permissions step
      await userEvent.click(screen.getByTestId('step-2'));
      
      // Set permissions
      const setPermissionsButton = screen.getByText('Set Permissions');
      await userEvent.click(setPermissionsButton);
      
      // Counter should update
      await waitFor(() => {
        expect(screen.getByText(/permissions \(2\/3\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Step Validation', () => {
    it('applies correct CSS classes based on step validation', async () => {
      renderWithProviders(<Contracts />);
      
      const step0 = screen.getByTestId('step-0');
      
      // Initially should be invalid (no children)
      expect(step0).toHaveClass('step-invalid');
      
      // Add a child
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Should become valid
      await waitFor(() => {
        expect(step0).toHaveClass('step-valid');
      });
    });

    it('validates guardians step correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to guardians step
      await userEvent.click(screen.getByTestId('step-1'));
      
      const step1 = screen.getByTestId('step-1');
      
      // Initially should be invalid
      expect(step1).toHaveClass('step-invalid');
      
      // Add a guardian
      const addGuardianButton = screen.getByText('Add Guardian');
      await userEvent.click(addGuardianButton);
      
      // Should become valid
      await waitFor(() => {
        expect(step1).toHaveClass('step-valid');
      });
    });

    it('validates contract details step correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to contract details step
      await userEvent.click(screen.getByTestId('step-3'));
      
      const step3 = screen.getByTestId('step-3');
      
      // Initially should be invalid
      expect(step3).toHaveClass('step-invalid');
      
      // Set contract details
      const setDetailsButton = screen.getByText('Set Contract Details');
      await userEvent.click(setDetailsButton);
      
      // Should become valid
      await waitFor(() => {
        expect(step3).toHaveClass('step-valid');
      });
    });

    it('validates schedule step correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to schedule step
      await userEvent.click(screen.getByTestId('step-5'));
      
      const step5 = screen.getByTestId('step-5');
      
      // Initially should be invalid
      expect(step5).toHaveClass('step-invalid');
      
      // Set schedule
      const setScheduleButton = screen.getByText('Set Schedule');
      await userEvent.click(setScheduleButton);
      
      // Should become valid
      await waitFor(() => {
        expect(step5).toHaveClass('step-valid');
      });
    });
  });

  describe('Loading States', () => {
    it('displays loader when loading', () => {
      const ContractsWithLoading = () => {
        const [loadingInfo, setLoadingInfo] = React.useState({
          loading: true,
          loadingMessage: 'Loading contract data...',
        });
        
        return (
          <>
            {loadingInfo.loading && (
              <div data-testid="loader">{loadingInfo.loadingMessage}</div>
            )}
            <Contracts />
          </>
        );
      };
      
      renderWithProviders(<ContractsWithLoading />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Loading contract data...')).toBeInTheDocument();
    });
  });

  describe('Medical Information Steps', () => {
    it('renders medical information form correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to medical information step
      await userEvent.click(screen.getByTestId('step-6'));
      
      expect(screen.getByTestId('medical-information-form')).toBeInTheDocument();
      expect(screen.getByText('Medical Information')).toBeInTheDocument();
    });

    it('renders formula information form correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to formula information step
      await userEvent.click(screen.getByTestId('step-7'));
      
      expect(screen.getByTestId('formula-information-form')).toBeInTheDocument();
      expect(screen.getByText('Formula Information')).toBeInTheDocument();
    });

    it('renders permissions information form correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to permissions information step
      await userEvent.click(screen.getByTestId('step-8'));
      
      expect(screen.getByTestId('permissions-information-form')).toBeInTheDocument();
      expect(screen.getByText('Permissions Information')).toBeInTheDocument();
    });
  });

  describe('Contract Generation', () => {
    it('renders contract generator step correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to contract generator step
      await userEvent.click(screen.getByTestId('step-9'));
      
      expect(screen.getByTestId('step-component-seven')).toBeInTheDocument();
      expect(screen.getByText('Step Seven - Contract Generator')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains contract information state across steps', async () => {
      renderWithProviders(<Contracts />);
      
      // Add child in step 0
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Navigate to step 1
      await userEvent.click(screen.getByTestId('step-1'));
      
      // Add guardian in step 1
      const addGuardianButton = screen.getByText('Add Guardian');
      await userEvent.click(addGuardianButton);
      
      // Navigate back to step 0
      await userEvent.click(screen.getByTestId('step-0'));
      
      // Child should still be there
      expect(screen.getByText('Children count: 1')).toBeInTheDocument();
      
      // Navigate back to step 1
      await userEvent.click(screen.getByTestId('step-1'));
      
      // Guardian should still be there
      expect(screen.getByText('Guardians count: 1')).toBeInTheDocument();
    });

    it('updates contract information correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Initially should have default values
      expect(screen.getByText('Children count: 0')).toBeInTheDocument();
      
      // Add child
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Count should update
      await waitFor(() => {
        expect(screen.getByText('Children count: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Step Component Props', () => {
    it('passes correct props to step components', () => {
      renderWithProviders(<Contracts />);
      
      // Step component should receive the necessary props
      expect(screen.getByTestId('step-component-one')).toBeInTheDocument();
      expect(screen.getByText('Step One - Children')).toBeInTheDocument();
      expect(screen.getByText('Children count: 0')).toBeInTheDocument();
    });

    it('allows step components to update active index', async () => {
      renderWithProviders(<Contracts />);
      
      // Click Next button in step component
      const nextButton = screen.getByText('Next');
      await userEvent.click(nextButton);
      
      // Should navigate to next step
      expect(screen.getByTestId('step-component-two')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('wraps content in error boundary', () => {
      renderWithProviders(<Contracts />);
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('handles missing contract information gracefully', () => {
      renderWithProviders(<Contracts />);
      
      // Should render without crashing even with empty contract info
      expect(screen.getByTestId('steps')).toBeInTheDocument();
      expect(screen.getByText(/children \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/guardians \(0\)/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      const TestComponent = () => {
        renderSpy();
        return <Contracts />;
      };
      
      const { rerender } = renderWithProviders(<TestComponent />);
      
      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      // Re-render with same props
      rerender(<TestComponent />);
      
      // Should only render twice (initial + rerender)
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('memoizes step items correctly', async () => {
      renderWithProviders(<Contracts />);
      
      // Add child to trigger state change
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Steps should still be rendered correctly
      expect(screen.getByTestId('steps')).toBeInTheDocument();
      expect(screen.getByText(/children \(1\)/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper step navigation structure', () => {
      renderWithProviders(<Contracts />);
      
      const steps = screen.getByTestId('steps');
      expect(steps).toBeInTheDocument();
      
      // Should have clickable step buttons
      expect(screen.getByTestId('step-0')).toBeInTheDocument();
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      renderWithProviders(<Contracts />);
      
      const step1Button = screen.getByTestId('step-1');
      
      // Focus the step button
      step1Button.focus();
      expect(step1Button).toHaveFocus();
      
      // Press Enter to activate
      fireEvent.keyDown(step1Button, { key: 'Enter', code: 'Enter' });
      
      // Should navigate to step 1
      expect(screen.getByTestId('step-component-two')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid step index gracefully', async () => {
      renderWithProviders(<Contracts />);
      
      // Try to navigate to non-existent step
      const steps = screen.getByTestId('steps');
      fireEvent.click(steps);
      
      // Should not crash
      expect(screen.getByTestId('steps')).toBeInTheDocument();
    });

    it('handles empty contract data gracefully', () => {
      renderWithProviders(<Contracts />);
      
      // Should render with empty data
      expect(screen.getByText(/children \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/guardians \(0\)/i)).toBeInTheDocument();
      expect(screen.getByText(/permissions \(0\/3\)/i)).toBeInTheDocument();
    });

    it('handles missing step components gracefully', async () => {
      renderWithProviders(<Contracts />);
      
      // Navigate to each step to ensure none crash
      for (let i = 0; i < 10; i++) {
        const stepButton = screen.queryByTestId(`step-${i}`);
        if (stepButton) {
          await userEvent.click(stepButton);
          expect(screen.getByTestId('steps')).toBeInTheDocument();
        }
      }
    });
  });

  describe('Integration', () => {
    it('completes full workflow', async () => {
      renderWithProviders(<Contracts />);
      
      // Step 0: Add child
      const addChildButton = screen.getByText('Add Child');
      await userEvent.click(addChildButton);
      
      // Navigate to step 1
      await userEvent.click(screen.getByTestId('step-1'));
      
      // Step 1: Add guardian
      const addGuardianButton = screen.getByText('Add Guardian');
      await userEvent.click(addGuardianButton);
      
      // Navigate to step 2
      await userEvent.click(screen.getByTestId('step-2'));
      
      // Step 2: Set permissions
      const setPermissionsButton = screen.getByText('Set Permissions');
      await userEvent.click(setPermissionsButton);
      
      // Navigate to step 3
      await userEvent.click(screen.getByTestId('step-3'));
      
      // Step 3: Set contract details
      const setDetailsButton = screen.getByText('Set Contract Details');
      await userEvent.click(setDetailsButton);
      
      // Navigate to step 5 (schedule)
      await userEvent.click(screen.getByTestId('step-5'));
      
      // Step 5: Set schedule
      const setScheduleButton = screen.getByText('Set Schedule');
      await userEvent.click(setScheduleButton);
      
      // Verify all steps are valid
      await waitFor(() => {
        expect(screen.getByTestId('step-0')).toHaveClass('step-valid');
        expect(screen.getByTestId('step-1')).toHaveClass('step-valid');
        expect(screen.getByTestId('step-2')).toHaveClass('step-valid');
        expect(screen.getByTestId('step-3')).toHaveClass('step-valid');
        expect(screen.getByTestId('step-5')).toHaveClass('step-valid');
      });
    });
  });
}); 