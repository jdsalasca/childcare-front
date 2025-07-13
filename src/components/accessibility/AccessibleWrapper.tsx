import React, { ReactNode, useRef, useEffect } from 'react';
import { AccessibilityUtils } from '../../utils/AccessibilityUtils';

interface AccessibleWrapperProps {
  children: ReactNode;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'additions removals' | 'all' | 'removals' | 'text';
  className?: string;
  id?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  focusable?: boolean;
  skipLink?: boolean;
  skipLinkText?: string;
}

export const AccessibleWrapper: React.FC<AccessibleWrapperProps> = ({
  children,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-live': ariaLive,
  'aria-atomic': ariaAtomic,
  'aria-relevant': ariaRelevant,
  className,
  id,
  tabIndex,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  focusable = false,
  skipLink = false,
  skipLinkText = 'Skip to main content',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const accessibility = AccessibilityUtils.getInstance();

  useEffect(() => {
    if (focusable && wrapperRef.current) {
      const focusManagement = accessibility.createFocusManagement();
      const cleanup = focusManagement.trapFocus(wrapperRef);
      return cleanup;
    }
  }, [focusable, accessibility]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(event);
    }

    // Default keyboard navigation
    const keyboardHandlers = accessibility.createKeyboardNavigationHandlers(
      () => {
        // Enter key handler
        if (wrapperRef.current) {
          const focusableElement = wrapperRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          if (focusableElement) {
            focusableElement.click();
          }
        }
      },
      () => {
        // Escape key handler
        event.preventDefault();
      }
    );

    keyboardHandlers.onKeyDown?.(event as any);
  };

  const accessibilityProps = {
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-live': ariaLive,
    'aria-atomic': ariaAtomic,
    'aria-relevant': ariaRelevant,
    tabIndex: focusable ? (tabIndex ?? 0) : tabIndex,
    id,
    onKeyDown: handleKeyDown,
    onKeyUp,
    onKeyPress,
  };

  return (
    <>
      {skipLink && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
          aria-label={skipLinkText}
        >
          {skipLinkText}
        </a>
      )}
      <div
        ref={wrapperRef}
        className={className}
        {...accessibilityProps}
      >
        {children}
      </div>
    </>
  );
};

// Specialized accessibility components
export const AccessibleForm: React.FC<{
  children: ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
  'aria-label'?: string;
  className?: string;
}> = ({ children, onSubmit, 'aria-label': ariaLabel, className }) => {
  return (
    <AccessibleWrapper
      role="form"
      aria-label={ariaLabel}
      className={className}
    >
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </AccessibleWrapper>
  );
};

export const AccessibleSection: React.FC<{
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}> = ({ children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className }) => {
  return (
    <AccessibleWrapper
      role="region"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {children}
    </AccessibleWrapper>
  );
};

export const AccessibleList: React.FC<{
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}> = ({ children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className }) => {
  return (
    <AccessibleWrapper
      role="list"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      {children}
    </AccessibleWrapper>
  );
};

export const AccessibleListItem: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <AccessibleWrapper
      role="listitem"
      className={className}
    >
      {children}
    </AccessibleWrapper>
  );
};

export const AccessibleCard: React.FC<{
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  id?: string;
}> = ({ children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, className, id }) => {
  return (
    <AccessibleWrapper
      role="article"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={className}
      id={id}
    >
      {children}
    </AccessibleWrapper>
  );
};

export const AccessibleDialog: React.FC<{
  children: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  open?: boolean;
}> = ({ children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, className, open = false }) => {
  return (
    <AccessibleWrapper
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-hidden={!open}
      className={className}
      focusable={open}
    >
      {children}
    </AccessibleWrapper>
  );
};