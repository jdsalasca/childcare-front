import { customLogger } from 'configs/logger';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  sanitize?: (value: any) => any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export class InputValidator {
  private static instance: InputValidator;

  private constructor() {}

  public static getInstance(): InputValidator {
    if (!InputValidator.instance) {
      InputValidator.instance = new InputValidator();
    }
    return InputValidator.instance;
  }

  /**
   * Validates and sanitizes input based on provided rules
   */
  public validate(
    value: any,
    rules: ValidationRule,
    fieldName: string = 'field'
  ): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = value;

    // Sanitize input first
    if (rules.sanitize) {
      try {
        sanitizedValue = rules.sanitize(value);
      } catch (error) {
        customLogger.error(`Sanitization error for ${fieldName}:`, error);
        errors.push('Invalid input format');
      }
    }

    // Required validation
    if (
      rules.required &&
      (!sanitizedValue || sanitizedValue.toString().trim() === '')
    ) {
      errors.push(`${fieldName} is required`);
    }

    // Skip other validations if value is empty and not required
    if (!sanitizedValue || sanitizedValue.toString().trim() === '') {
      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue,
      };
    }

    // Length validations
    if (rules.minLength && sanitizedValue.toString().length < rules.minLength) {
      errors.push(
        `${fieldName} must be at least ${rules.minLength} characters`
      );
    }

    if (rules.maxLength && sanitizedValue.toString().length > rules.maxLength) {
      errors.push(
        `${fieldName} must be no more than ${rules.maxLength} characters`
      );
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(sanitizedValue.toString())) {
      errors.push(`${fieldName} format is invalid`);
    }

    // Custom validation
    if (rules.custom) {
      try {
        const customResult = rules.custom(sanitizedValue);
        if (typeof customResult === 'string') {
          errors.push(customResult);
        } else if (!customResult) {
          errors.push(`${fieldName} validation failed`);
        }
      } catch (error) {
        customLogger.error(`Custom validation error for ${fieldName}:`, error);
        errors.push('Validation error');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue,
    };
  }

  /**
   * Sanitizes HTML content to prevent XSS
   */
  public sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitizes email input
   */
  public sanitizeEmail(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input.trim().toLowerCase();
  }

  /**
   * Sanitizes numeric input
   */
  public sanitizeNumber(input: any): number | null {
    if (input === null || input === undefined || input === '') return null;

    const num = parseFloat(input.toString());
    return isNaN(num) ? null : num;
  }

  /**
   * Sanitizes text input
   */
  public sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validates email format
   */
  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  public validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: password,
    };
  }

  /**
   * Validates phone number format
   */
  public validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Validates date format
   */
  public validateDate(date: any): boolean {
    if (!date) return false;

    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  /**
   * Validates currency amount
   */
  public validateCurrency(amount: any): boolean {
    if (amount === null || amount === undefined || amount === '') return false;

    const num = parseFloat(amount.toString());
    return !isNaN(num) && num >= 0;
  }

  /**
   * Predefined validation rules for common field types
   */
  public getValidationRules() {
    return {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        sanitize: this.sanitizeEmail.bind(this),
        custom: (value: string) =>
          this.validateEmail(value) || 'Invalid email format',
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value: string) => {
          const result = this.validatePassword(value);
          return result.isValid || result.errors[0];
        },
      },
      username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        sanitize: this.sanitizeText.bind(this),
      },
      phone: {
        required: false,
        custom: (value: string) =>
          !value || this.validatePhone(value) || 'Invalid phone format',
        sanitize: (value: string) =>
          value ? value.replace(/[\s\-\(\)]/g, '') : '',
      },
      currency: {
        required: false,
        custom: (value: any) =>
          !value || this.validateCurrency(value) || 'Invalid amount',
        sanitize: this.sanitizeNumber.bind(this),
      },
      text: {
        required: false,
        maxLength: 255,
        sanitize: this.sanitizeText.bind(this),
      },
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        sanitize: this.sanitizeText.bind(this),
      },
    };
  }
}

// Export a default instance for easy use
export const inputValidator = InputValidator.getInstance();
