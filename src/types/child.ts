import { ChildMedicalInformation } from "./childMedicalInformation";

// Define the structure of the child data
export interface ChildType {
    static_id?: number;
    id?: number;
    first_name: string;
    last_name: string;
    name?: string;
    fullName?: string;
    classroom: string | null;
    age: number | null;
    born_date?: Date | string;
    program?: string;
    child_id?: number;
    middle_initial?: string;
    identification_number?: string;
    gender_id?: number;
    status: string;
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
    medicalInformation?: MedicalInformation;
  formulaInformation?: FormulaInformation;
  permissionsInformation?: PermissionsInformation;
  }

  export interface MedicalInformation {
    healthStatus: string;
    treatment: string;
    allergies: string;
    instructions: string;
  }
  
  export interface FormulaInformation {
    formula: string;
    feedingTimes: string[];
    maxBottleTime: string;
    minBottleTime: string;
    bottleAmount: string;
    feedingInstructions: string;
    otherFood: string;
    foodAllergies: string;
    followMealProgram: boolean | null;
  }
  
  export interface PermissionsInformation {
    soap: boolean;
    sanitizer: boolean;
    rashCream: boolean;
    teethingMedicine: boolean;
    sunscreen: boolean;
    insectRepellent: boolean;
    other: string;
  }
  
  
    // Add other properties as needed

export const defaultChild: ChildType = {
    first_name: '',
    last_name: '',
    classroom: null,
    age: null,
    born_date: "",
    program: "test",
    status: "Active",
    // Add other properties with defaults as needed
};


export const defaultChildMedical:ChildType = {
    age: 0,
    id: 0,
    program: '',
    first_name: '',
    last_name: '',
    born_date: "",
    status: "Active",
    classroom: null,
    medicalInformation: {
      healthStatus: '',
      treatment: '',
      allergies: '',
      instructions: '',
    },
    formulaInformation: {
      formula: '',
      feedingTimes: ['', '', '', ''],
      maxBottleTime: '',
      minBottleTime: '',
      bottleAmount: '',
      feedingInstructions: '',
      otherFood: '',
      foodAllergies: '',
      followMealProgram: null,
    },
    permissionsInformation  : {
      soap: false,
        sanitizer: false,
        rashCream: false,
        teethingMedicine: false,
      sunscreen: false,
      insectRepellent: false,
      other: ''
    }
    }



