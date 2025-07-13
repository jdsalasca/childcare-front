import { describe, it, expect } from 'vitest';
import { Functions } from '../../utils/functions';
import { DateUtilsImpl } from '../../utils/dateUtils';
import { Validations } from '../../utils/validations';

describe('Utility Functions', () => {
  describe('Functions', () => {
    it('should format date to YYYY-MM-DD correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = Functions.formatDateToYYYYMMDD(date);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle null date input', () => {
      const result = Functions.formatDateToYYYYMMDD(null);
      expect(result).toBe('');
    });

    it('should handle invalid date input', () => {
      const invalidDate = new Date('invalid');
      const result = Functions.formatDateToYYYYMMDD(invalidDate);
      expect(result).toBe('');
    });

    it('should format numbers correctly', () => {
      expect(Functions.formatCurrency(123.45)).toBe('$123.45');
      expect(Functions.formatCurrency(0)).toBe('$0.00');
      expect(Functions.formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should handle edge cases in number formatting', () => {
      expect(Functions.formatCurrency(null)).toBe('$0.00');
      expect(Functions.formatCurrency(undefined)).toBe('$0.00');
      expect(Functions.formatCurrency(NaN)).toBe('$0.00');
    });
  });

  describe('DateUtils', () => {
    let dateUtils: DateUtilsImpl;

    beforeEach(() => {
      dateUtils = DateUtilsImpl.getInstance();
    });

    it('should convert date to UTC correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const utcDate = dateUtils.convertToUTC(date);
      expect(utcDate).toBeInstanceOf(Date);
    });

    it('should handle string date conversion', () => {
      const dateString = '2024-01-15';
      const utcDate = dateUtils.convertToUTC(dateString);
      expect(utcDate).toBeInstanceOf(Date);
    });

    it('should calculate disabled dates correctly', () => {
      const availableDates = [
        new Date('2024-01-01'),
        new Date('2024-01-02'),
        new Date('2024-01-03'),
      ];

      const disabledDates = dateUtils.calculateDisabledDates(availableDates);
      expect(Array.isArray(disabledDates)).toBe(true);
    });

    it('should handle empty available dates', () => {
      const disabledDates = dateUtils.calculateDisabledDates([]);
      expect(Array.isArray(disabledDates)).toBe(true);
    });
  });

  describe('Validations', () => {
    it('should validate email addresses correctly', () => {
      expect(Validations.isValidEmail('test@example.com')).toBe(true);
      expect(Validations.isValidEmail('invalid-email')).toBe(false);
      expect(Validations.isValidEmail('')).toBe(false);
      expect(Validations.isValidEmail('test@')).toBe(false);
      expect(Validations.isValidEmail('@example.com')).toBe(false);
    });

    it('should validate phone numbers correctly', () => {
      expect(Validations.isValidPhone('123-456-7890')).toBe(true);
      expect(Validations.isValidPhone('(123) 456-7890')).toBe(true);
      expect(Validations.isValidPhone('1234567890')).toBe(true);
      expect(Validations.isValidPhone('123')).toBe(false);
      expect(Validations.isValidPhone('')).toBe(false);
    });

    it('should validate required fields', () => {
      expect(Validations.isRequired('test')).toBe(true);
      expect(Validations.isRequired('')).toBe(false);
      expect(Validations.isRequired(null)).toBe(false);
      expect(Validations.isRequired(undefined)).toBe(false);
      expect(Validations.isRequired('   ')).toBe(false);
    });

    it('should validate numeric values', () => {
      expect(Validations.isNumeric('123')).toBe(true);
      expect(Validations.isNumeric('123.45')).toBe(true);
      expect(Validations.isNumeric('abc')).toBe(false);
      expect(Validations.isNumeric('')).toBe(false);
    });

    it('should validate date ranges', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const testDate = new Date('2024-01-15');

      expect(Validations.isDateInRange(testDate, startDate, endDate)).toBe(
        true
      );

      const outsideDate = new Date('2024-02-01');
      expect(Validations.isDateInRange(outsideDate, startDate, endDate)).toBe(
        false
      );
    });
  });

  describe('Performance Tests', () => {
    it('should handle large data processing efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 100,
      }));

      const startTime = performance.now();

      // Test filtering performance
      const filtered = largeArray.filter(item => item.value > 50);

      // Test mapping performance
      const mapped = filtered.map(item => ({ ...item, processed: true }));

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
      expect(mapped.length).toBeGreaterThan(0);
    });

    it('should handle recursive operations efficiently', () => {
      const nestedData = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep value',
              },
            },
          },
        },
      };

      const startTime = performance.now();

      // Test deep object traversal
      const getValue = (obj: any, path: string[]): any => {
        return path.reduce((current, key) => current?.[key], obj);
      };

      const result = getValue(nestedData, [
        'level1',
        'level2',
        'level3',
        'level4',
        'value',
      ]);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
      expect(result).toBe('deep value');
    });
  });
});
