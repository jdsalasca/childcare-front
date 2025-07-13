import API, { ApiResponse, BASE_URL } from './API';
import { ErrorHandlerComponent } from '../utils/ErrorHandler';

export interface User {
  token?: string; // Adjust based on your API response
  errorType?: string; // Adjust based on your API response
  error?: string; // Adjust based on your API response
  id: string; // Adjust based on your API response
  username: string; // Adjust based on your API response
  email: string; // Adjust based on your API response
  // Add other relevant properties as needed
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  // Add other relevant fields for user registration
}

/**
 * Interface for authentication data
 * @param username - Username or email
 * @param password - Password
 */
interface AuthUserData {
  username: string;
  password: string;
}

const UsersAPI = {
  // Get all users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await API.get<User[]>(BASE_URL, '/users');
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.getUsers');
      throw error;
    }
  },

  // Get user by nickname
  getUserByNickname: async (username: string): Promise<ApiResponse<User>> => {
    try {
      const response = await API.get<User>(BASE_URL, '/users/username', {
        params: { username },
      });
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.getUserByNickname');
      throw error;
    }
  },

  // Create a new user
  createUser: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    try {
      const response = await API.post<User>(BASE_URL, '/users/register', data);
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.createUser');
      throw error;
    }
  },

  // Authenticate user
  authUser: async (data: AuthUserData): Promise<ApiResponse<User>> => {
    try {
      const response = await API.post<User>(BASE_URL, '/users/login', data);
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleAuthError(error);
      throw error;
    }
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<ApiResponse<User>> => {
    try {
      const response = await API.get<User>(BASE_URL, '/users/email', {
        params: { email },
      });
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.getUserByEmail');
      throw error;
    }
  },

  // Get roles
  getRoles: async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
    try {
      const response = await API.get<{ id: number; name: string }[]>(
        BASE_URL,
        '/users/roles'
      );
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.getRoles');
      throw error;
    }
  },

  // Get cashiers
  getCashiers: async (): Promise<
    ApiResponse<{ id: number; cashierNumber: string }[]>
  > => {
    try {
      const response = await API.get<{ id: number; cashierNumber: string }[]>(
        BASE_URL,
        '/users/cashiers'
      );
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.getCashiers');
      throw error;
    }
  },

  updateUser: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    try {
      const response = await API.put<User>(BASE_URL, `/users/${id}`, data);
      return response;
    } catch (error) {
      ErrorHandlerComponent.handleApiError(error, 'UsersAPI.updateUser');
      throw error;
    }
  },
};

export default UsersAPI;

// Uncomment if you want to use the custom hook
// export const useUsersCache = () => {
//   return useQuery({
//     queryKey: ['users'],  // Unique key for caching
//     queryFn: () => UsersAPI.getUsers(),  // API function
//     staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
//     cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
//   });
// };
