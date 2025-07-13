import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavigationProvider from '../../components/providers/NavigationProvider';

// Mock the navigation service
jest.mock('../../utils/navigationService', () => ({
  __esModule: true,
  default: {
    setNavigate: jest.fn(),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NavigationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children without crashing', () => {
    renderWithRouter(
      <NavigationProvider>
        <div data-testid="test-child">Test Child</div>
      </NavigationProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should set up navigation service with navigate function', () => {
    const { default: NavigationService } = require('../../utils/navigationService');
    
    renderWithRouter(
      <NavigationProvider>
        <div>Test</div>
      </NavigationProvider>
    );

    expect(NavigationService.setNavigate).toHaveBeenCalled();
  });
});