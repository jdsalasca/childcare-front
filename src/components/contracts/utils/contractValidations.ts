import { ChildType, defaultChild } from "types/child";
import { defaultGuardian, Guardian } from "../../../types/guardian";
import { Validations } from "../../../utils/validations";

interface GuardianType {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface SingleValidationResult {
  isValid: boolean;
  errorKey?: string;
  errorMessage?: string;
}

export const GuardiansValidations = {
  allHaveUniqueGuardianTypes: (guardians: Guardian[] = [defaultGuardian]): boolean => { 
    if (!guardians || guardians.length === 0) return false;
    
    const uniqueGuardianTypes = new Set(
      guardians
        .filter(guardian => guardian.guardian_type_id != null)
        .map(guardian => guardian.guardian_type_id)
    );
    return uniqueGuardianTypes.size === guardians.length;
  },
  
  availableGuardianTypes: (
    guardianTypeOptions: GuardianType[],
    guardians: Guardian[],
    index?: number
  ): GuardianType[] => {
    if (!guardianTypeOptions) {
      return [];
    }
    
    if (!guardians || guardians.length === 0) {
      return guardianTypeOptions;
    }

    if (index !== undefined && (index < 0 || index >= guardians.length)) {
      return guardianTypeOptions;
    }
    
    // Get the selected guardian type for the specified index
    const selectedType = index !== undefined ? guardians[index]?.guardian_type_id : null;
  
    // Filter out guardian types that are already selected by other guardians
    const availableGuardianTypes = guardianTypeOptions.filter(guardianType => {
      // Check if the guardian type is not already assigned to other guardians
      const isAssigned = guardians.some((guardian, guardianIndex) => 
        guardianIndex !== index && guardian.guardian_type_id === guardianType.id
      );
      
      // Include the selected type from the current index
      return !isAssigned || guardianType.id === selectedType;
    });
  
    return availableGuardianTypes;
  },

  validateGuardian: (guardian: Guardian): ValidationResult => {
    const errors: string[] = [];

    // Required fields validation
    if (!guardian.name || guardian.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!guardian.phone || guardian.phone.trim() === '') {
      errors.push('Phone number is required');
    } else if (guardian.phone.replace(/\D/g, '').length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    if (!guardian.email || guardian.email.trim() === '') {
      errors.push('Email is required');
    } else if (!Validations.isValidEmail(guardian.email)) {
      errors.push('Invalid email format');
    }

    if (!guardian.address || guardian.address.trim() === '') {
      errors.push('Address is required');
    }

    if (!guardian.city || guardian.city.trim() === '') {
      errors.push('City is required');
    }

    // Note: Guardian type doesn't have state and zip_code properties in the actual interface
    // These validations are commented out to match the actual type structure
    // if (!guardian.state || guardian.state.trim() === '') {
    //   errors.push('State is required');
    // }

    // if (!guardian.zip_code || guardian.zip_code.trim() === '') {
    //   errors.push('Zip code is required');
    // } else if (!/^\d{5}$/.test(guardian.zip_code)) {
    //   errors.push('Zip code must be 5 digits');
    // }

    // if (!guardian.document_number || guardian.document_number.trim() === '') {
    //   errors.push('Document number is required');
    // }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateGuardiansList: (guardians: Guardian[]): ValidationResult => {
    const errors: string[] = [];

    if (!guardians || guardians.length === 0) {
      errors.push('At least one guardian is required');
      return { isValid: false, errors };
    }

    // Check individual guardian validations
    guardians.forEach((guardian, index) => {
      const validationResult = GuardiansValidations.validateGuardian(guardian);
      if (!validationResult.isValid) {
        errors.push(...validationResult.errors.map(error => `Guardian ${index + 1}: ${error}`));
      }
    });

    // Check for titular guardian
    const titularGuardians = guardians.filter(guardian => guardian.titular);
    if (titularGuardians.length === 0) {
      errors.push('At least one guardian must be titular');
    } else if (titularGuardians.length > 1) {
      errors.push('Only one guardian can be titular');
    }

    // Check for duplicate emails
    const emails = guardians.map(g => g.email).filter(email => email && email.trim() !== '');
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      errors.push('Duplicate email addresses found');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateGuardians: (guardians: Guardian[]): SingleValidationResult => {
    if (!guardians || guardians.length === 0) {
      return { isValid: false, errorKey: 'noGuardiansProvided' };
    }

    // Check if all guardians have names
    const guardiansWithoutNames = guardians.filter(guardian => 
      !guardian.name || guardian.name.trim() === ''
    );
    if (guardiansWithoutNames.length > 0) {
      return { isValid: false, errorKey: 'allGuardiansMustHaveNames' };
    }

    // Check if all guardians have unique types
    if (!GuardiansValidations.allHaveUniqueGuardianTypes(guardians)) {
      return { isValid: false, errorKey: 'allGuardiansMustHaveUniqueTypes' };
    }

    // Check if at least one guardian is titular
    const titularGuardians = guardians.filter(guardian => guardian.titular);
    if (titularGuardians.length === 0) {
      return { isValid: false, errorKey: 'atLeastOneTitularGuardianRequired' };
    }

    return { isValid: true };
  }
};

export const ChildrenValidations = {
  allChildrenHaveName: (children: ChildType[] = [defaultChild]): boolean => {
    return children != null && children.length > 0 && 
           !children.some(child => !child.first_name || child.first_name.trim() === '');
  },

  validateChild: (child: ChildType): ValidationResult => {
    const errors: string[] = [];

    // Handle null/undefined child
    if (!child) {
      errors.push('Child data is required');
      return { isValid: false, errors };
    }

    // Required fields validation with proper type checking
    if (!child.first_name || typeof child.first_name !== 'string' || child.first_name.trim() === '') {
      errors.push('First name is required');
    }

    if (!child.last_name || typeof child.last_name !== 'string' || child.last_name.trim() === '') {
      errors.push('Last name is required');
    }

    if (!child.born_date) {
      errors.push('Date of birth is required');
    } else {
      const birthDate = new Date(child.born_date);
      const today = new Date();
      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future');
      }
    }

    if (!child.gender_id) {
      errors.push('Gender is required');
    }

    // Note: ChildType doesn't have document_type_id and document_number properties in the actual interface
    // These validations are commented out to match the actual type structure
    // if (!child.document_type_id) {
    //   errors.push('Document type is required');
    // }

    // if (!child.document_number || child.document_number.trim() === '') {
    //   errors.push('Document number is required');
    // } else if (child.document_number.trim().length < 6) {
    //   errors.push('Document number must be at least 6 characters');
    // }

    if (child.age !== undefined && child.age !== null) {
      if (child.age < 0 || child.age > 18) {
        errors.push('Age must be between 0 and 18');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateChildrenList: (children: ChildType[]): ValidationResult => {
    const errors: string[] = [];

    if (!children || children.length === 0) {
      errors.push('At least one child is required');
      return { isValid: false, errors };
    }

    // Check individual child validations
    children.forEach((child, index) => {
      const validationResult = ChildrenValidations.validateChild(child);
      if (!validationResult.isValid) {
        errors.push(...validationResult.errors.map(error => `Child ${index + 1}: ${error}`));
      }
    });

    // Check for duplicate identification numbers (using identification_number instead of document_number)
    const identificationNumbers = children
      .map(c => c.identification_number)
      .filter(idNum => idNum && idNum.trim() !== '');
    const uniqueIdNumbers = new Set(identificationNumbers);
    if (identificationNumbers.length !== uniqueIdNumbers.size) {
      errors.push('Duplicate document numbers found');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateChildren: (children: ChildType[]): SingleValidationResult => {
    if (!children || children.length === 0) {
      return { isValid: false, errorKey: 'noChildrenProvided' };
    }

    // Check if all children have first names
    const childrenWithoutNames = children.filter(child => 
      !child.first_name || child.first_name.trim() === ''
    );
    if (childrenWithoutNames.length > 0) {
      return { isValid: false, errorKey: 'allChildrenMustHaveNames' };
    }

    // Check if all children have birth dates
    const childrenWithoutBirthDates = children.filter(child => !child.born_date);
    if (childrenWithoutBirthDates.length > 0) {
      return { isValid: false, errorKey: 'allChildrenMustHaveBirthDates' };
    }

    return { isValid: true };
  }
};
  