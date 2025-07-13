// src/context/AuthContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { SecurityService } from '../configs/storageUtils';
import { useUnifiedState } from '../utils/stateManagement/useUnifiedState';

// Define the context type
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { state: authState, setState: setAuthState } = useUnifiedState({
    initialState: {
      token: null as string | null,
    },
  });

  const securityService = SecurityService.getInstance();

  useEffect(() => {
    // Load token from encrypted storage on component mount
    const storedToken = securityService.getDecryptedItem('token');
    if (storedToken) {
      setAuthState({ token: storedToken });
    }
  }, [setAuthState]);

  useEffect(() => {
    // Store token using encrypted storage when token changes
    if (authState.token) {
      securityService.setEncryptedItem('token', authState.token);
    }
  }, [authState.token]);

  const login = (newToken: string) => {
    setAuthState({ token: newToken });
  };

  const logout = () => {
    setAuthState({ token: null });
    securityService.removeEncryptedItem('token'); // Use SecurityService consistently
  };

  return (
    <AuthContext.Provider value={{ token: authState.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
