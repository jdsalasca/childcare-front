import { Guardian } from '../../types/guardian';

export class GuardiansFactory {
  static getTitularGuardian(guardians: Guardian[]): Guardian | undefined {
    return guardians.find(guardian => guardian.titular);
  }

  static validateTitularGuardian(guardians: Guardian[]): boolean {
    // Check for exactly one titular
    const titularGuardians = guardians.filter(g => g.titular === true);
    if (titularGuardians.length !== 1) {
      return false;
    }

    // Check for unique guardian types
    const guardianTypes = guardians.map(g => g.guardian_type_id);
    const uniqueTypes = new Set(guardianTypes);
    if (uniqueTypes.size !== guardians.length) {
      return false;
    }

    return true;
  }

  static mergeAndCreateWithTitularStatus(
    updatedGuardians: Guardian[],
    originalGuardians: Guardian[]
  ): Guardian[] {
    return updatedGuardians.map(guardian => ({
      ...guardian,
      titular:
        originalGuardians.find(og => og.id === guardian.id)?.titular || false,
    }));
  }

  static createGuardiansAllWithTitularStatus(
    guardians: Guardian[]
  ): Guardian[] {
    return guardians.map(guardian => ({
      ...guardian,
      titular: guardian.titular || false,
    }));
  }
}
