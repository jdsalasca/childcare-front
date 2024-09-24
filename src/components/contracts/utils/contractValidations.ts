import { ChildType, defaultChild } from "types/child";
import { defaultGuardian, Guardian } from "../../../types/guardian";



  export const GuardiansValidations = {
    allHaveUniqueGuardianTypes: (guardians: Guardian[] =  Array.of(defaultGuardian)): boolean => { 
      const uniqueGuardianTypes = new Set(guardians.map(guardian => guardian.guardian_type_id));
      return uniqueGuardianTypes.size === guardians.length;
    },
    availableGuardianTypes: (
      guardianTypeOptions: GuardianType[],
      guardians: Guardian[],
      index: number
    ): GuardianType[] => {
      // Get the selected guardian type for the specified index
      const selectedType = guardians[index]?.guardian_type_id;
    
      // Filter out guardian types that are already selected by other guardians
      const availableGuardianTypes = guardianTypeOptions.filter(guardianType => {
        // Check if the guardian type is not already assigned to other guardians
        const isAssigned = guardians.some(guardian => guardian.guardian_type_id === guardianType.id);
        
        // Include the selected type from the current index
        return !isAssigned || guardianType.id === selectedType;
      });
    
      return availableGuardianTypes;
    }
    
  };
  
  export const ChildrenValidations = {
    allChildrenHaveName: (children: ChildType[] = Array.of(defaultChild)): boolean => {
      return children != null && children.length > 0 && !children.some(child => child.first_name == null);
    },
  };
  