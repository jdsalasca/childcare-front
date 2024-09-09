export const programOptions = [
    { label: 'Infant', value: 'Infant', minWeek: 0, maxWeek: 78 }, // 6 weeks to 18 months (78 weeks)
    { label: 'Toddler', value: 'Toddler', minWeek: 78, maxWeek: 156 }, // 18 months to 3 years (156 weeks)
    { label: 'Pre-school', value: 'Preschool', minWeek: 156, maxWeek: 260 }, // 3 to 5 years (260 weeks)
    { label: 'School age', value: 'School age', minWeek: 260, maxWeek: 624 }, // 5 to 12 years (624 weeks)
    { label: 'Other', value: 'Other', minWeek: 260, maxWeek: 624000}, // 12 and forward ...
  ]
  /**
   * return billTypes
   */
  export const billTypes = [
    { label: '$100,00', value: 100 },
    { label: '$50,00', value: 50 },
    { label: '$20,00', value: 20 },
    { label: '$10,00', value: 10 },
    { label: '$5,00', value: 5 },
    { label: '$1,00', value: 1 }
];

  
export const determineProgram = (weeksOld) => {
    return programOptions.find(program => weeksOld >= program.minWeek && weeksOld <= program.maxWeek)?.value || '';
  };
export const calculateAge = (bornDate) => {
    const today = new Date();
    const birthDate = new Date(bornDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    // If the current month is before the birth month or it's the birth month but the current day is before the birth day, subtract 1 from age
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };

  export 
  const calculateWeeksOld = (bornDate) => {
    const today = new Date();
    const birthDate = new Date(bornDate);
    const diffTime = Math.abs(today - birthDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  export const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Programa de Subsidio', value: 'programa_de_subsidio' },
    { label: 'Co-pay Mensual', value: 'co_pay_mensual' }
  ];
    // Function to capitalize the first letter of each word
    export const capitalizeFirstLetter = (value) => {
      return value.replace(/\b\w/g, (char) => char.toUpperCase());
    };
  

  export const formatDateToYYYYMMDD = (dateInput) => {
    let date;

    // Check if the input is a Date object
    if (dateInput instanceof Date) {
        date = dateInput;
    } 
    // Check if the input is a string that can be parsed by Date
    else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
    } 
    // If the input is neither of the above, return an empty string or handle it as needed
    else {
        return '';
    }

    // Format the date as yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

  

export const defaultContractInfo = {
    todayDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    children: [

    ],
    guardians: [

    ],
    schedule:  {
      mondayStart: new Date().setHours(8, 0, 0, 0),
      mondayEnd: new Date().setHours(17, 0, 0, 0),
      tuesdayStart: new Date().setHours(8, 0, 0, 0),
      tuesdayEnd: new Date().setHours(17, 0, 0, 0),
      wednesdayStart: new Date().setHours(8, 0, 0, 0),
      wednesdayEnd: new Date().setHours(17, 0, 0, 0),
      thursdayStart: new Date().setHours(8, 0, 0, 0),
      thursdayEnd: new Date().setHours(17, 0, 0, 0),
      fridayStart: new Date().setHours(8, 0, 0, 0),
      fridayEnd: new Date().setHours(17, 0, 0, 0)
    },
    terms: {
        walkAroundNeighborhood: false,
        walkToThePark: false,
        walkAroundSchool: false,
        receiveManual: false,
        allowPhotos: false,
        allowExternalPhotos: false,
        specialExternalUsage: false,
        externalUsageAllowed: false
    }
};


export const defaultGuardian ={
  name: '',
  id: '',
  address: '',
  city: '',
  email:'',
  phone: '',
  guardianType: '',
  titular: false
}

export const fontStyles = {
  ITALIC: "italic",
  BOLD: "bold",
  NORMAL: "normal"
}

export const defaultChild = {
  name: '',                // Default empty string
  age: 0,                  // Default numeric value
  id: '',                  // Default empty string for ID
  bornDate: null,          // Default null for date
  program: '',             // Default empty string
  medicalInformation: {
    childName: '',         // Default empty string
    healthStatus: '',     // Default empty string
    treatment: '',        // Default empty string
    allergies: '',        // Default empty string
    instructions: '',     // Default empty string
    formula: '',          // Default empty string
    feedingTimes: ['', '', '', ''], // Default empty array with placeholders
    maxBottleTime: '',    // Default empty string
    minBottleTime: '',    // Default empty string
    bottleAmount: '',     // Default empty string
    feedingInstructions: '', // Default empty string
    otherFood: '',        // Default empty string
    foodAllergies: '',    // Default empty string
    followMealProgram: null, // Default null (can be true/false)
    permissions: {
      soap: false,        // Default false
      sanitizer: false,   // Default false
      rashCream: false,   // Default false
      teethingMedicine: false, // Default false
      sunscreen: false,   // Default false
      insectRepellent: false, // Default false
      other: ''           // Default empty string
    }
  }
};


export const validateSchedule = (schedule) => {
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  let isValid = true;

  dayKeys.forEach(day => {
    const start = schedule[`${day}Start`];
    const end = schedule[`${day}End`];
    
    if (start && end) {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const hoursDifference = (endTime - startTime) / (1000 * 60 * 60);

      if (startTime >= endTime || hoursDifference > 9) {
        isValid = false;
      }
    }
  });

  return isValid;
};


export const formatTime = (date) => {
  if (!date) return '';
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
