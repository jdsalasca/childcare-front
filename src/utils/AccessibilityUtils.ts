import { customLogger } from 'configs/logger';

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?:
    | 'additions'
    | 'additions removals'
    | 'all'
    | 'removals'
    | 'text';
  'aria-checked'?: boolean;
  role?: string;
  tabIndex?: number;
  id?: string;
}

export interface KeyboardNavigationProps {
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
}

export class AccessibilityUtils {
  private static instance: AccessibilityUtils;

  private constructor() {}

  public static getInstance(): AccessibilityUtils {
    if (!AccessibilityUtils.instance) {
      AccessibilityUtils.instance = new AccessibilityUtils();
    }
    return AccessibilityUtils.instance;
  }

  /**
   * Creates accessibility props for form inputs
   */
  public createInputAccessibilityProps(
    label: string,
    required: boolean = false,
    invalid: boolean = false,
    describedBy?: string
  ): AccessibilityProps {
    return {
      'aria-label': label,
      'aria-required': required,
      'aria-invalid': invalid,
      'aria-describedby': describedBy,
      role: 'textbox',
    };
  }

  /**
   * Creates accessibility props for buttons
   */
  public createButtonAccessibilityProps(
    label: string,
    pressed: boolean = false,
    expanded: boolean = false
  ): AccessibilityProps {
    return {
      'aria-label': label,
      'aria-pressed': pressed,
      'aria-expanded': expanded,
      role: 'button',
      tabIndex: 0,
    };
  }

  /**
   * Creates accessibility props for dropdowns
   */
  public createDropdownAccessibilityProps(
    label: string,
    expanded: boolean = false,
    required: boolean = false
  ): AccessibilityProps {
    return {
      'aria-label': label,
      'aria-expanded': expanded,
      'aria-required': required,
      role: 'combobox',
      tabIndex: 0,
    };
  }

  /**
   * Creates accessibility props for checkboxes
   */
  public createCheckboxAccessibilityProps(
    label: string,
    checked: boolean = false,
    required: boolean = false
  ): AccessibilityProps {
    return {
      'aria-label': label,
      'aria-checked': checked,
      'aria-required': required,
      role: 'checkbox',
      tabIndex: 0,
    };
  }

  /**
   * Creates accessibility props for radio buttons
   */
  public createRadioAccessibilityProps(
    label: string,
    checked: boolean = false,
    required: boolean = false
  ): AccessibilityProps {
    return {
      'aria-label': label,
      'aria-checked': checked,
      'aria-required': required,
      role: 'radio',
      tabIndex: 0,
    };
  }

  /**
   * Creates keyboard navigation handlers
   */
  public createKeyboardNavigationHandlers(
    onEnter?: () => void,
    onEscape?: () => void,
    onSpace?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void,
    onArrowLeft?: () => void,
    onArrowRight?: () => void
  ): KeyboardNavigationProps {
    return {
      onKeyDown: (event: KeyboardEvent) => {
        switch (event.key) {
          case 'Enter':
            event.preventDefault();
            onEnter?.();
            break;
          case 'Escape':
            event.preventDefault();
            onEscape?.();
            break;
          case ' ':
            event.preventDefault();
            onSpace?.();
            break;
          case 'ArrowUp':
            event.preventDefault();
            onArrowUp?.();
            break;
          case 'ArrowDown':
            event.preventDefault();
            onArrowDown?.();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            onArrowLeft?.();
            break;
          case 'ArrowRight':
            event.preventDefault();
            onArrowRight?.();
            break;
        }
      },
    };
  }

  /**
   * Creates focus management utilities
   */
  public createFocusManagement() {
    return {
      /**
       * Focuses the first focusable element in a container
       */
      focusFirstElement: (containerRef: { current: HTMLElement | null }) => {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      },

      /**
       * Traps focus within a container
       */
      trapFocus: (containerRef: { current: HTMLElement | null }) => {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = Array.from(
          container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Tab') {
            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        container.addEventListener('keydown', handleKeyDown);

        return () => {
          container.removeEventListener('keydown', handleKeyDown);
        };
      },
    };
  }

  /**
   * Creates screen reader announcements
   */
  public createScreenReaderAnnouncements() {
    return {
      /**
       * Announces a message to screen readers
       */
      announce: (
        message: string,
        priority: 'polite' | 'assertive' = 'polite'
      ) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove the announcement after it's been read
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      },

      /**
       * Announces form validation errors
       */
      announceValidationError: (fieldName: string, errorMessage: string) => {
        this.createScreenReaderAnnouncements().announce(
          `${fieldName}: ${errorMessage}`,
          'assertive'
        );
      },

      /**
       * Announces successful actions
       */
      announceSuccess: (message: string) => {
        this.createScreenReaderAnnouncements().announce(message, 'polite');
      },
    };
  }

  /**
   * Creates skip links for keyboard navigation
   */
  public createSkipLinks() {
    return {
      /**
       * Renders skip links for main content areas
       */
      renderSkipLinks: () => {
        return {
          type: 'div',
          props: {
            className: 'skip-links',
            children: [
              {
                type: 'a',
                props: {
                  href: '#main-content',
                  className: 'skip-link',
                  children: 'Skip to main content',
                },
              },
              {
                type: 'a',
                props: {
                  href: '#navigation',
                  className: 'skip-link',
                  children: 'Skip to navigation',
                },
              },
              {
                type: 'a',
                props: {
                  href: '#footer',
                  className: 'skip-link',
                  children: 'Skip to footer',
                },
              },
            ],
          },
        };
      },
    };
  }

  /**
   * Validates accessibility compliance
   */
  public validateAccessibility(element: HTMLElement): string[] {
    const issues: string[] = [];

    // Check for missing alt text on images
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push(`Image ${index + 1} missing alt text or aria-label`);
      }
    });

    // Check for missing labels on form inputs
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = element.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push(`Input ${index + 1} missing label or aria-label`);
      }
    });

    // Check for proper heading structure
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push(
          `Heading structure issue: ${heading.tagName} follows h${previousLevel}`
        );
      }
      previousLevel = level;
    });

    // Check for sufficient color contrast (basic check)
    const textElements = element.querySelectorAll(
      'p, span, div, h1, h2, h3, h4, h5, h6'
    );
    textElements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;

      // Basic contrast check (this is a simplified version)
      if (color === backgroundColor) {
        issues.push(`Potential contrast issue with text element ${index + 1}`);
      }
    });

    return issues;
  }

  /**
   * Generates unique IDs for accessibility
   */
  public generateId(prefix: string = 'element'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates ARIA live regions for dynamic content
   */
  public createLiveRegion(
    id: string,
    priority: 'polite' | 'assertive' = 'polite'
  ): AccessibilityProps {
    return {
      'aria-live': priority,
      'aria-atomic': true,
      'aria-relevant': 'all',
      id,
    };
  }
}

// Export a default instance for easy use
export const accessibilityUtils = AccessibilityUtils.getInstance();

// CSS for skip links
export const accessibilityStyles = `
  .skip-links {
    position: absolute;
    top: -40px;
    left: 6px;
    z-index: 1000;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    transition: top 0.3s;
  }

  .skip-link:focus {
    top: 6px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
