export interface MedicalInfo {
    childName: string;
    healthStatus: string;
    treatment: string;
    allergies: string;
    instructions: string;
    formula: string;
    feedingTimes: string[];
    maxBottleTime: string;
    minBottleTime: string;
    bottleAmount: string;
    feedingInstructions: string;
    otherFood: string;
    foodAllergies: string;
    followMealProgram: boolean | null;
    permissions: {
      soap: boolean;
      sanitizer: boolean;
      rashCream: boolean;
      teethingMedicine: boolean;
      sunscreen: boolean;
      insectRepellent: boolean;
      other: string;
    }
  }