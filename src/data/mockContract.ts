import { ContractInfo } from "@components/contracts/types/ContractInfo";

export const mockContract: ContractInfo =
{
  "titularName": "Test Test",
  "todayDate": "2024-11-17T17:26:44.444Z",
  "children": [
    {
      "id": 382,
      "child_id": undefined,
      "born_date": "2013-09-09T00:00:00.000000Z",
      "first_name": "Test",
      "status": "Active",
      "created_at": "2024-10-27T03:40:07.000000Z",
      "updated_at": "2024-11-03T08:17:05.000000Z",
      "last_name": "Test",
      "middle_initial": "T",
      "identification_number": undefined,
      "gender_id": 1,
      "classroom": "School age",
      "age": 11,
      "medicalInformation": {
        "healthStatus": "qqqqqqqqqqqqq",
        "treatment": "qqqqqqqqqqqqq",
        "allergies": "qqqqqqqqqqqqq",
        "instructions": "qqqqqqqqqqqqq",
        "medication": "qqqqqqqqqqqqq",
        "provider_director_staff": "qqqqqqqqqqqqq",
        "restricted_activities": "qqqqqqqqqqqqq",
        "insurance_company": "qqqqqqqqqqqqq",
        "caregiver_name": "qqqqqqqqqqqqq"
      },
      "formulaInformation": {
        "formula": "eeeeeeeeeee",
        "feedingTimes": [
          "eeeeeeeeeee",
          "eeeeeeeeeee",
          "eeeeeeeeeee",
          "eeeeeeeeeee"
        ],
        "maxBottleTime": "eeeeeeeeeee",
        "minBottleTime": "eeeeeeeeeee",
        "bottleAmount": "12",
        "feedingInstructions": "eeeeeeeeeee",
        "otherFood": "eeeeeeeeeee",
        "foodAllergies": "eeeeeeeeeee",
        "followMealProgram": true
      },
      "permissionsInformation": {
        "soap": true,
        "sanitizer": true,
        "rashCream": true,
        "teethingMedicine": true,
        "sunscreen": false,
        "insectRepellent": false,
        "other": "eeeeeeeeeee"
      },
      "program": "School age"
    },
    {
      "id": 383,
      "child_id": undefined,
      "born_date": "1212-12-12T00:00:00.000000Z",
      "first_name": "Wawa",
      "status": "Active",
      "created_at": "2024-11-03T08:17:05.000000Z",
      "updated_at": "2024-11-06T02:22:34.000000Z",
      "last_name": "Ggagaga",
      "middle_initial": "G",
      "identification_number": undefined,
      "gender_id": 2,
      "classroom": "Other",
      "age": 811,
      "medicalInformation": {
        "healthStatus": "aaaaaaaaaaaaaaaaaa",
        "treatment": "aaaaaaaaaaaaaaaaaa",
        "allergies": "aaaaaaaaaaaaaaaaaa",
        "instructions": "aaaaaaaaaaaaaaaaaa",
        "medication": "aaaaaaaaaaaaaaaaaa",
        "provider_director_staff": "aaaaaaaaaaaaaaaaaa",
        "restricted_activities": "aaaaaaaaaaaaaaaaaa",
        "insurance_company": "aaaaaaaaaaaaaaaaaa",
        "caregiver_name": "aaaaaaaaaaaaaaaaaa"
      },
      "permissionsInformation": {
        "soap": true,
        "sanitizer": true,
        "rashCream": true,
        "teethingMedicine": false,
        "sunscreen": false,
        "insectRepellent": false,
        "other": ""
      },
      "program": "Other"
    },
    {
      "id": 384,
      "child_id": undefined,
      "born_date": "1212-12-12T00:00:00.000000Z",
      "first_name": "Testw",
      "status": "Active",
      "created_at": "2024-11-17T16:48:12.000000Z",
      "updated_at": "2024-11-17T17:28:07.000000Z",
      "last_name": "Testw",
      "middle_initial": "T",
      "identification_number": undefined,
      "gender_id": 1,
      "classroom": "Other",
      "age": 811,
      "medicalInformation": {
        "healthStatus": "eeeeeeeeeee",
        "treatment": "eeeeeeeeeee",
        "allergies": "eeeeeeeeeee",
        "instructions": "eeeeeeeeeee",
        "medication": "eeeeeeeeeee",
        "provider_director_staff": "eeeeeeeeeee",
        "restricted_activities": "eeeeeeeeeee",
        "insurance_company": "eeeeeeeeeee",
        "caregiver_name": "eeeeeeeeeee"
      },
      "permissionsInformation": {
        "soap": true,
        "sanitizer": true,
        "rashCream": true,
        "teethingMedicine": true,
        "sunscreen": true,
        "insectRepellent": true,
        "other": ""
      },
      "program": "Other"
    }
  ],
  "guardians": [
    {
      "id": 12,
      "name": "Test",
      "last_name": "Test",
      "address": "Test",
      "city": "Test",
      "phone": "123123",
      "guardian_type_id": 2,
      "status": "Active",
      "created_at": "2024-11-03T07:08:44.000000Z",
      "updated_at": "2024-11-17T17:28:18.000000Z",
      "email": "Test2@gmail.com",
      "telephone": "1123123",
      "titular": true
    },
    {
      "id": 13,
      "name": "Gege",
      "last_name": "Gege",
      "address": "Gege",
      "city": "Geges",
      "phone": "12313",
      "guardian_type_id": 1,
      "status": "Active",
      "created_at": "2024-11-03T07:20:52.000000Z",
      "updated_at": "2024-11-17T17:28:19.000000Z",
      "email": "GegeQq@gmail.com",
      "telephone": "123123",
      "titular": true
    }
  ],
  "schedule": [
    {
      "contract_id": 31,
      "day_id": 1,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-17T17:28:49.000000Z",
      "created_at": "2024-11-17T17:28:49.000000Z",
      "id": 81
    },
    {
      "contract_id": 31,
      "day_id": 2,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-17T17:28:49.000000Z",
      "created_at": "2024-11-17T17:28:49.000000Z",
      "id": 82
    },
    {
      "contract_id": 31,
      "day_id": 3,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-17T17:28:49.000000Z",
      "created_at": "2024-11-17T17:28:49.000000Z",
      "id": 85
    },
    {
      "contract_id": 31,
      "day_id": 4,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-17T17:28:49.000000Z",
      "created_at": "2024-11-17T17:28:49.000000Z",
      "id": 83
    },
    {
      "contract_id": 31,
      "day_id": 5,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-17T17:28:49.000000Z",
      "created_at": "2024-11-17T17:28:49.000000Z",
      "id": 84
    }
  ],
  "terms": {
    "contract_id": 31,
    "allow_other_parents_to_take_photos": true,
    "use_photos_for_art_and_activities": true,
    "share_photos_with_families": true,
    "use_photos_for_promotion": true,
    "walk_around_neighborhood": true,
    "walk_in_school": true,
    "walk_to_park_or_transport": true,
    "updated_at": "2024-11-17T17:28:31.000000Z",
    "created_at": "2024-11-17T17:28:31.000000Z",
    "id": 10,
    "guardian_received_manual": true
  },
  "contract_number": "ChildCare.10.2164",
  "contract_id": 31,
  "payment_method_id": 1,
  "total_to_pay": "1212.00",
  "start_date": "2024-12-12T05:00:00.000Z",
  "end_date": undefined,
  "guardian_id_titular": 12,
  "weekly_payment": "1212"
}