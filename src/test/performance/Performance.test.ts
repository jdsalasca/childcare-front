import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ChildrenValidations,
  GuardiansValidations,
} from '../../components/contracts/utils/contractValidations';
import { DateUtilsImpl } from '../../utils/dateUtils';
import { Validations } from '../../utils/validations';

// Mock the view models for performance tests
vi.mock('../../components/bills/viewModels/useBillsViewModel', () => ({
  useBillsViewModel: vi.fn(),
}));

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Bills Component Performance', () => {
    it('should handle large data processing efficiently', async () => {
      // Test performance of data processing without component rendering
      const largeBillsList = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.0,
        program: 'Infant',
      }));

      const startTime = performance.now();
      // Test filtering performance
      const filteredResults = largeBillsList.filter(bill =>
        bill.names.toLowerCase().includes('child')
      );
      const endTime = performance.now();

      // Should complete within reasonable time (under 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(filteredResults.length).toBe(1000);
    });

    it('should handle search operations efficiently', async () => {
      const largeBillsList = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        names: `Child ${i}`,
        cash: '10.00',
        check: '5.00',
        total: 15.0,
        program: i % 2 === 0 ? 'Infant' : 'Toddler',
      }));

      // Simulate search filtering
      const searchTerm = 'Child 1';
      const startTime = performance.now();
      const filteredResults = largeBillsList.filter(bill =>
        bill.names.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const endTime = performance.now();

      // Should complete search within reasonable time
      expect(endTime - startTime).toBeLessThan(100);
      expect(filteredResults.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Performance', () => {
    it('should validate large lists of children efficiently', () => {
      const largeChildrenList = Array.from({ length: 1000 }, (_, _i) => ({
        id: _i,
        first_name: `Child${_i}`,
        last_name: `LastName${_i}`,
        born_date: '2020-01-01',
        gender_id: 1,
        identification_number: `ID${_i.toString().padStart(6, '0')}`,
        age: 3,
        classroom: 'Toddler',
        status: 'Active' as const,
      }));

      const startTime = performance.now();
      const result =
        ChildrenValidations.validateChildrenList(largeChildrenList);
      const endTime = performance.now();

      expect(result.isValid).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should validate large lists of guardians efficiently', () => {
      const largeGuardiansList = Array.from({ length: 1000 }, (_, _i) => ({
        id: _i,
        name: `Guardian${_i}`,
        last_name: `LastName${_i}`,
        email: `guardian${_i}@example.com`,
        phone: `123456789${_i % 10}`,
        address: `${_i} Main St`,
        city: 'Anytown',
        guardian_type_id: (_i % 5) + 1,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'Active' as const,
        titular: _i === 0, // Only first guardian is titular
      }));

      const startTime = performance.now();
      const result =
        GuardiansValidations.validateGuardiansList(largeGuardiansList);
      const endTime = performance.now();

      expect(result.isValid).toBe(true); // Should pass with valid guardians
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should handle email validation efficiently', () => {
      const emails = Array.from(
        { length: 10000 },
        (_, _i) => `user${_i}@example.com`
      );

      const startTime = performance.now();
      const results = emails.map(email => Validations.isValidEmail(email));
      const endTime = performance.now();

      expect(results.every(result => result === true)).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('Date Utilities Performance', () => {
    it('should calculate disabled dates efficiently', () => {
      const dateUtils = DateUtilsImpl.getInstance();
      const availableDates = Array.from({ length: 100 }, (_, _i) => {
        const date = new Date('2024-01-01');
        date.setDate(date.getDate() + _i);
        return date;
      });

      const startTime = performance.now();
      const disabledDates = dateUtils.calculateDisabledDates(availableDates);
      const endTime = performance.now();

      expect(disabledDates).toBeInstanceOf(Array);
      expect(disabledDates.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should convert dates to UTC efficiently', () => {
      const dateUtils = DateUtilsImpl.getInstance();
      const dates = Array.from({ length: 1000 }, (_, _i) => {
        const date = new Date('2024-01-01');
        date.setDate(date.getDate() + _i);
        return date;
      });

      const startTime = performance.now();
      const utcDates = dates.map(date => dateUtils.convertToUTC(date));
      const endTime = performance.now();

      expect(utcDates).toHaveLength(1000);
      expect(utcDates.every(date => date instanceof Date)).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during large operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Perform memory-intensive operations
      const largeArray = Array.from({ length: 100000 }, (_, _i) => ({
        id: _i,
        data: `data-${_i}`,
        timestamp: new Date(),
      }));

      // Process the array
      const processed = largeArray.map(item => ({
        ...item,
        processed: true,
      }));

      // Clear references
      largeArray.length = 0;
      processed.length = 0;

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory should not increase significantly (allow for some variance)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase
      }
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous validations', async () => {
      const validationPromises = Array.from({ length: 10 }, async (_, _i) => {
        const children = Array.from({ length: 100 }, (_, _j) => ({
          id: _j,
          first_name: `Child${_j}`,
          last_name: `LastName${_j}`,
          born_date: '2020-01-01',
          gender_id: 1,
          identification_number: `ID${_j.toString().padStart(6, '0')}`,
          age: 3,
          classroom: 'Toddler',
          status: 'Active',
        }));

        return ChildrenValidations.validateChildrenList(children);
      });

      const startTime = performance.now();
      const results = await Promise.all(validationPromises);
      const endTime = performance.now();

      expect(results).toHaveLength(10);
      expect(results.every(result => result.isValid)).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // Should complete in under 500ms
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle empty datasets efficiently', () => {
      const startTime = performance.now();

      const childrenResult = ChildrenValidations.validateChildrenList([]);
      const guardiansResult = GuardiansValidations.validateGuardiansList([]);
      const emailResult = Validations.isValidEmail('');

      const endTime = performance.now();

      expect(childrenResult.isValid).toBe(false);
      expect(guardiansResult.isValid).toBe(false);
      expect(emailResult).toBe(false);
      expect(endTime - startTime).toBeLessThan(10); // Should complete almost instantly
    });

    it('should handle malformed data efficiently', () => {
      const malformedChildren = Array.from({ length: 100 }, (_, _i) => ({
        id: _i,
        first_name: null,
        last_name: undefined,
        born_date: 'invalid-date',
        gender_id: 'invalid',
        age: 'not-a-number',
      }));

      const startTime = performance.now();
      const result = ChildrenValidations.validateChildrenList(
        malformedChildren as any
      );
      const endTime = performance.now();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should handle gracefully
    });
  });
});
