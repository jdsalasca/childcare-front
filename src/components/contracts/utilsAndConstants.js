
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

  

export const defaultContractInfoFinished ={
  "todayDate": "2024-09-18T02:50:50.256Z",
  "startDate": "2024-09-18T02:50:50.256Z",
  "endDate": "2024-09-18T02:50:50.256Z",
  "children": [
     {
        "id": 382,
        "child_id": 7,
        "born_date": "2018-02-16T23:00:00.000000Z",
        "first_name": "test",
        "status": "Active",
        "created_at": "2024-09-07T05:28:24.000000Z",
        "updated_at": "2024-09-12T17:37:03.000000Z",
        "last_name": "qweqLemus",
        "middle_initial": "B",
        "identification_number": null,
        "gender_id": 2,
        "classroom": "qweqwe",
        "age": 6
     },
     {
        "id": 386,
        "child_id": 11,
        "born_date": "2020-09-09T22:00:00.000000Z",
        "first_name": "123123",
        "status": "Active",
        "created_at": "2024-09-07T09:28:24.000000Z",
        "updated_at": "2024-09-12T19:37:03.000000Z",
        "last_name": "ad",
        "middle_initial": "F",
        "identification_number": null,
        "gender_id": 1,
        "classroom": "asdasd",
        "age": 4
     }
  ],
  "guardians": [
     {
        "id": 15,
        "name": "Juan",
        "last_name": "Salas",
        "address": "Calle 123",
        "city": "Ciudad de México",
        "phone": "123456789",
        "guardian_type_id": 3,
        "created_at": "2024-09-16T22:17:12.000000Z",
        "updated_at": "2024-09-16T22:17:12.000000Z",
        "email": "salasdavid@gmail.com",
        "status": "Active"
     },
     {
        "id": 12,
        "name": "Kamala",
        "last_name": "Harris",
        "address": "Sidney",
        "city": "Sidney",
        "phone": "321123321",
        "guardian_type_id": 2,
        "created_at": "2024-09-07T06:02:02.000000Z",
        "updated_at": "2024-09-10T03:38:52.000000Z",
        "email": "camilo@gmail.com",
        "status": "Active"
     },
     {
        "id": 11,
        "name": "Osama",
        "last_name": "Bin Ladin",
        "address": "Avenida Siempre Viva",
        "city": "Tunja",
        "phone": "3211233211",
        "guardian_type_id": 1,
        "created_at": "2024-09-07T05:21:07.000000Z",
        "updated_at": "2024-09-10T06:14:08.000000Z",
        "email": "jdsalasca@unal.edu.co",
        "status": "Active"
     }
  ],
  "schedule": [
     {
        "contract_id": 32,
        "day_id": 1,
        "check_in": "10:00",
        "check_out": "17:00",
        "updated_at": "2024-09-18T02:55:21.000000Z",
        "created_at": "2024-09-18T02:55:21.000000Z",
        "id": 21
     },
     {
        "contract_id": 32,
        "day_id": 2,
        "check_in": "08:00",
        "check_out": "15:48",
        "updated_at": "2024-09-18T02:55:21.000000Z",
        "created_at": "2024-09-18T02:55:21.000000Z",
        "id": 22
     },
     {
        "contract_id": 32,
        "day_id": 3,
        "check_in": "06:00",
        "check_out": "19:00",
        "updated_at": "2024-09-18T02:55:21.000000Z",
        "created_at": "2024-09-18T02:55:21.000000Z",
        "id": 23
     },
     {
        "contract_id": 32,
        "day_id": 4,
        "check_in": "08:00",
        "check_out": "17:00",
        "updated_at": "2024-09-18T02:55:21.000000Z",
        "created_at": "2024-09-18T02:55:21.000000Z",
        "id": 24
     },
     {
        "contract_id": 32,
        "day_id": 5,
        "check_in": "08:00",
        "check_out": "17:00",
        "updated_at": "2024-09-18T02:55:21.000000Z",
        "created_at": "2024-09-18T02:55:21.000000Z",
        "id": 25
     }
  ],
  "terms": {
     "contract_id": 32,
     "share_photos_with_families": true,
     "allow_other_parents_to_take_photos": true,
     "use_photos_for_art_and_activities": true,
     "use_photos_for_promotion": true,
     "walk_around_neighborhood": true,
     "walk_to_park_or_transport": true,
     "walk_in_school": true,
     "guardian_received_manual": true,
     "updated_at": "2024-09-18T02:54:09.000000Z",
     "created_at": "2024-09-18T02:54:09.000000Z",
     "id": 1
  },
  "contract_number": "ChildCare.10.3801",
  "contract_id": 32,
  "start_date": "2024-09-09T05:00:00.000Z",
  "end_date": "2024-09-15T05:00:00.000Z",
  "payment_method_id": 2,
  "totalAmount": "",
  "total_to_pay": "300.12"
}

export const defaultContractInfo = {
    todayDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    children: [

    ],
    guardians: [],
    schedule:  undefined,
    terms: {
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
