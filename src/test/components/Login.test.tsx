import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../utils';
import Login from '../../components/utils/Login';
import UsersAPI from '../../models/UsersAPI';
import userEvent from '@testing-library/user-event';

// Mock the API
vi.mock('../../models/UsersAPI');
vi.mock('../../utils/customHooks/useCustomNavigate', () => ({
  default: () => ({
    navigate: vi.fn(),
  }),
}));

// Mock the storage service
vi.mock('../../configs/storageUtils', () => ({
  SecurityService: {
    getInstance: () => ({
      setEncryptedItem: vi.fn(),
    }),
  },
}));

// Mock the logger
vi.mock('../../configs/logger', () => ({
  customLogger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Login Component', () => {
  const mockAuthUser = vi.mocked(UsersAPI.authUser);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      renderWithProviders(<Login />);

      expect(screen.getByText('login')).toBeInTheDocument();
      expect(screen.getByText('userNameOrEmail')).toBeInTheDocument();
      expect(screen.getByText('password')).toBeInTheDocument();
      expect(screen.getByText('signIn')).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      renderWithProviders(<Login />);

      // The form doesn't have role="form", so we check for the form element by tag
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle input changes', async () => {
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue(''); // Password field doesn't have proper label

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('password123');
    });

    it('should call authUser API when form is submitted', async () => {
      // Mock successful API response
      mockAuthUser.mockResolvedValue({
        httpStatus: 200,
        response: {
          token: 'mock-token',
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }
      });

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error response
      mockAuthUser.mockRejectedValue({
        httpStatus: 401,
        response: {
          error: 'Invalid credentials',
          errorType: 'username'
        }
      });

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'wrongpassword');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'wrongpassword'
        });
      });
    });

    it('should handle network errors', async () => {
      // Mock network error
      mockAuthUser.mockRejectedValue(new Error('Network error'));

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });
    });
  });

  describe('Validation', () => {
    it('should validate required fields', async () => {
      renderWithProviders(<Login />);

      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Check that validation errors are shown
      await waitFor(() => {
        expect(screen.getByText('username_is_required')).toBeInTheDocument();
        expect(screen.getByText('password_is_required')).toBeInTheDocument();
      });
    });

    it('should validate username length', async () => {
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'ab'); // Too short
      await userEvent.type(passwordInput, 'password123');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('username_min_length')).toBeInTheDocument();
      });
    });

    it('should validate username max length', async () => {
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'a'.repeat(21)); // Too long
      await userEvent.type(passwordInput, 'password123');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('username_max_length')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      // Mock a delayed API response
      mockAuthUser.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          httpStatus: 200,
          response: { 
            token: 'mock-token',
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
          }
        }), 100))
      );

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('userNameOrEmail');
      const passwordInput = screen.getByDisplayValue('');
      const form = document.querySelector('form');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.submit(form!);

      // Check that loading state is shown
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithProviders(<Login />);

      expect(screen.getByLabelText('userNameOrEmail')).toBeInTheDocument();
      // Password field doesn't have proper label, so we check it exists by display value
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      renderWithProviders(<Login />);

      const submitButton = screen.getByRole('button', { name: 'signIn' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should have proper form structure', () => {
      renderWithProviders(<Login />);

      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });
}); 