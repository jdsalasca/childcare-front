import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationService from '../../utils/navigationService';

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * NavigationProvider component that sets up the NavigationService
 * with React Router's navigate function for SPA navigation
 */
const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the navigate function in the NavigationService
    NavigationService.setNavigate(navigate);
  }, [navigate]);

  return <>{children}</>;
};

export default NavigationProvider;