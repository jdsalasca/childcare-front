
export interface ChildMedicalInformation {
    childName:           string;
    healthStatus:        string;
    treatment:           string;
    allergies:           string;
    instructions:        string;
    formula:             string;
    feedingTimes:        string[];
    maxBottleTime:       string;
    minBottleTime:       string;
    bottleAmount:        string;
    feedingInstructions: string;
    otherFood:           string;
    foodAllergies:       string;
    followMealProgram:   null;
    permissions:         Permissions;
}

export interface Permissions {
    soap:             boolean;
    sanitizer:        boolean;
    rashCream:        boolean;
    teethingMedicine: boolean;
    sunscreen:        boolean;
    insectRepellent:  boolean;
    other:            string;
}