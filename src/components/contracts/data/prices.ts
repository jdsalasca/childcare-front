export const PRICES = {
    REGISTRATION_FEE: 25.00,
    ACTIVITY_FEE: 25.00,
    RATES: {
      INFANT: 275.00,    // 6 weeks - 18 months
      TODDLER: 250.00,   // 18 months - 3 years
      PRESCHOOL: 225.00, // 3 - 5 years
      SCHOOL: 200.00     // 5 - 12 years
    },
    TRANSPORTATION: 50.00 // 2 ways
  } as const;
  
  // Age ranges for reference
  export const AGE_RANGES = {
    INFANT: { min: 0, max: 1.5, label: "Infant (6 weeks – 18 months)" },
    TODDLER: { min: 1.5, max: 3, label: "Toddler (18 months – 3 years)" },
    PRESCHOOL: { min: 3, max: 5, label: "Preschool (3 - 5 years)" },
    SCHOOL: { min: 5, max: 12, label: "School (5 - 12 years)" }
  } as const;