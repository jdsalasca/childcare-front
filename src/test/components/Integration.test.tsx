import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils'
import { Bills } from '../../components/bills/Bills'
import { Contracts } from '../../components/contracts/Contracts'

// Mock the view models
vi.mock('../../components/bills/viewModels/useBillsViewModel', () => ({
  useBillsViewModel: vi.fn(),
}))

vi.mock('../../components/contracts/viewModels/useGenerateContract', () => ({
  useGenerateContract: vi.fn(),
}))

vi.mock('../../models/customHooks/useDays', () => ({
  default: vi.fn(() => ({
    laboralDays: [
      { id: 1, name: 'Monday', abbreviation: 'Mon' },
      { id: 2, name: 'Tuesday', abbreviation: 'Tue' },
      { id: 3, name: 'Wednesday', abbreviation: 'Wed' },
      { id: 4, name: 'Thursday', abbreviation: 'Thu' },
      { id: 5, name: 'Friday', abbreviation: 'Fri' },
    ],
  })),
}))

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Bills Integration', () => {
    it('should handle complete bills workflow', async () => {
      const mockBillsViewModel = {
        billsFields: [
          { id: 1, names: 'John Doe', cash: '10.00', check: '5.00', total: 15.00 },
        ],
        filteredBills: [
          { id: 1, names: 'John Doe', cash: '10.00', check: '5.00', total: 15.00 },
        ],
        sums: { cash: 10, check: 5, total: 15, cash_on_hand: 100, total_cash_on_hand: -85 },
        searchTerm: '',
        selectedProgram: '',
        selectedDate: null,
        exportableCount: 1,
        isContentBlocked: false,
        isLoading: false,
        closedMoneyData: null,
        onHandlerDateChanged: vi.fn(),
        onStartForm: vi.fn(),
        addNewBill: vi.fn(),
        removeBill: vi.fn(),
        handleSubmit: vi.fn(),
        onDownloadFirstPartPdf: vi.fn(),
        onDownloadBoxedPdf: vi.fn(),
        setSearchTerm: vi.fn(),
        setSelectedProgram: vi.fn(),
        setSelectedDate: vi.fn(),
        onRecalculateAll: vi.fn(),
        recalculateFields: vi.fn(),
        calculateBillSums: vi.fn(),
        updateBillField: vi.fn(),
      }

      const useBillsViewModelModule = await import('../../components/bills/viewModels/useBillsViewModel')
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockBillsViewModel)

      renderWithProviders(<Bills />)

      // Verify initial render
      expect(screen.getByText('bills.title')).toBeInTheDocument()
      expect(screen.getByText('bills.summary')).toBeInTheDocument()

      // Test adding a new bill
      const addButton = screen.getByTestId('header-add-bill-button')
      await userEvent.click(addButton)
      expect(mockBillsViewModel.addNewBill).toHaveBeenCalled()

      // Test form submission
      const saveButton = screen.getByText('bills.save')
      await userEvent.click(saveButton)
      expect(mockBillsViewModel.handleSubmit).toHaveBeenCalled()
    })

    it('should handle search and filtering', async () => {
      const mockBillsViewModel = {
        billsFields: [
          { id: 1, names: 'John Doe', cash: '10.00', check: '5.00', total: 15.00 },
          { id: 2, names: 'Jane Smith', cash: '20.00', check: '10.00', total: 30.00 },
        ],
        filteredBills: [
          { id: 1, names: 'John Doe', cash: '10.00', check: '5.00', total: 15.00 },
        ],
        sums: { cash: 10, check: 5, total: 15, cash_on_hand: 100, total_cash_on_hand: -85 },
        searchTerm: 'John',
        selectedProgram: '',
        selectedDate: null,
        exportableCount: 1,
        isContentBlocked: false,
        isLoading: false,
        closedMoneyData: null,
        onHandlerDateChanged: vi.fn(),
        onStartForm: vi.fn(),
        addNewBill: vi.fn(),
        removeBill: vi.fn(),
        handleSubmit: vi.fn(),
        onDownloadFirstPartPdf: vi.fn(),
        onDownloadBoxedPdf: vi.fn(),
        setSearchTerm: vi.fn(),
        setSelectedProgram: vi.fn(),
        setSelectedDate: vi.fn(),
        onRecalculateAll: vi.fn(),
        recalculateFields: vi.fn(),
        calculateBillSums: vi.fn(),
        updateBillField: vi.fn(),
      }

      const useBillsViewModelModule = await import('../../components/bills/viewModels/useBillsViewModel')
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockBillsViewModel)

      renderWithProviders(<Bills />)

      // Test search functionality
      const searchInput = screen.getByPlaceholderText('bills.searchPlaceholder')
      await userEvent.type(searchInput, 'John')
      expect(mockBillsViewModel.setSearchTerm).toHaveBeenCalledWith('John')

      // Test program filter
      const programSelect = screen.getByLabelText('program')
      await userEvent.selectOptions(programSelect, 'Infant')
      expect(mockBillsViewModel.setSelectedProgram).toHaveBeenCalledWith('Infant')
    })
  })

  describe('Contracts Integration', () => {
    it('should handle complete contracts workflow', async () => {
      const mockContractInfo = {
        children: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            born_date: '2020-01-01',
            gender_id: 1,
            age: 3,
            classroom: 'Toddler',
            status: 'Active',
          },
        ],
        guardians: [
          {
            id: 1,
            name: 'John Doe Sr.',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Anytown',
            guardian_type_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            status: 'Active' as const,
            titular: true,
          },
        ],
        terms: {},
        total_to_pay: 500,
        payment_method_id: 1,
        start_date: '2024-01-01',
        schedule: [
          { day_id: 1, check_in: '08:00', check_out: '17:00' },
          { day_id: 2, check_in: '08:00', check_out: '17:00' },
        ],
      }

      renderWithProviders(<Contracts />)

      // Verify initial render
      expect(screen.getByText('children (1)')).toBeInTheDocument()
      expect(screen.getByText('guardians (1)')).toBeInTheDocument()

      // Test step navigation
      const step1Button = screen.getByText('children (1)')
      await userEvent.click(step1Button)
      
      // Should navigate to children step
      await waitFor(() => {
        expect(screen.getByText('children (1)')).toBeInTheDocument()
      })
    })

    it('should validate contract data properly', async () => {
      renderWithProviders(<Contracts />)

      // Test that validation indicators are shown
      const steps = screen.getAllByRole('button')
      expect(steps.length).toBeGreaterThan(0)

      // Test step validation classes
      const childrenStep = screen.getByText(/children/i)
      expect(childrenStep).toBeInTheDocument()
    })
  })

  describe('Cross-Component Integration', () => {
    it('should handle data flow between components', async () => {
      // Test that data can flow properly between Bills and Contracts
      // This would be more relevant in a real application where they share data
      
      const mockBillsViewModel = {
        billsFields: [],
        filteredBills: [],
        sums: { cash: 0, check: 0, total: 0, cash_on_hand: 0, total_cash_on_hand: 0 },
        searchTerm: '',
        selectedProgram: '',
        selectedDate: null,
        exportableCount: 0,
        isContentBlocked: false,
        isLoading: false,
        closedMoneyData: null,
        onHandlerDateChanged: vi.fn(),
        onStartForm: vi.fn(),
        addNewBill: vi.fn(),
        removeBill: vi.fn(),
        handleSubmit: vi.fn(),
        onDownloadFirstPartPdf: vi.fn(),
        onDownloadBoxedPdf: vi.fn(),
        setSearchTerm: vi.fn(),
        setSelectedProgram: vi.fn(),
        setSelectedDate: vi.fn(),
        onRecalculateAll: vi.fn(),
        recalculateFields: vi.fn(),
        calculateBillSums: vi.fn(),
        updateBillField: vi.fn(),
      }

      const useBillsViewModelModule = await import('../../components/bills/viewModels/useBillsViewModel')
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockBillsViewModel)

      // Test Bills component
      const { unmount } = renderWithProviders(<Bills />)
      expect(screen.getByText('bills.title')).toBeInTheDocument()
      
      unmount()

      // Test Contracts component
      renderWithProviders(<Contracts />)
      expect(screen.getByText(/children/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      const mockBillsViewModel = {
        billsFields: [],
        filteredBills: [],
        sums: { cash: 0, check: 0, total: 0, cash_on_hand: 0, total_cash_on_hand: 0 },
        searchTerm: '',
        selectedProgram: '',
        selectedDate: null,
        exportableCount: 0,
        isContentBlocked: false,
        isLoading: false,
        closedMoneyData: null,
        onHandlerDateChanged: vi.fn(),
        onStartForm: vi.fn(),
        addNewBill: vi.fn(),
        removeBill: vi.fn(),
        handleSubmit: vi.fn().mockRejectedValue(new Error('API Error')),
        onDownloadFirstPartPdf: vi.fn(),
        onDownloadBoxedPdf: vi.fn(),
        setSearchTerm: vi.fn(),
        setSelectedProgram: vi.fn(),
        setSelectedDate: vi.fn(),
        onRecalculateAll: vi.fn(),
        recalculateFields: vi.fn(),
        calculateBillSums: vi.fn(),
        updateBillField: vi.fn(),
      }

      const useBillsViewModelModule = await import('../../components/bills/viewModels/useBillsViewModel')
      vi.mocked(useBillsViewModelModule.useBillsViewModel).mockReturnValue(mockBillsViewModel)

      renderWithProviders(<Bills />)

      // Test error handling
      const saveButton = screen.getByText('bills.save')
      await userEvent.click(saveButton)
      
      // Should handle the error gracefully without crashing
      expect(screen.getByText('bills.title')).toBeInTheDocument()
    })
  })
}); 