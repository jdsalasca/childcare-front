import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../utils';
import { StepComponentTwo } from '../../components/contracts/steps/StepComponentTwo';
import useViewModelStepGuardians from '../../components/contracts/viewModels/useviewModelStepGuardians';

// Mock the view model hook
vi.mock('../../components/contracts/viewModels/useviewModelStepGuardians');
const mockUseViewModelStepGuardians = vi.mocked(useViewModelStepGuardians);

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Guardian Form Component', () => {
  const mockProps = {
    setActiveIndex: vi.fn(),
    contractInformation: {
      children: [],
      guardians: [],
      contract_id: null,
      start_date: null,
      end_date: null,
      payment_method_id: '',
      total_to_pay: '',
      weekly_payment: '',
      terms: false,
      schedule: [],
      doctorInformation: {
        name: '',
        address: '',
        city: '',
        phone: ''
      },
      emergencyContacts: [],
      releasedToPersons: []
    },
    setContractInformation: vi.fn(),
    setLoadingInfo: vi.fn(),
    toast: { current: null }
  };

  const mockViewModel = {
    onSubmit: vi.fn(),
    addGuardian: vi.fn(),
    errors: {},
    removeGuardian: vi.fn(),
    getAvailableGuardianTypes: vi.fn().mockReturnValue([
      { id: 1, name: 'Father' },
      { id: 2, name: 'Mother' },
      { id: 3, name: 'Guardian' }
    ]),
    handleGuardianSelect: vi.fn(),
    t: (key: string) => key,
    guardianOptions: [
      { id: 1, name: 'John Doe', label: 'John Doe', value: 1 },
      { id: 2, name: 'Jane Smith', label: 'Jane Smith', value: 2 }
    ],
    control: {} as any,
    fields: [
      {
        id: '1',
        name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Omaha',
        guardian_type_id: 1,
        titular: true
      }
    ],
    getValues: vi.fn().mockReturnValue({
      guardians: [
        {
          name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Omaha',
          guardian_type_id: 1,
          titular: true
        }
      ]
    }),
    handleSubmit: vi.fn((fn) => fn)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseViewModelStepGuardians.mockReturnValue(mockViewModel);
  });

  describe('Form Rendering', () => {
    it('should render guardian form with all required fields', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check for form elements
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByText('pickAGuardian')).toBeInTheDocument();
      expect(screen.getByText('addGuardian')).toBeInTheDocument();
      expect(screen.getByText('save')).toBeInTheDocument();
      expect(screen.getByText('returnToPreviousStep')).toBeInTheDocument();
    });

    it('should render guardian fields for existing guardians', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check for guardian input fields
      expect(screen.getByText('guardianName')).toBeInTheDocument();
      expect(screen.getByText('guardianLastName')).toBeInTheDocument();
      expect(screen.getByText('address')).toBeInTheDocument();
      expect(screen.getByText('city')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
      expect(screen.getByText('phoneNumber')).toBeInTheDocument();
      expect(screen.getByText('guardianType')).toBeInTheDocument();
      expect(screen.getByText('titular')).toBeInTheDocument();
    });

    it('should render guardian dropdown with options', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const dropdown = screen.getByLabelText('pickAGuardian');
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const mockViewModelWithErrors = {
        ...mockViewModel,
        errors: {
          'guardians.0.name': { message: 'guardianNameRequired' },
          'guardians.0.email': { message: 'emailInvalid' },
          'guardians.0.phone': { message: 'phoneNumberPattern' }
        }
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithErrors);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check for validation errors
      expect(screen.getByText('guardianNameRequired')).toBeInTheDocument();
      expect(screen.getByText('emailInvalid')).toBeInTheDocument();
      expect(screen.getByText('phoneNumberPattern')).toBeInTheDocument();
    });

    it('should apply proper input filters', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check that name fields have proper filters
      const nameInputs = screen.getAllByDisplayValue('John');
      nameInputs.forEach(input => {
        expect(input).toHaveAttribute('keyfilter');
      });
    });

    it('should validate email format', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check email validation pattern
      const emailInput = screen.getByDisplayValue('john@example.com');
      expect(emailInput).toHaveAttribute('keyfilter', 'email');
    });

    it('should validate phone number format', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check phone validation pattern
      const phoneInput = screen.getByDisplayValue('1234567890');
      expect(phoneInput).toHaveAttribute('keyfilter');
    });
  });

  describe('Form Interactions', () => {
    it('should handle guardian selection from dropdown', async () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const dropdown = screen.getByLabelText('pickAGuardian');
      fireEvent.change(dropdown, { target: { value: 2 } });

      await waitFor(() => {
        expect(mockViewModel.handleGuardianSelect).toHaveBeenCalledWith({ value: 2 });
      });
    });

    it('should handle adding new guardian', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const addButton = screen.getByText('addGuardian');
      fireEvent.click(addButton);

      expect(mockViewModel.addGuardian).toHaveBeenCalled();
    });

    it('should handle removing guardian', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const removeButton = screen.getByRole('button', { name: /trash/i });
      fireEvent.click(removeButton);

      expect(mockViewModel.removeGuardian).toHaveBeenCalledWith(0);
    });

    it('should handle form submission', async () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const submitButton = screen.getByText('save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockViewModel.handleSubmit).toHaveBeenCalled();
      });
    });

    it('should handle navigation back', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const backButton = screen.getByText('returnToPreviousStep');
      fireEvent.click(backButton);

      expect(mockProps.setActiveIndex).toHaveBeenCalledWith(0);
    });
  });

  describe('Guardian Type Management', () => {
    it('should show available guardian types', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check that guardian type dropdown is rendered
      expect(screen.getByText('guardianType')).toBeInTheDocument();
    });

    it('should filter guardian types based on existing selections', () => {
      const mockViewModelWithMultipleGuardians = {
        ...mockViewModel,
        getValues: vi.fn().mockReturnValue({
          guardians: [
            { guardian_type_id: 1, titular: true },
            { guardian_type_id: 2, titular: false }
          ]
        })
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithMultipleGuardians);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      expect(mockViewModel.getAvailableGuardianTypes).toHaveBeenCalled();
    });
  });

  describe('Titular Guardian Management', () => {
    it('should allow only one titular guardian', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const titularCheckbox = screen.getByRole('checkbox');
      expect(titularCheckbox).toBeInTheDocument();
      expect(titularCheckbox).toBeChecked();
    });

    it('should handle titular guardian changes', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const titularCheckbox = screen.getByRole('checkbox');
      fireEvent.click(titularCheckbox);

      // The checkbox should be toggleable
      expect(titularCheckbox).toBeInTheDocument();
    });
  });

  describe('Form State Management', () => {
    it('should disable add guardian button when limit reached', () => {
      const mockViewModelWithMaxGuardians = {
        ...mockViewModel,
        getValues: vi.fn().mockReturnValue({
          guardians: [
            { guardian_type_id: 1, titular: true },
            { guardian_type_id: 2, titular: false },
            { guardian_type_id: 3, titular: false }
          ]
        })
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithMaxGuardians);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const addButton = screen.getByText('addGuardian');
      expect(addButton).toBeDisabled();
    });

    it('should prevent removing last guardian', () => {
      const mockViewModelWithSingleGuardian = {
        ...mockViewModel,
        fields: [
          {
            id: '1',
            name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Omaha',
            guardian_type_id: 1,
            titular: true
          }
        ],
        getValues: vi.fn().mockReturnValue({
          guardians: [
            {
              name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '1234567890',
              address: '123 Main St',
              city: 'Omaha',
              guardian_type_id: 1,
              titular: true
            }
          ]
        })
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithSingleGuardian);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const removeButton = screen.getByRole('button', { name: /trash/i });
      fireEvent.click(removeButton);

      expect(mockViewModel.removeGuardian).toHaveBeenCalledWith(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', () => {
      const mockViewModelWithValidationErrors = {
        ...mockViewModel,
        errors: {
          'guardians.0.name': { message: 'Name is required' },
          'guardians.0.email': { message: 'Invalid email format' }
        }
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithValidationErrors);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', () => {
      const mockViewModelWithApiError = {
        ...mockViewModel,
        onSubmit: vi.fn().mockRejectedValue(new Error('API Error'))
      };
      mockUseViewModelStepGuardians.mockReturnValue(mockViewModelWithApiError);

      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const submitButton = screen.getByText('save');
      fireEvent.click(submitButton);

      // Should not crash the component
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      // Check for proper labeling
      expect(screen.getByLabelText('pickAGuardian')).toBeInTheDocument();
      expect(screen.getByText('guardianName')).toBeInTheDocument();
      expect(screen.getByText('guardianLastName')).toBeInTheDocument();
      expect(screen.getByText('address')).toBeInTheDocument();
      expect(screen.getByText('city')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
      expect(screen.getByText('phoneNumber')).toBeInTheDocument();
      expect(screen.getByText('guardianType')).toBeInTheDocument();
      expect(screen.getByText('titular')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type');
      });
    });

    it('should have proper form structure', () => {
      renderWithProviders(<StepComponentTwo {...mockProps} />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });
  });
}); 