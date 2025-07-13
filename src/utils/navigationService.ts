// Navigation service to handle routing consistently across the application
// This allows for SPA navigation when possible, with fallback to window.location

let navigateFunction: ((path: string) => void) | null = null;

export const NavigationService = {
  // Set the navigate function from React Router
  setNavigate: (navigate: (path: string) => void) => {
    navigateFunction = navigate;
  },

  // Navigate to a path, using React Router if available, otherwise fallback to window.location
  navigate: (path: string) => {
    if (navigateFunction) {
      // Use React Router navigation (SPA)
      navigateFunction(path);
    } else {
      // Fallback to window.location for cases where React Router is not available
      // This maintains functionality while we work on proper SPA navigation
      window.location.href = path;
    }
  },

  // Navigate to session expired page
  navigateToSessionExpired: () => {
    NavigationService.navigate('./session-expired');
  },

  // Navigate to login page
  navigateToLogin: () => {
    NavigationService.navigate('./login');
  },

  // Navigate to home page
  navigateToHome: () => {
    NavigationService.navigate('./');
  }
};

export default NavigationService;
