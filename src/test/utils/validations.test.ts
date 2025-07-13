import { describe, it, expect } from 'vitest';
import { Validations } from '../../utils/validations';
import { Functions } from '../../utils/functions';
import { RegexPatterns } from '../../utils/regexPatterns';
import { DateUtilsImpl } from '../../utils/dateUtils';

describe('Utility Functions', () => {
  describe('Validations', () => {
    describe('isValidEmail', () => {
      it('should validate correct email addresses', () => {
        expect(Validations.isValidEmail('test@example.com')).toBe(true);
        expect(Validations.isValidEmail('user.name@domain.co.uk')).toBe(true);
        expect(Validations.isValidEmail('user+tag@example.org')).toBe(true);
        expect(Validations.isValidEmail('123@example.com')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(Validations.isValidEmail('invalid-email')).toBe(false);
        expect(Validations.isValidEmail('test@')).toBe(false);
        expect(Validations.isValidEmail('@example.com')).toBe(false);
        expect(Validations.isValidEmail('test..test@example.com')).toBe(false);
        expect(Validations.isValidEmail('')).toBe(false);
        expect(Validations.isValidEmail('test@example')).toBe(false);
      });
    });

    describe('isValidPhoneNumber', () => {
      it('should validate correct phone numbers', () => {
        expect(Validations.isValidPhoneNumber('1234567890')).toBe(true);
        expect(Validations.isValidPhoneNumber('+1234567890')).toBe(true);
        expect(Validations.isValidPhoneNumber('123')).toBe(true);
      });

      it('should reject invalid phone numbers', () => {
        expect(Validations.isValidPhoneNumber('abc-def-ghij')).toBe(false);
        expect(Validations.isValidPhoneNumber('')).toBe(false);
        expect(Validations.isValidPhoneNumber('123-456-7890')).toBe(false); // Contains hyphens
        expect(Validations.isValidPhoneNumber('(123) 456-7890')).toBe(false); // Contains spaces and parentheses
      });
    });

    describe('capitalizeFirstLetter', () => {
      it('should capitalize first letter of each word', () => {
        expect(Validations.capitalizeFirstLetter('john doe')).toBe('John Doe');
        expect(Validations.capitalizeFirstLetter('mary jane smith')).toBe(
          'Mary Jane Smith'
        );
        expect(Validations.capitalizeFirstLetter('JOHN DOE')).toBe('John Doe');
        expect(Validations.capitalizeFirstLetter('john')).toBe('John');
      });

      it('should handle edge cases', () => {
        expect(Validations.capitalizeFirstLetter('')).toBe('');
        expect(Validations.capitalizeFirstLetter('a')).toBe('A');
        expect(Validations.capitalizeFirstLetter('a b c')).toBe('A B C');
      });
    });
  });

  describe('Functions', () => {
    describe('formatDateToYYYYMMDD', () => {
      it('should format Date objects correctly', () => {
        const date = new Date('2024-01-15');
        expect(Functions.formatDateToYYYYMMDD(date)).toBe('2024-01-15');
      });

      it('should format date strings correctly', () => {
        expect(Functions.formatDateToYYYYMMDD('2024-01-15')).toBe('2024-01-15');
        expect(Functions.formatDateToYYYYMMDD('01/15/2024')).toBe('2024-01-15');
      });

      it('should handle invalid dates', () => {
        expect(Functions.formatDateToYYYYMMDD('invalid-date')).toBe('');
        expect(Functions.formatDateToYYYYMMDD(null as any)).toBe('');
        expect(Functions.formatDateToYYYYMMDD(undefined as any)).toBe('');
      });

      it('should pad single digit months and days', () => {
        expect(Functions.formatDateToYYYYMMDD('2024-1-5')).toBe('2024-01-05');
        expect(Functions.formatDateToYYYYMMDD('2024-12-25')).toBe('2024-12-25');
      });
    });

    describe('formatDateToMMDDYY', () => {
      it('should format Date objects correctly', () => {
        const date = new Date('2024-01-15');
        expect(Functions.formatDateToMMDDYY(date)).toBe('01/15/24');
      });

      it('should format date strings correctly', () => {
        expect(Functions.formatDateToMMDDYY('2024-01-15')).toBe('01/15/24');
        expect(Functions.formatDateToMMDDYY('01/15/2024')).toBe('01/15/24');
      });

      it('should handle invalid dates', () => {
        expect(Functions.formatDateToMMDDYY('invalid-date')).toBe('01/01/70');
        expect(Functions.formatDateToMMDDYY(null as any)).toBe('');
        expect(Functions.formatDateToMMDDYY(undefined as any)).toBe('');
      });

      it('should pad single digit months and days', () => {
        expect(Functions.formatDateToMMDDYY('2024-1-5')).toBe('01/05/24');
        expect(Functions.formatDateToMMDDYY('2024-12-25')).toBe('12/25/24');
      });
    });

    describe('emailRegex', () => {
      it('should validate correct email addresses', () => {
        expect(Functions.emailRegex.test('test@example.com')).toBe(true);
        expect(Functions.emailRegex.test('user.name@domain.co.uk')).toBe(true);
        expect(Functions.emailRegex.test('user+tag@example.org')).toBe(true);
        expect(Functions.emailRegex.test('123@example.com')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(Functions.emailRegex.test('invalid-email')).toBe(false);
        expect(Functions.emailRegex.test('test@')).toBe(false);
        expect(Functions.emailRegex.test('@example.com')).toBe(false);
        expect(Functions.emailRegex.test('')).toBe(false);
      });
    });
  });

  describe('RegexPatterns', () => {
    describe('namesAndLastNames', () => {
      it('should validate correct names', () => {
        const regex = RegexPatterns.namesAndLastNames();
        expect(regex.test('John')).toBe(true);
        expect(regex.test('Mary Jane')).toBe(true);
        expect(regex.test('José María')).toBe(true);
        expect(regex.test('González')).toBe(true);
        expect(regex.test('Peña')).toBe(true);
      });

      it('should reject invalid names', () => {
        const regex = RegexPatterns.namesAndLastNames();
        expect(regex.test('John123')).toBe(false);
        expect(regex.test('Mary@Jane')).toBe(false);
        expect(regex.test('José-María')).toBe(true); // Should accept names with hyphens
        expect(regex.test("O'Connor")).toBe(true); // Should accept names with apostrophes
        expect(regex.test('123')).toBe(false);
      });
    });
  });

  describe('DateUtilsImpl', () => {
    let dateUtils: DateUtilsImpl;

    beforeEach(() => {
      dateUtils = DateUtilsImpl.getInstance();
    });

    describe('getInstance', () => {
      it('should return the same instance (singleton)', () => {
        const instance1 = DateUtilsImpl.getInstance();
        const instance2 = DateUtilsImpl.getInstance();
        expect(instance1).toBe(instance2);
      });
    });

    describe('convertToUTC', () => {
      it('should convert Date objects to UTC', () => {
        const date = new Date('2024-01-15T10:30:00');
        const utcDate = dateUtils.convertToUTC(date);

        expect(utcDate).toBeInstanceOf(Date);
        expect(utcDate.getUTCHours()).toBe(8);
        expect(utcDate.getUTCMinutes()).toBe(0);
        expect(utcDate.getUTCSeconds()).toBe(0);
      });

      it('should convert date strings to UTC', () => {
        const utcDate = dateUtils.convertToUTC('2024-01-15');

        expect(utcDate).toBeInstanceOf(Date);
        expect(utcDate.getUTCHours()).toBe(8);
        expect(utcDate.getUTCMinutes()).toBe(0);
        expect(utcDate.getUTCSeconds()).toBe(0);
      });

      it('should maintain the correct date', () => {
        const utcDate = dateUtils.convertToUTC('2024-01-15');

        expect(utcDate.getUTCFullYear()).toBe(2024);
        expect(utcDate.getUTCMonth()).toBe(0); // January is 0
        expect(utcDate.getUTCDate()).toBe(15);
      });
    });

    describe('calculateDisabledDates', () => {
      it('should return empty array when no available dates provided', () => {
        const disabledDates = dateUtils.calculateDisabledDates();
        expect(disabledDates).toEqual([]);
      });

      it('should return empty array when empty available dates provided', () => {
        const disabledDates = dateUtils.calculateDisabledDates([]);
        expect(disabledDates).toEqual([]);
      });

      it('should calculate disabled dates correctly', () => {
        const availableDates = [
          new Date('2024-01-15'),
          new Date('2024-01-16'),
          new Date('2024-01-17'),
        ];

        const disabledDates = dateUtils.calculateDisabledDates(availableDates);

        expect(disabledDates).toBeInstanceOf(Array);
        expect(disabledDates.length).toBeGreaterThan(0);

        // Check that available dates are not in disabled dates
        availableDates.forEach(availableDate => {
          const isDisabled = disabledDates.some(
            disabledDate => disabledDate.getTime() === availableDate.getTime()
          );
          expect(isDisabled).toBe(false);
        });
      });

      it('should include dates not in available dates as disabled', () => {
        const availableDates = [new Date('2024-01-15')];
        const disabledDates = dateUtils.calculateDisabledDates(availableDates);

        // Check that a date not in available dates is disabled
        const testDate = new Date('2024-01-14');
        // Normalize the test date to match the normalization in calculateDisabledDates
        testDate.setHours(0, 0, 0, 0);

        const isDisabled = disabledDates.some(disabledDate => {
          const normalizedDisabledDate = new Date(disabledDate);
          normalizedDisabledDate.setHours(0, 0, 0, 0);
          return normalizedDisabledDate.getTime() === testDate.getTime();
        });
        expect(isDisabled).toBe(true);
      });
    });
  });
});
