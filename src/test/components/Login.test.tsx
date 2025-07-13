import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockApiResponse, mockApiError } from '../utils'
import Login from '../../components/utils/Login'
import UsersAPI from '../../models/UsersAPI'
import { SecurityService } from '../../configs/storageUtils'

// Mock the dependencies
vi.mock('../../models/UsersAPI')
vi.mock('../../configs/storageUtils')
vi.mock('../../utils/customHooks/useCustomNavigate', () => ({
  default: () => vi.fn(),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mockUsersAPI = vi.mocked(UsersAPI)
const mockSecurityService = vi.mocked(SecurityService)

describe('Login Component', () => {
  const mockNavigate = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock SecurityService
    mockSecurityService.getInstance.mockReturnValue({
      setEncryptedItem: vi.fn(),
      getDecryptedItem: vi.fn(),
      removeItem: vi.fn(),
      clearAll: vi.fn(),
    } as any)
    
    // Mock useCustomNavigate
    vi.doMock('../../utils/customHooks/useCustomNavigate', () => ({
      default: () => mockNavigate,
    }))
  })

  it('should render login form elements', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText(/username/i)).toBeInTheDocument()
    expect(screen.getByText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should call authUser API when form is submitted', async () => {
    const mockToken = 'mock-jwt-token'
    
    mockUsersAPI.authUser.mockResolvedValueOnce(
      mockApiResponse({ token: mockToken })
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const form = document.querySelector('form')!
    
    // Try userEvent.type, fallback to fireEvent.change if needed
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    if ((usernameInput as HTMLInputElement).value !== 'testuser') {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    }
    if ((passwordInput as HTMLInputElement).value !== 'password123') {
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
    }
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      })
    })
  })

  it('should handle successful login', async () => {
    const mockToken = 'mock-jwt-token'
    const mockSetEncryptedItem = vi.fn()
    
    mockSecurityService.getInstance.mockReturnValue({
      setEncryptedItem: mockSetEncryptedItem,
      getDecryptedItem: vi.fn(),
      removeItem: vi.fn(),
      clearAll: vi.fn(),
    } as any)
    
    mockUsersAPI.authUser.mockResolvedValueOnce(
      mockApiResponse({ token: mockToken }, 200)
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockSetEncryptedItem).toHaveBeenCalledWith('token', mockToken)
    })
  })

  it('should handle API errors', async () => {
    mockUsersAPI.authUser.mockRejectedValueOnce(
      mockApiError('Invalid credentials', 401)
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'wrongpassword')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalled()
    })
  })

  it('should handle username-specific errors', async () => {
    mockUsersAPI.authUser.mockRejectedValueOnce({
      response: {
        errorType: 'username',
        error: 'Username not found',
      },
      httpStatus: 404,
    })
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'nonexistentuser')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalled()
    })
  })

  it('should handle password-specific errors', async () => {
    mockUsersAPI.authUser.mockRejectedValueOnce({
      response: {
        errorType: 'password',
        error: 'Invalid password',
      },
      httpStatus: 401,
    })
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'wrongpassword')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalled()
    })
  })

  it('should handle invalid token response', async () => {
    mockUsersAPI.authUser.mockResolvedValueOnce(
      mockApiResponse({ invalidResponse: true })
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalled()
    })
  })

  it('should handle network errors', async () => {
    mockUsersAPI.authUser.mockRejectedValueOnce(
      mockApiError('Network error', 500)
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockUsersAPI.authUser).toHaveBeenCalled()
    })
  })
}) 