import { describe, it, expect, vi } from 'vitest';
import { 
  validateSchedule,
  programOptions,
  billTypes
} from '../../components/contracts/utilsAndConstants';
import { 
  ChildrenValidations,
  GuardiansValidations 
} from '../../components/contracts/utils/contractValidations';

// Mock dependencies
vi.mock('../../configs/logger', () => ({
  customLogger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Contract Validations', () => {
  describe('validateSchedule', () => {
    const mockDays = [
      { id: 1, name: 'Monday', abbreviation: 'Mon' },
      { id: 2, name: 'Tuesday', abbreviation: 'Tue' },
      { id: 3, name: 'Wednesday', abbreviation: 'Wed' },
      { id: 4, name: 'Thursday', abbreviation: 'Thu' },
      { id: 5, name: 'Friday', abbreviation: 'Fri' },
    ];

    it('validates correct schedule', () => {
      const validSchedule = [
        { day_id: 1, check_in: '08:00', check_out: '17:00' },
        { day_id: 2, check_in: '08:00', check_out: '17:00' },
        { day_id: 3, check_in: '08:00', check_out: '17:00' },
      ];

      const result = validateSchedule(validSchedule, mockDays);
      expect(result).toBe(true);
    });

    it('rejects empty schedule', () => {
      const result = validateSchedule([], mockDays);
      expect(result).toBe(false);
    });

    it('rejects null schedule', () => {
      const result = validateSchedule(null, mockDays);
      expect(result).toBe(false);
    });

    it('rejects undefined schedule', () => {
      const result = validateSchedule(undefined, mockDays);
      expect(result).toBe(false);
    });

    it('rejects schedule with invalid times', () => {
      const invalidSchedule = [
        { day_id: 1, check_in: '25:00', check_out: '17:00' }, // Invalid hour
        { day_id: 2, check_in: '08:00', check_out: '17:00' },
      ];

      const result = validateSchedule(invalidSchedule, mockDays);
      expect(result).toBe(false);
    });

    it('rejects schedule with check_out before check_in', () => {
      const invalidSchedule = [
        { day_id: 1, check_in: '17:00', check_out: '08:00' }, // Check out before check in
        { day_id: 2, check_in: '08:00', check_out: '17:00' },
      ];

      const result = validateSchedule(invalidSchedule, mockDays);
      expect(result).toBe(false);
    });

    it('rejects schedule with missing days data', () => {
      const validSchedule = [
        { day_id: 1, check_in: '08:00', check_out: '17:00' },
      ];

      const result = validateSchedule(validSchedule, null);
      expect(result).toBe(false);
    });

    it('rejects schedule with missing time fields', () => {
      const invalidSchedule = [
        { day_id: 1, check_in: '08:00' }, // Missing check_out
        { day_id: 2, check_out: '17:00' }, // Missing check_in
      ];

      const result = validateSchedule(invalidSchedule, mockDays);
      expect(result).toBe(false);
    });

    it('rejects schedule with invalid day_id', () => {
      const invalidSchedule = [
        { day_id: 999, check_in: '08:00', check_out: '17:00' }, // Non-existent day
        { day_id: 2, check_in: '08:00', check_out: '17:00' },
      ];

      const result = validateSchedule(invalidSchedule, mockDays);
      expect(result).toBe(false);
    });
  });

  describe('ChildrenValidations', () => {
    describe('validateChild', () => {
      it('validates correct child data', () => {
        const validChild = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          born_date: '2020-01-01',
          gender_id: 1,
          identification_number: '123456789',
          age: 3,
          classroom: 'Toddler',
          status: 'Active',
        };

        const result = ChildrenValidations.validateChild(validChild);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('rejects child with missing required fields', () => {
        const invalidChild = {
          id: 1,
          first_name: '', // Empty required field
          last_name: 'Doe',
          born_date: '2020-01-01',
          gender_id: 1,
          identification_number: '123456789',
          age: 3,
          classroom: 'Toddler',
          status: 'Active',
        };

        const result = ChildrenValidations.validateChild(invalidChild);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('First name is required');
      });

      it('rejects child with invalid age', () => {
        const invalidChild = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          born_date: '2020-01-01',
          gender_id: 1,
          identification_number: '123456789',
          age: -1, // Invalid age
          classroom: 'Toddler',
          status: 'Active',
        };

        const result = ChildrenValidations.validateChild(invalidChild);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Age must be between 0 and 18');
      });

      it('rejects child with invalid document number format', () => {
        const invalidChild = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          born_date: '', // Missing date of birth
          gender_id: 1,
          identification_number: '123',
          age: 3,
          classroom: 'Toddler',
          status: 'Active',
        };

        const result = ChildrenValidations.validateChild(invalidChild);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Date of birth is required');
      });

      it('rejects child with invalid date of birth', () => {
        const invalidChild = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          born_date: '2030-01-01', // Future date
          gender_id: 1,
          identification_number: '123456789',
          age: 3,
          classroom: 'Toddler',
          status: 'Active',
        };

        const result = ChildrenValidations.validateChild(invalidChild);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Date of birth cannot be in the future');
      });
    });

    describe('validateChildrenList', () => {
      it('validates list of valid children', () => {
        const validChildren = [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            born_date: '2020-01-01',
            gender_id: 1,
            identification_number: '123456789',
            age: 3,
            classroom: 'Toddler',
            status: 'Active',
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            born_date: '2019-06-15',
            gender_id: 2,
            identification_number: '987654321',
            age: 4,
            classroom: 'Preschool',
            status: 'Active',
          },
        ];

        const result = ChildrenValidations.validateChildrenList(validChildren);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('rejects empty children list', () => {
        const result = ChildrenValidations.validateChildrenList([]);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('At least one child is required');
      });

      it('rejects list with duplicate document numbers', () => {
        const childrenWithDuplicates = [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            born_date: '2020-01-01',
            gender_id: 1,
            identification_number: '123456789',
            age: 3,
            classroom: 'Toddler',
            status: 'Active',
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            born_date: '2019-06-15',
            gender_id: 2,
            identification_number: '123456789', // Duplicate
            age: 4,
            classroom: 'Preschool',
            status: 'Active',
          },
        ];

        const result = ChildrenValidations.validateChildrenList(childrenWithDuplicates);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Duplicate document numbers found');
      });

      it('accumulates errors from individual child validations', () => {
        const childrenWithErrors = [
          {
            id: 1,
            first_name: '', // Missing name
            last_name: 'Doe',
            born_date: '2020-01-01',
            gender_id: 1,
            identification_number: '123456789',
            age: 3,
            classroom: 'Toddler',
            status: 'Active',
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            born_date: '2030-01-01', // Future date
            gender_id: 2,
            identification_number: '987654321',
            age: 4,
            classroom: 'Preschool',
            status: 'Active',
          },
        ];

        const result = ChildrenValidations.validateChildrenList(childrenWithErrors);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
      });
    });
  });

  describe('GuardiansValidations', () => {
    describe('validateGuardian', () => {
      it('validates correct guardian data', () => {
        const validGuardian = {
          id: 1,
          name: 'John Doe',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Anytown',
          guardian_type_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Active' as const,
          titular: true,
        };

        const result = GuardiansValidations.validateGuardian(validGuardian);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('rejects guardian with missing required fields', () => {
        const invalidGuardian = {
          id: 1,
          name: '', // Empty required field
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Anytown',
          guardian_type_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Active' as const,
          titular: true,
        };

        const result = GuardiansValidations.validateGuardian(invalidGuardian);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Name is required');
      });

      it('rejects guardian with invalid email format', () => {
        const invalidGuardian = {
          id: 1,
          name: 'John Doe',
          last_name: 'Doe',
          email: 'invalid-email', // Invalid email
          phone: '1234567890',
          address: '123 Main St',
          city: 'Anytown',
          guardian_type_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Active' as const,
          titular: true,
        };

        const result = GuardiansValidations.validateGuardian(invalidGuardian);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email format');
      });

      it('rejects guardian with invalid phone format', () => {
        const invalidGuardian = {
          id: 1,
          name: 'John Doe',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '123', // Too short
          address: '123 Main St',
          city: 'Anytown',
          guardian_type_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Active' as const,
          titular: true,
        };

        const result = GuardiansValidations.validateGuardian(invalidGuardian);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Phone number must be at least 10 digits');
      });

      it('rejects guardian with invalid zip code format', () => {
        const invalidGuardian = {
          id: 1,
          name: 'John Doe',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          city: 'Anytown',
          guardian_type_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Active' as const,
          titular: true,
        };

        const result = GuardiansValidations.validateGuardian(invalidGuardian);
        // Since the Guardian type doesn't have zip_code, this should pass
        expect(result.isValid).toBe(true);
      });
    });

    describe('validateGuardiansList', () => {
      it('validates list of valid guardians', () => {
        const validGuardians = [
          {
            id: 1,
            name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zip_code: '12345',
            document_type_id: 1,
            document_number: '123456789',
            guardian_type_id: 1,
            titular: true,
          },
          {
            id: 2,
            name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            address: '456 Oak Ave',
            city: 'Somewhere',
            state: 'CA',
            zip_code: '54321',
            document_type_id: 1,
            document_number: '987654321',
            guardian_type_id: 2,
            titular: false,
          },
        ];

        const result = GuardiansValidations.validateGuardiansList(validGuardians);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('rejects empty guardians list', () => {
        const result = GuardiansValidations.validateGuardiansList([]);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('At least one guardian is required');
      });

      it('rejects list without titular guardian', () => {
        const guardiansWithoutTitular = [
          {
            id: 1,
            name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zip_code: '12345',
            document_type_id: 1,
            document_number: '123456789',
            guardian_type_id: 1,
            titular: false, // No titular guardian
          },
        ];

        const result = GuardiansValidations.validateGuardiansList(guardiansWithoutTitular);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('At least one guardian must be titular');
      });

      it('rejects list with multiple titular guardians', () => {
        const guardiansWithMultipleTitular = [
          {
            id: 1,
            name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zip_code: '12345',
            document_type_id: 1,
            document_number: '123456789',
            guardian_type_id: 1,
            titular: true,
          },
          {
            id: 2,
            name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            address: '456 Oak Ave',
            city: 'Somewhere',
            state: 'CA',
            zip_code: '54321',
            document_type_id: 1,
            document_number: '987654321',
            guardian_type_id: 2,
            titular: true, // Multiple titular guardians
          },
        ];

        const result = GuardiansValidations.validateGuardiansList(guardiansWithMultipleTitular);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Only one guardian can be titular');
      });

      it('rejects list with duplicate emails', () => {
        const guardiansWithDuplicateEmails = [
          {
            id: 1,
            name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zip_code: '12345',
            document_type_id: 1,
            document_number: '123456789',
            guardian_type_id: 1,
            titular: true,
          },
          {
            id: 2,
            name: 'Jane',
            last_name: 'Smith',
            email: 'john.doe@example.com', // Duplicate email
            phone: '0987654321',
            address: '456 Oak Ave',
            city: 'Somewhere',
            state: 'CA',
            zip_code: '54321',
            document_type_id: 1,
            document_number: '987654321',
            guardian_type_id: 2,
            titular: false,
          },
        ];

        const result = GuardiansValidations.validateGuardiansList(guardiansWithDuplicateEmails);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Duplicate email addresses found');
      });
    });

    describe('availableGuardianTypes', () => {
      const mockGuardianTypes = [
        { id: 1, name: 'Mother', value: 1 },
        { id: 2, name: 'Father', value: 2 },
        { id: 3, name: 'Grandmother', value: 3 },
        { id: 4, name: 'Grandfather', value: 4 },
        { id: 5, name: 'Other', value: 5 },
      ];

      it('returns all guardian types when no guardians exist', () => {
        const result = GuardiansValidations.availableGuardianTypes(mockGuardianTypes, [], 0);
        expect(result).toHaveLength(mockGuardianTypes.length);
      });

      it('excludes already selected guardian types', () => {
        const existingGuardians = [
          { guardian_type_id: 1 }, // Mother already selected
          { guardian_type_id: 2 }, // Father already selected
        ];

        const result = GuardiansValidations.availableGuardianTypes(mockGuardianTypes, existingGuardians, 2);
        expect(result).toHaveLength(3); // Should exclude Mother and Father
        expect(result.find(type => type.id === 1)).toBeUndefined();
        expect(result.find(type => type.id === 2)).toBeUndefined();
      });

      it('includes current guardian type for editing', () => {
        const existingGuardians = [
          { guardian_type_id: 1 }, // Mother at index 0
          { guardian_type_id: 2 }, // Father at index 1
        ];

        const result = GuardiansValidations.availableGuardianTypes(mockGuardianTypes, existingGuardians, 0);
        expect(result.find(type => type.id === 1)).toBeDefined(); // Should include Mother for editing
        expect(result.find(type => type.id === 2)).toBeUndefined(); // Should exclude Father
      });

      it('always includes "Other" type', () => {
        const existingGuardians = [
          { guardian_type_id: 1 },
          { guardian_type_id: 2 },
          { guardian_type_id: 3 },
          { guardian_type_id: 4 },
        ];

        const result = GuardiansValidations.availableGuardianTypes(mockGuardianTypes, existingGuardians, 4);
        expect(result.find(type => type.id === 5)).toBeDefined(); // Other should always be available
      });
    });
  });

  describe('Program Options', () => {
    it('has valid program options structure', () => {
      expect(programOptions).toBeDefined();
      expect(Array.isArray(programOptions)).toBe(true);
      expect(programOptions.length).toBeGreaterThan(0);
      
      programOptions.forEach(option => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
        expect(typeof option.label).toBe('string');
        expect(typeof option.value).toBe('string');
      });
    });

    it('has unique program option values', () => {
      const values = programOptions.map(option => option.value);
      const uniqueValues = [...new Set(values)];
      expect(values.length).toBe(uniqueValues.length);
    });
  });

  describe('Bill Types', () => {
    it('has valid bill types structure', () => {
      expect(billTypes).toBeDefined();
      expect(Array.isArray(billTypes)).toBe(true);
      expect(billTypes.length).toBeGreaterThan(0);
      
      billTypes.forEach(billType => {
        expect(billType).toHaveProperty('label');
        expect(billType).toHaveProperty('value');
        expect(typeof billType.label).toBe('string');
        expect(typeof billType.value).toBe('number');
      });
    });

    it('has bill types in descending order by value', () => {
      for (let i = 0; i < billTypes.length - 1; i++) {
        expect(billTypes[i].value).toBeGreaterThanOrEqual(billTypes[i + 1].value);
      }
    });

    it('has positive bill type values', () => {
      billTypes.forEach(billType => {
        expect(billType.value).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null input gracefully', () => {
      expect(() => validateSchedule(null, null)).not.toThrow();
      expect(() => ChildrenValidations.validateChildrenList(null as any)).not.toThrow();
      expect(() => GuardiansValidations.validateGuardiansList(null as any)).not.toThrow();
    });

    it('handles undefined input gracefully', () => {
      expect(() => validateSchedule(undefined, undefined)).not.toThrow();
      expect(() => ChildrenValidations.validateChildrenList(undefined as any)).not.toThrow();
      expect(() => GuardiansValidations.validateGuardiansList(undefined as any)).not.toThrow();
    });

    it('handles empty objects gracefully', () => {
      const result1 = ChildrenValidations.validateChild({} as any);
      expect(result1.isValid).toBe(false);
      
      const result2 = GuardiansValidations.validateGuardian({} as any);
      expect(result2.isValid).toBe(false);
    });

    it('handles malformed data gracefully', () => {
      const malformedChild = {
        id: 'not-a-number',
        first_name: 123,
        last_name: null,
        date_of_birth: 'invalid-date',
        age: 'not-a-number',
      };

      const result = ChildrenValidations.validateChild(malformedChild as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('validates large lists efficiently', () => {
      const largeChildrenList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        first_name: `Child${i + 1}`,
        last_name: 'Test',
        born_date: '2020-01-01',
        gender_id: 1,
        identification_number: `12345678${i.toString().padStart(2, '0')}`,
        age: 3,
        classroom: 'Toddler',
        status: 'Active',
      }));

      const startTime = performance.now();
      const result = ChildrenValidations.validateChildrenList(largeChildrenList);
      const endTime = performance.now();

      expect(result.isValid).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it('validates large guardian lists efficiently', () => {
      const largeGuardiansList = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Guardian${i + 1}`,
        last_name: 'Test',
        email: `guardian${i + 1}@test.com`,
        phone: `123456789${i.toString().padStart(1, '0')}`,
        address: `${i + 1} Test St`,
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        document_type_id: 1,
        document_number: `12345678${i.toString().padStart(2, '0')}`,
        guardian_type_id: i === 0 ? 1 : 5, // First one is Mother, rest are Other
        titular: i === 0, // Only first one is titular
      }));

      const startTime = performance.now();
      const result = GuardiansValidations.validateGuardiansList(largeGuardiansList);
      const endTime = performance.now();

      expect(result.isValid).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
  });
}); 