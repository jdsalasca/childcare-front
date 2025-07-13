/**
 * Navigation service for handling application navigation
 */
class NavigationService {
  /**
   * Navigate to the session expired page
   */
  static navigateToSessionExpired(): void {
    window.location.href = './session-expired';
  }
}

export default NavigationService; 