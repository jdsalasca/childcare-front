import { AccessibilityUtils } from '../../utils/AccessibilityUtils';

describe('AccessibilityUtils', () => {
  beforeEach(() => {
    // Reset any DOM changes
    document.body.innerHTML = '';
  });

  describe('createAriaLabel', () => {
    it('should create proper ARIA labels', () => {
      const label = AccessibilityUtils.createAriaLabel('Submit', 'form');
      expect(label).toBe('Submit form');
    });

    it('should handle empty context', () => {
      const label = AccessibilityUtils.createAriaLabel('Button');
      expect(label).toBe('Button');
    });
  });

  describe('createAriaDescribedBy', () => {
    it('should create proper ARIA describedby attributes', () => {
      const describedBy = AccessibilityUtils.createAriaDescribedBy(['error-1', 'help-1']);
      expect(describedBy).toBe('error-1 help-1');
    });

    it('should handle empty array', () => {
      const describedBy = AccessibilityUtils.createAriaDescribedBy([]);
      expect(describedBy).toBe('');
    });
  });

  describe('createSkipLink', () => {
    it('should create skip link element', () => {
      const skipLink = AccessibilityUtils.createSkipLink('main', 'Skip to main content');
      
      expect(skipLink.tagName).toBe('A');
      expect(skipLink.getAttribute('href')).toBe('#main');
      expect(skipLink.textContent).toBe('Skip to main content');
      expect(skipLink.className).toContain('skip-link');
    });
  });

  describe('announceToScreenReader', () => {
    it('should create and announce message', () => {
      const message = 'Test announcement';
      AccessibilityUtils.announceToScreenReader(message);
      
      // Check if live region was created
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
    });
  });

  describe('focusManagement', () => {
    it('should trap focus within container', () => {
      // Create test elements
      const container = document.createElement('div');
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      const button3 = document.createElement('button');
      
      container.appendChild(button1);
      container.appendChild(button2);
      container.appendChild(button3);
      document.body.appendChild(container);

      // Test focus trap
      const focusTrap = AccessibilityUtils.createFocusTrap(container);
      expect(focusTrap).toBeDefined();

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('keyboardNavigation', () => {
    it('should handle arrow key navigation', () => {
      const items = ['item1', 'item2', 'item3'];
      const currentIndex = 1;
      
      const nextIndex = AccessibilityUtils.handleArrowNavigation(
        'ArrowDown',
        currentIndex,
        items.length
      );
      
      expect(nextIndex).toBe(2);
    });

    it('should handle arrow key navigation with wrap', () => {
      const items = ['item1', 'item2', 'item3'];
      const currentIndex = 2;
      
      const nextIndex = AccessibilityUtils.handleArrowNavigation(
        'ArrowDown',
        currentIndex,
        items.length
      );
      
      expect(nextIndex).toBe(0); // Should wrap to first item
    });
  });

  describe('semanticHTML', () => {
    it('should create semantic button', () => {
      const button = AccessibilityUtils.createSemanticButton('Test Button', 'button');
      
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.textContent).toBe('Test Button');
    });

    it('should create semantic link', () => {
      const link = AccessibilityUtils.createSemanticLink('Test Link', '/test');
      
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe('/test');
      expect(link.textContent).toBe('Test Link');
    });
  });

  describe('colorContrast', () => {
    it('should calculate color contrast ratio', () => {
      const ratio = AccessibilityUtils.calculateColorContrast('#000000', '#FFFFFF');
      expect(ratio).toBeGreaterThan(4.5); // Should meet WCAG AA standards
    });

    it('should validate color contrast', () => {
      const isValid = AccessibilityUtils.validateColorContrast('#000000', '#FFFFFF');
      expect(isValid).toBe(true);
    });
  });
});