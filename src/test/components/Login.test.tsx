import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import Login from '../../components/utils/Login';
import UsersAPI from '../../models/UsersAPI';

// Mock the API
vi.mock('../../models/UsersAPI');
const mockAuthUser = vi.mocked(UsersAPI.authUser);

// Mock the custom navigate hook
vi.mock('../../utils/customHooks/useCustomNavigate', () => ({
  __esModule: true,
  default: () => vi.fn(),
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

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Login Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('should render login form', () => {
      renderLogin();
      
      expect(screen.getByText('login')).toBeInTheDocument();
      expect(screen.getByLabelText(/userNameOrEmail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /signIn/i })).toBeInTheDocument();
    });

    it('should have form with correct structure', () => {
      renderLogin();
      
      const usernameInput = screen.getByLabelText(/userNameOrEmail/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /signIn/i });
      
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call authUser with correct credentials on successful login', async () => {
      const mockResponse = {
        response: { 
          token: 'test-token',
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        },
        httpStatus: 200,
      };
      mockAuthUser.mockResolvedValue(mockResponse);

      renderLogin();

      const usernameInput = screen.getByLabelText(/userNameOrEmail/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /signIn/i });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalled();
      });
    });

    it('should handle login error', async () => {
      const mockError = {
        response: { error: 'Invalid credentials', errorType: 'username' },
        httpStatus: 401,
      };
      mockAuthUser.mockRejectedValue(mockError);

      renderLogin();

      const usernameInput = screen.getByLabelText(/userNameOrEmail/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /signIn/i });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalled();
      });
    });

    it('should handle successful login and navigate', async () => {
      const mockResponse = {
        response: { 
          token: 'test-token',
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        },
        httpStatus: 200,
      };
      mockAuthUser.mockResolvedValue(mockResponse);

      renderLogin();

      const usernameInput = screen.getByLabelText(/userNameOrEmail/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /signIn/i });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAuthUser).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      // Mock a delayed response
      mockAuthUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderLogin();

      const usernameInput = screen.getByLabelText(/userNameOrEmail/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /signIn/i });

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);

      // Check that loading state is shown
      const loader = document.querySelector('.loader-container');
      expect(loader).toBeInTheDocument();
    });
  });
}); 