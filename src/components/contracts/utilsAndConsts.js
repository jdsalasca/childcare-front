export const programOptions = [
    { label: 'Infant', value: 'Infant', minWeek: 0, maxWeek: 78 }, // 6 weeks to 18 months (78 weeks)
    { label: 'Toddler', value: 'Toddler', minWeek: 78, maxWeek: 156 }, // 18 months to 3 years (156 weeks)
    { label: 'Pre-school', value: 'Pre-school', minWeek: 156, maxWeek: 260 }, // 3 to 5 years (260 weeks)
    { label: 'School age', value: 'School age', minWeek: 260, maxWeek: 624 }, // 5 to 12 years (624 weeks)
    { label: 'Other', value: 'Other', minWeek: 260, maxWeek: 624000}, // 12 and forward ...
  ]
  
  
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
  export const guardianTypeOptions = [
    { label: 'Mother', value: 'Mother' },
    { label: 'Father', value: 'Father' },
    { label: 'Apoderado', value: 'Apoderado' }
  ];

  

export const defaultContractInfo = {
    todayDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    children: [

    ],
    guardians: [

    ],
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

const defaultGuardian ={
  name: '',
  id: '',
  address: '',
  city: '',
  phone: '',
  guardianType: ''
}
const defaultChild =         {
  name: '',
  age: '',
  id: '',
  bornDate: null,
  program: ''
}