
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

  export const calculateWeeksOld = (bornDate) => {
    const today = new Date();
    const birthDate = new Date(bornDate);
    const diffTime = Math.abs(today - birthDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  

export const defaultContractInfoFinished = {
  "todayDate": "2024-09-10T04:16:56.132Z",
  "startDate": "2024-09-10T04:16:56.132Z",
  "endDate": "2024-09-10T04:16:56.132Z",
  "children": [
    {
      "id": 382,
      "child_id": 7,
      "born_date": "2018-02-16T23:00:00.000000Z",
      "first_name": "Emmanuel",
      "status": "Active",
      "created_at": "2024-09-07T11:28:24.000000Z",
      "updated_at": "2024-09-07T11:28:24.000000Z",
      "last_name": "Banderas Lemus",
      "middle_initial": "B",
      "identification_number": null,
      "gender_id": 2,
      "classroom": "School Age 003580 Dinosaurus",
      "age": 6
    },
    {
      "first_name": "El Niño De Las ",
      "born_date": "2024-09-07T22:00:00.000000Z",
      "gender_id": 1,
      "last_name": "Camille",
      "middle_initial": "C",
      "child_id": 0,
      "updated_at": "2024-09-10T04:24:01.000000Z",
      "created_at": "2024-09-10T04:24:01.000000Z",
      "id": 544,
      "age": 0
    }
  ],
  "guardians": [
    {
      "id": 14,
      "name": "Vladimir Putin",
      "last_name": "Valhalla",
      "address": "El Kremlin",
      "city": "Moscu",
      "phone": "+1123123312",
      "guardian_type_id": 1,
      "created_at": "2024-09-10T03:32:35.000000Z",
      "updated_at": "2024-09-10T04:27:18.000000Z",
      "email": "putin@gmail.com",
      "status": "Active",
      "titular": true
    },
    {
      "id": 11,
      "name": "Osama",
      "last_name": "Bin Ladin",
      "address": "Avenida Siempre Viva",
      "city": "Tunja",
      "phone": "3211233211",
      "guardian_type_id": 3,
      "created_at": "2024-09-07T05:21:07.000000Z",
      "updated_at": "2024-09-10T04:27:18.000000Z",
      "email": "jdsalasc@unal.edu.co",
      "status": "Active",
      "titular": false
    }
  ],
  "schedule": [
    {
      "contract_id": 26,
      "day_id": 1,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-09-10T04:40:34.000000Z",
      "created_at": "2024-09-10T04:40:34.000000Z",
      "id": 14
    },
    {
      "contract_id": 26,
      "day_id": 2,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-09-10T04:40:34.000000Z",
      "created_at": "2024-09-10T04:40:34.000000Z",
      "id": 15
    },
    {
      "contract_id": 26,
      "day_id": 3,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-09-10T04:40:34.000000Z",
      "created_at": "2024-09-10T04:40:34.000000Z",
      "id": 13
    },
    {
      "contract_id": 26,
      "day_id": 4,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-09-10T04:40:34.000000Z",
      "created_at": "2024-09-10T04:40:34.000000Z",
      "id": 12
    },
    {
      "contract_id": 26,
      "day_id": 5,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-09-10T04:40:34.000000Z",
      "created_at": "2024-09-10T04:40:34.000000Z",
      "id": 11
    }
  ],
  "terms": {
    "id": 8,
    "contract_id": 26,
    "share_media_with_families": true,
    "allow_other_parents": false,
    "use_for_art_and_activities": false,
    "promote_childcare": false,
    "walk_around_neighborhood": false,
    "walk_to_park_or_transport": true,
    "walk_in_school": true,
    "guardian_received_manual": false,
    "created_at": "2024-09-10T04:29:03.000000Z",
    "updated_at": "2024-09-10T04:29:03.000000Z"
  },
  "contract_number": "ChildCare.10.7560",
  "contract_id": 26,
  "start_date": "2024-09-03T05:00:00.000Z",
  "end_date": "2024-09-11T05:00:00.000Z",
  "payment_method_id": 1,
  "totalAmount": "",
  "total_to_pay": "12.00"
}

export const defaultContractInfo = {
    todayDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    children: [

    ],
    guardians: [
        {
            name: 'Juan',
            address: 'Calle 123',
            city: 'Ciudad de México',
            phone: '123456789',
            guardianType: 'Titular',
            titular: true
        }

    ],
    schedule:  undefined,
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


export const validateSchedule = (schedule, days) => {
  
  if(days == null || schedule==null) return false;
  let isValid = true;

  days.forEach(day => {
    const start = schedule[`${day}check_in`];
    const end = schedule[`${day}check_out`];
    
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
