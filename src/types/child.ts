import { ChildMedicalInformation } from "./childMedicalInformation";

// Define the structure of the child data
export interface ChildType {
    id?: string;
    first_name: string;
    last_name: string;
    classroom: string | null;
    age: number | null;
    born_date: Date | string;
    program?: string;
    child_id?: number;
    middle_initial?: string;
    identification_number?: string;
    gender_id?: number;
    status: string;
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
    medicalInformation?: ChildMedicalInformation;
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
    id: '',
    program: '',
    first_name: '',
    last_name: '',
    born_date: "",
    status: "Active",
    classroom: null,
    medicalInformation: {
      childName: '',
      healthStatus: '',
      treatment: '',
      allergies: '',
      instructions: '',
      formula: '',
      feedingTimes: ['', '', '', ''],
      maxBottleTime: '',
      minBottleTime: '',
      bottleAmount: '',
      feedingInstructions: '',
      otherFood: '',
      foodAllergies: '',
      followMealProgram: null,
      permissions: {
        soap: false,
        sanitizer: false,
        rashCream: false,
        teethingMedicine: false,
        sunscreen: false,
        insectRepellent: false,
        other: ''
      }
    }
  };



