import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { ReactElement, ReactNode, createElement } from 'react'
import { vi } from 'vitest'
import i18n from '../configs/i18n'

// Create a custom render function that includes all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity,
          gcTime: Infinity,
        },
        mutations: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = options

  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      BrowserRouter,
      null,
      createElement(
        I18nextProvider,
        { i18n },
        createElement(
          QueryClientProvider,
          { client: queryClient },
          children
        )
      )
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// Mock data factories
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  token: 'mock-token',
}

export const mockChild = {
  id: 1,
  name: 'Test Child',
  dateOfBirth: '2020-01-01',
  gender: 'M',
  documentType: 1,
  documentNumber: '123456789',
  address: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  zipCode: '12345',
  phone: '123-456-7890',
  email: 'child@test.com',
  emergencyContact: 'Test Contact',
  emergencyPhone: '987-654-3210',
}

export const mockGuardian = {
  id: 1,
  name: 'Test Guardian',
  lastName: 'Guardian Last',
  phone: '123-456-7890',
  email: 'guardian@test.com',
  documentType: 1,
  documentNumber: '987654321',
  address: '456 Guardian St',
  city: 'Guardian City',
  state: 'Guardian State',
  zipCode: '54321',
  guardianType: 1,
}

export const mockContract = {
  id: 1,
  childId: 1,
  guardianId: 1,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  monthlyFee: 500,
  registrationFee: 100,
  status: 'active',
  terms: 'Test terms and conditions',
}

export const mockBill = {
  id: 1,
  childId: 1,
  amount: 500,
  dueDate: '2024-01-31',
  status: 'pending',
  description: 'Monthly tuition',
  billType: 1,
  paymentMethod: 1,
}

export const mockCashRegister = {
  id: 1,
  openingDate: '2024-01-01',
  closingDate: null,
  openingAmount: 1000,
  closingAmount: null,
  totalIncome: 500,
  totalExpenses: 200,
  status: 'open',
  userId: 1,
}

// API Response mocks
export const mockApiResponse = (data: any, status = 200) => ({
  response: data,
  httpStatus: status,
})

export const mockApiError = (message = 'API Error', status = 400) => ({
  response: { error: message },
  httpStatus: status,
})

// Mock Axios for API calls
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  request: vi.fn(),
  create: vi.fn(() => mockAxios),
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
    },
  },
}

// Mock React Router hooks
export const mockNavigate = vi.fn()
export const mockUseNavigate = () => mockNavigate

// Mock React Hook Form
export const mockUseForm = () => ({
  control: {},
  handleSubmit: vi.fn((fn) => fn),
  setError: vi.fn(),
  clearErrors: vi.fn(),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
  },
  watch: vi.fn(),
  setValue: vi.fn(),
  getValues: vi.fn(),
  reset: vi.fn(),
})

// Mock i18n
export const mockT = vi.fn((key: string) => key)
export const mockUseTranslation = () => ({
  t: mockT,
  i18n: {
    changeLanguage: vi.fn(),
    language: 'en',
  },
})

// Mock PrimeReact Toast
export const mockToast = {
  current: {
    show: vi.fn(),
    clear: vi.fn(),
  },
}

// Mock file operations
export const mockFile = (name = 'test.pdf', type = 'application/pdf') =>
  new File(['test content'], name, { type })

// Mock PDF generation
export const mockJsPDF = {
  text: vi.fn(),
  save: vi.fn(),
  addImage: vi.fn(),
  setFontSize: vi.fn(),
  setFont: vi.fn(),
  autoTable: vi.fn(),
  output: vi.fn(() => 'mock-pdf-output'),
}

// Mock localStorage operations
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock SecurityService
export const mockSecurityService = {
  getInstance: vi.fn(() => ({
    setEncryptedItem: vi.fn(),
    getDecryptedItem: vi.fn(() => 'mock-token'),
    removeItem: vi.fn(),
    clearAll: vi.fn(),
  })),
}

// Test utilities for async operations
export const waitForNextUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

export const createMockPromise = (data: any, delay = 0) =>
  new Promise(resolve => setTimeout(() => resolve(data), delay))

export const createMockRejection = (error: any, delay = 0) =>
  new Promise((_, reject) => setTimeout(() => reject(error), delay))

// Custom matchers for better assertions
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeInTheDocument()
}

export const expectToHaveText = (element: HTMLElement | null, text: string) => {
  expect(element).toHaveTextContent(text)
}

export const expectToBeVisible = (element: HTMLElement | null) => {
  expect(element).toBeVisible()
}

export const expectToBeDisabled = (element: HTMLElement | null) => {
  expect(element).toBeDisabled()
}

// Mock window methods
export const mockWindowMethods = {
  alert: vi.fn(),
  confirm: vi.fn(() => true),
  prompt: vi.fn(() => 'test input'),
  open: vi.fn(),
  close: vi.fn(),
  print: vi.fn(),
}

// Setup window mocks
export const setupWindowMocks = () => {
  Object.assign(window, mockWindowMethods)
}

// Cleanup function for tests
export const cleanupAfterTest = () => {
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.restoreAllMocks()
}

// Export all utilities
export * from '@testing-library/react'
export * from '@testing-library/user-event'
export { vi } from 'vitest' 