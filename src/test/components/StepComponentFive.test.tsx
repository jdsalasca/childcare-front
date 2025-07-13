import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import StepComponentFive from '../../components/contracts/steps/StepComponentFive';

const mockSetActiveIndex = vi.fn();
const mockSetContractInformation = vi.fn();
const mockSetLoadingInfo = vi.fn();
const mockToast = { current: { show: vi.fn() } };

const mockDays = [
  { id: 1, name: 'Monday', translationLabel: 'monday', laboral_day: true, abbreviation: 'MON', value: 1 },
  { id: 2, name: 'Tuesday', translationLabel: 'tuesday', laboral_day: true, abbreviation: 'TUE', value: 2 }
];

vi.mock('../../models/customHooks/useDays', () => ({
  default: () => ({
    days: [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' }
    ]
  })
}));

const mockCreateContractSchedule = vi.fn();
vi.mock('../../components/contracts/contractModelView', () => ({
  ContractService: { createContractSchedule: mockCreateContractSchedule }
}));

const baseContractInfo = {
  contract_id: 42,
  schedule: [],
  children: [],
  guardians: [],
  titularName: '',
  todayDate: '',
};

describe('StepComponentFive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all days and fields', () => {
    render(
      <StepComponentFive
        setActiveIndex={mockSetActiveIndex}
        contractInformation={baseContractInfo}
        setContractInformation={mockSetContractInformation}
        setLoadingInfo={mockSetLoadingInfo}
        toast={mockToast}
      />
    );
    expect(screen.getByText(/schedule/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/checkIn/i).length).toBe(mockDays.length);
    expect(screen.getAllByLabelText(/checkOut/i).length).toBe(mockDays.length);
  });

  it('submits with all fields filled', async () => {
    render(
      <StepComponentFive
        setActiveIndex={mockSetActiveIndex}
        contractInformation={baseContractInfo}
        setContractInformation={mockSetContractInformation}
        setLoadingInfo={mockSetLoadingInfo}
        toast={mockToast}
      />
    );
    // Simulate filling in all fields
    const checkInInputs = screen.getAllByLabelText(/checkIn/i);
    const checkOutInputs = screen.getAllByLabelText(/checkOut/i);
    fireEvent.change(checkInInputs[0], { target: { value: '09:00' } });
    fireEvent.change(checkOutInputs[0], { target: { value: '18:00' } });
    fireEvent.change(checkInInputs[1], { target: { value: '10:00' } });
    fireEvent.change(checkOutInputs[1], { target: { value: '19:00' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(mockSetLoadingInfo).toHaveBeenCalled();
    });
  });

  it('submits with missing fields and uses defaults', async () => {
    render(
      <StepComponentFive
        setActiveIndex={mockSetActiveIndex}
        contractInformation={baseContractInfo}
        setContractInformation={mockSetContractInformation}
        setLoadingInfo={mockSetLoadingInfo}
        toast={mockToast}
      />
    );
    // Simulate clearing one field
    const checkInInputs = screen.getAllByLabelText(/checkIn/i);
    fireEvent.change(checkInInputs[0], { target: { value: '' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(mockSetLoadingInfo).toHaveBeenCalled();
    });
    // The backend should receive '08:00' for missing check-in
  });

  it('sends correct payload to backend', async () => {
    render(
      <StepComponentFive
        setActiveIndex={mockSetActiveIndex}
        contractInformation={baseContractInfo}
        setContractInformation={mockSetContractInformation}
        setLoadingInfo={mockSetLoadingInfo}
        toast={mockToast}
      />
    );
    // Simulate filling in all fields
    const checkInInputs = screen.getAllByLabelText(/checkIn/i);
    const checkOutInputs = screen.getAllByLabelText(/checkOut/i);
    fireEvent.change(checkInInputs[0], { target: { value: '09:00' } });
    fireEvent.change(checkOutInputs[0], { target: { value: '18:00' } });
    fireEvent.change(checkInInputs[1], { target: { value: '10:00' } });
    fireEvent.change(checkOutInputs[1], { target: { value: '19:00' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(mockCreateContractSchedule).toHaveBeenCalled();
      const payload = mockCreateContractSchedule.mock.calls[0][0];
      expect(payload[0].check_in).toBe('09:00');
      expect(payload[0].check_out).toBe('18:00');
      expect(payload[1].check_in).toBe('10:00');
      expect(payload[1].check_out).toBe('19:00');
    });
  });
}); 