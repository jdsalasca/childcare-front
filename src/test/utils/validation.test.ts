import { describe, it, expect } from 'vitest';
import { Validations } from '../../utils/validations';
import { RegexPatterns } from '../../utils/regexPatterns';
import { GuardiansValidations, ChildrenValidations } from '../../components/contracts/utils/contractValidations';
import { Guardian } from '../../types/guardian';
import { ChildType } from '../../types/child';

describe('Validation Utilities', () => {
  describe('Validations Class', () => {
    describe('isValidEmail', () => {
      it('should validate correct email addresses', () => {
        const validEmails = [
          'user+tag@example.org',
          'test123@test-domain.com',
          'user@domain.com',
          'USER@DOMAIN.COM'
        ];

        validEmails.forEach(email => {
          expect(Validations.isValidEmail(email)).toBe(true);
        });
      });

      it('should reject invalid email addresses', () => {
        const invalidEmails = [
          'invalid-email',
          '@example.com',
          'user@',
          'user@.com',
          'user..name@example.com',
          'user@example..com',
          '',
          '   ',
          null as any,
          undefined as any
        ];

        invalidEmails.forEach(email => {
          expect(Validations.isValidEmail(email)).toBe(false);
        });
      });
    });

    describe('isValidPhoneNumber', () => {
      it('should validate correct phone numbers', () => {
        const validPhones = [
          '1234567890',
          '+1234567890',
          '123456789',
          '+123456789',
          '12345678901'
        ];

        validPhones.forEach(phone => {
          expect(Validations.isValidPhoneNumber(phone)).toBe(true);
        });
      });

      it('should reject invalid phone numbers', () => {
        const invalidPhones = [
          '123-456-7890',
          '(123) 456-7890',
          '123.456.7890',
          '123 456 7890',
          'abc123',
          '',
          '   ',
          null as any,
          undefined as any
        ];

        invalidPhones.forEach(phone => {
          expect(Validations.isValidPhoneNumber(phone)).toBe(false);
        });
      });
    });

    describe('capitalizeFirstLetter', () => {
      it('should capitalize first letter of each word', () => {
        expect(Validations.capitalizeFirstLetter('john doe')).toBe('John Doe');
        expect(Validations.capitalizeFirstLetter('MARY JANE')).toBe('Mary Jane');
        expect(Validations.capitalizeFirstLetter('juan carlos')).toBe('Juan Carlos');
        expect(Validations.capitalizeFirstLetter('')).toBe('');
        expect(Validations.capitalizeFirstLetter('a')).toBe('A');
      });

      it('should handle special characters and spaces', () => {
        expect(Validations.capitalizeFirstLetter('  john   doe  ')).toBe('  John   Doe  ');
        expect(Validations.capitalizeFirstLetter('juan-carlos')).toBe('Juan-carlos');
      });
    });
  });

  describe('RegexPatterns Class', () => {
    describe('namesAndLastNames', () => {
      it('should accept valid names with Spanish characters', () => {
        const validNames = [
          'Juan',
          'María',
          'José',
          'Ana',
          'Carlos',
          'Isabella',
          'José María',
          'Ana María',
          'Juan Carlos',
          'María José',
          'José-Luis',
          'Ana-Luisa'
        ];

        validNames.forEach(name => {
          expect(RegexPatterns.namesAndLastNames().test(name)).toBe(true);
        });
      });

      it('should reject invalid names', () => {
        const invalidNames = [
          'John123',
          'Mary@',
          'José#',
          'Ana$',
          '123John',
          'John@Doe',
          'Mary&Jane',
          'José+Carlos'
        ];

        invalidNames.forEach(name => {
          expect(RegexPatterns.namesAndLastNames().test(name)).toBe(false);
        });
      });
    });
  });

  describe('GuardiansValidations', () => {
    const createMockGuardian = (overrides: Partial<Guardian> = {}): Guardian => ({
      id: 1,
      name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Omaha',
      guardian_type_id: 1,
      titular: true,
      status: 'Active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      ...overrides
    });

    describe('validateGuardian', () => {
      it('should validate a complete guardian', () => {
        const guardian = createMockGuardian();
        const result = GuardiansValidations.validateGuardian(guardian);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject guardian with missing name', () => {
        const guardian = createMockGuardian({ name: '' });
        const result = GuardiansValidations.validateGuardian(guardian);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Name is required');
      });

      it('should reject guardian with invalid email', () => {
        const guardian = createMockGuardian({ email: 'invalid-email' });
        const result = GuardiansValidations.validateGuardian(guardian);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email format');
      });

      it('should reject guardian with short phone number', () => {
        const guardian = createMockGuardian({ phone: '123' });
        const result = GuardiansValidations.validateGuardian(guardian);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Phone number must be at least 10 digits');
      });

      it('should reject guardian with missing required fields', () => {
        const guardian = createMockGuardian({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: ''
        });
        const result = GuardiansValidations.validateGuardian(guardian);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(5);
        expect(result.errors).toContain('Name is required');
        expect(result.errors).toContain('Email is required');
        expect(result.errors).toContain('Phone number is required');
        expect(result.errors).toContain('Address is required');
        expect(result.errors).toContain('City is required');
      });
    });

    describe('validateGuardiansList', () => {
      it('should validate a list with valid guardians', () => {
        const guardians = [
          createMockGuardian({ id: 1, titular: true, email: 'john@example.com' }),
          createMockGuardian({ id: 2, titular: false, guardian_type_id: 2, email: 'jane@example.com' })
        ];
        
        const result = GuardiansValidations.validateGuardiansList(guardians);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject empty guardians list', () => {
        const result = GuardiansValidations.validateGuardiansList([]);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('At least one guardian is required');
      });

      it('should reject list without titular guardian', () => {
        const guardians = [
          createMockGuardian({ id: 1, titular: false }),
          createMockGuardian({ id: 2, titular: false })
        ];
        
        const result = GuardiansValidations.validateGuardiansList(guardians);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('At least one guardian must be titular');
      });

      it('should reject list with multiple titular guardians', () => {
        const guardians = [
          createMockGuardian({ id: 1, titular: true }),
          createMockGuardian({ id: 2, titular: true })
        ];
        
        const result = GuardiansValidations.validateGuardiansList(guardians);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Only one guardian can be titular');
      });

      it('should reject list with duplicate emails', () => {
        const guardians = [
          createMockGuardian({ id: 1, email: 'same@example.com' }),
          createMockGuardian({ id: 2, email: 'same@example.com' })
        ];
        
        const result = GuardiansValidations.validateGuardiansList(guardians);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Duplicate email addresses found');
      });

      it('should reject list with invalid guardians', () => {
        const guardians = [
          createMockGuardian({ id: 1, name: '', email: 'invalid' }),
          createMockGuardian({ id: 2, phone: '123' })
        ];
        
        const result = GuardiansValidations.validateGuardiansList(guardians);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('allHaveUniqueGuardianTypes', () => {
      it('should return true for guardians with unique types', () => {
        const guardians = [
          createMockGuardian({ guardian_type_id: 1 }),
          createMockGuardian({ guardian_type_id: 2 }),
          createMockGuardian({ guardian_type_id: 3 })
        ];
        
        expect(GuardiansValidations.allHaveUniqueGuardianTypes(guardians)).toBe(true);
      });

      it('should return false for guardians with duplicate types', () => {
        const guardians = [
          createMockGuardian({ guardian_type_id: 1 }),
          createMockGuardian({ guardian_type_id: 1 }),
          createMockGuardian({ guardian_type_id: 2 })
        ];
        
        expect(GuardiansValidations.allHaveUniqueGuardianTypes(guardians)).toBe(false);
      });

      it('should return false for empty list', () => {
        expect(GuardiansValidations.allHaveUniqueGuardianTypes([])).toBe(false);
      });
    });

    describe('availableGuardianTypes', () => {
      const guardianTypeOptions = [
        { id: 1, name: 'Father', status: 'Active' as const },
        { id: 2, name: 'Mother', status: 'Active' as const },
        { id: 3, name: 'Guardian', status: 'Active' as const }
      ];

      it('should return all types when no guardians exist', () => {
        const result = GuardiansValidations.availableGuardianTypes(guardianTypeOptions, []);
        
        expect(result).toHaveLength(3);
        expect(result).toEqual(guardianTypeOptions);
      });

      it('should exclude already assigned types', () => {
        const guardians = [
          createMockGuardian({ guardian_type_id: 1 }),
          createMockGuardian({ guardian_type_id: 2 })
        ];
        
        const result = GuardiansValidations.availableGuardianTypes(guardianTypeOptions, guardians);
        
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(3);
      });

      it('should include current guardian type when editing', () => {
        const guardians = [
          createMockGuardian({ guardian_type_id: 1 }),
          createMockGuardian({ guardian_type_id: 2 })
        ];
        
        const result = GuardiansValidations.availableGuardianTypes(guardianTypeOptions, guardians, 0);
        
        expect(result).toHaveLength(2);
        expect(result.some(type => type.id === 1)).toBe(true);
        expect(result.some(type => type.id === 3)).toBe(true);
      });
    });
  });

  describe('ChildrenValidations', () => {
    const createMockChild = (overrides: Partial<ChildType> = {}): ChildType => ({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      born_date: '2020-01-01',
      gender_id: 1,
      classroom: 'Toddler',
      status: 'Active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      age: null,
      ...overrides
    });

    describe('allChildrenHaveName', () => {
      it('should return true when all children have names', () => {
        const children = [
          createMockChild({ first_name: 'John' }),
          createMockChild({ first_name: 'Jane' })
        ];
        
        expect(ChildrenValidations.allChildrenHaveName(children)).toBe(true);
      });

      it('should return false when any child lacks a name', () => {
        const children = [
          createMockChild({ first_name: 'John' }),
          createMockChild({ first_name: '' }),
          createMockChild({ first_name: 'Jane' })
        ];
        
        expect(ChildrenValidations.allChildrenHaveName(children)).toBe(false);
      });

      it('should return false for empty list', () => {
        expect(ChildrenValidations.allChildrenHaveName([])).toBe(false);
      });
    });

    describe('validateChild', () => {
      it('should validate a complete child', () => {
        const child = createMockChild();
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject child with missing first name', () => {
        const child = createMockChild({ first_name: '' });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('First name is required');
      });

      it('should reject child with missing last name', () => {
        const child = createMockChild({ last_name: '' });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Last name is required');
      });

      it('should reject child with missing birth date', () => {
        const child = createMockChild({ born_date: undefined });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Date of birth is required');
      });

      it('should reject child with future birth date', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const child = createMockChild({ born_date: futureDate.toISOString() });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Date of birth cannot be in the future');
      });

      it('should reject child with missing gender', () => {
        const child = createMockChild({ gender_id: undefined });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Gender is required');
      });

      it('should reject child with invalid age', () => {
        const child = createMockChild({ age: 25 });
        const result = ChildrenValidations.validateChild(child);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Age must be between 0 and 18');
      });

      it('should reject null child', () => {
        const result = ChildrenValidations.validateChild(null as any);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Child data is required');
      });
    });
  });
}); 