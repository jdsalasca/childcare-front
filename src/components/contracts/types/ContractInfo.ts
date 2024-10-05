import { ChildType } from "types/child";
import { Guardian } from "types/guardian";

export interface ContractInfo {
    titularName: string;
    todayDate: string; // ISO date string
    children: ChildType[];
    guardians: Guardian[];
    schedule: Schedule[];
    terms?: ContractPermission;
    contract_number?: string;
    contract_id?: number;
    payment_method_id?: number;
    total_to_pay?: string;
    start_date?: string; // ISO date string
    end_date?: string; // ISO date string,
    guardian_id_titular?: number;
  }
  export const defaultContractInfo: ContractInfo = {
    titularName: '',
    todayDate: new Date().toISOString(), // Sets today's date in ISO format
    children: [], // Assuming ChildType is defined elsewhere
    guardians: [], // Assuming Guardian is defined elsewhere
    schedule: [], // Assuming Schedule is defined elsewhere
    terms: undefined, // Optional, so can be undefined
    contract_number: undefined, // Optional, so can be undefined
    contract_id: undefined, // Optional, so can be undefined
    payment_method_id: undefined, // Optional, so can be undefined
    total_to_pay: undefined, // Optional, so can be undefined
    start_date: undefined, // Optional, so can be undefined
    end_date: undefined, // Optional, so can be undefined
    guardian_id_titular: undefined, // Optional, so can be undefined
  };
  

  export const contractDone: ContractInfo = {
    "titularName": "",
    "todayDate": "2024-10-04T02:23:13.045Z",
    "children": [
      {
        "id": "386",
        "child_id": 11,
        "born_date": "2020-09-09T22:00:00.000000Z",
        "first_name": "123123",
        "status": "Active",
        "created_at": "2024-09-06T21:28:24.000000Z",
        "updated_at": "2024-09-12T07:37:03.000000Z",
        "last_name": "ad",
        "middle_initial": "F",
        "identification_number": "",
        "gender_id": 1,
        "classroom": "asdasd",
        "age": 4,


      }
    ],
    "guardians": [
      {
        "id": 13,
        "name": "Pedro",
        "last_name": "Martines",
        "address": "Calle 12",
        "city": "Tunja",
        "phone": "3213123123",
        "guardian_type_id": 1,
        "created_at": "2024-09-10T02:07:37.000000Z",
        "updated_at": "2024-09-21T00:34:23.000000Z",
        "email": "salas21231@yopmail.com",
        "status": "Active",
        "titular": true
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
        "updated_at": "2024-09-24T03:27:04.000000Z",
        "email": "patricia@gmail.com",
        "status": "Active",
        "titular": true
      }
    ],
    "schedule": [
      {
        "contract_id": 53,
        "day_id": 1,
        "check_in": "04:00",
        "check_out": "12:00",
        "updated_at": "2024-10-04T02:48:58.000000Z",
        "created_at": "2024-10-04T02:48:58.000000Z",
        "id": 71
      },
      {
        "contract_id": 53,
        "day_id": 2,
        "check_in": "14:00",
        "check_out": "20:00",
        "updated_at": "2024-10-04T02:48:58.000000Z",
        "created_at": "2024-10-04T02:48:58.000000Z",
        "id": 72
      },
      {
        "contract_id": 53,
        "day_id": 3,
        "check_in": "11:00",
        "check_out": "13:00",
        "updated_at": "2024-10-04T02:48:58.000000Z",
        "created_at": "2024-10-04T02:48:58.000000Z",
        "id": 73
      },
      {
        "contract_id": 53,
        "day_id": 4,
        "check_in": "10:00",
        "check_out": "16:00",
        "updated_at": "2024-10-04T02:48:58.000000Z",
        "created_at": "2024-10-04T02:48:58.000000Z",
        "id": 74
      },
      {
        "contract_id": 53,
        "day_id": 5,
        "check_in": "11:00",
        "check_out": "15:00",
        "updated_at": "2024-10-04T02:48:58.000000Z",
        "created_at": "2024-10-04T02:48:58.000000Z",
        "id": 75
      }
    ],
    "terms": {
      "contract_id": 53,
      "walk_to_park_or_transport": true,
      "walk_in_school": true,
      "guardian_received_manual": true,
      "share_photos_with_families": false,
      "allow_other_parents_to_take_photos": false,
      "use_photos_for_art_and_activities": false,
      "use_photos_for_promotion": false,
      "walk_around_neighborhood": false,
      "updated_at": "2024-10-04T02:48:20.000000Z",
      "created_at": "2024-10-04T02:48:20.000000Z",
      "id": 18
    },
    "contract_number": "ChildCare.10.2725",
    "contract_id": 53,
    "payment_method_id": 2,
    "total_to_pay": "1000.00",
    "start_date": "2024-10-04T05:00:00.000Z",
    "end_date": "2024-10-12T05:00:00.000Z",
    "guardian_id_titular": 13
  }
export const defaultContractInfoFinished: ContractInfo = {
    titularName: "Titular_not_Defined",
    todayDate: "2024-09-18T02:50:50.256Z",

    children: [
      // Example children here
    ],
    guardians: [
      // Example guardians here
    ],
    schedule: [
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
    terms: {
      contract_id: 0,
      share_photos_with_families: false,
      allow_other_parents_to_take_photos: false,
      use_photos_for_art_and_activities: false,
      use_photos_for_promotion: false,
      walk_around_neighborhood: false,
      walk_to_park_or_transport: false,
      walk_in_school: false,
      guardian_received_manual: false,
      updated_at: "2024-09-18T02:54:09.000000Z",
      created_at: "2024-09-18T02:54:09.000000Z",
      id: 1
    },
    contract_number: "ChildCare.10.3801",
    contract_id: 32,
    start_date: "2024-09-09T05:00:00.000Z",
    end_date: "2024-09-15T05:00:00.000Z",
    payment_method_id: 2,
    total_to_pay: "300.12"
  };
  
  export interface Schedule {
    id?: number;
    contract_id: number;
    day_id: number;
    check_in: string; // Time string
    check_out: string; // Time string
    updated_at: string; // ISO date string
    created_at: string; // ISO date string
  }
  
  export enum Language {
    English = "en",
    Spanish = "es"
  }