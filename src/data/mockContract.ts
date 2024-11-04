import { ContractInfo } from "@components/contracts/types/ContractInfo";

export const mockContract: ContractInfo =

{
  "titularName": "Tet Test",
  "todayDate": "2024-11-03T07:50:53.402Z",
  "children": [
    {
      "id": "382",
      "child_id": 1,
      "born_date": "2013-09-09T00:00:00.000000Z",
      "first_name": "Test",
      "status": "Active",
      "created_at": "2024-10-27T03:40:07.000000Z",
      "updated_at": "2024-11-03T08:17:05.000000Z",
      "last_name": "Test",
      "middle_initial": "T",
      "identification_number": "123123",
      "gender_id": 1,
      "classroom": "School age",
      "age": 11,
      "program": "School age"
    },
    {
      "first_name": "Wawa",
      "born_date": "1212-12-12T00:00:00.000000Z",
      "last_name": "Ggagaga",
      "classroom": "Other",
      "status": "Active",
      "gender_id": 2,
      "middle_initial": "G",
      "child_id": 0,
      "updated_at": "2024-11-03T08:17:05.000000Z",
      "created_at": "2024-11-03T08:17:05.000000Z",
      "id": "383",
      "age": 811,
      "program": "Other"
    }
  ],
  "guardians": [
    {
      "id": 11,
      "name": "Tet",
      "last_name": "Test",
      "address": "Tet",
      "city": "test",
      "phone": "123123",
      "guardian_type_id": 1,
      "status": "Active",
      "created_at": "2024-10-27T03:40:26.000000Z",
      "updated_at": "2024-11-03T07:51:29.000000Z",
      "email": "Test@gmail.com",
      "telephone": "89897",
      "titular": true
    }
  ],
  "schedule": [
    {
      "contract_id": 20,
      "day_id": 1,
      "check_in": "09:00",
      "check_out": "17:00",
      "updated_at": "2024-11-03T07:53:04.000000Z",
      "created_at": "2024-11-03T07:53:04.000000Z",
      "id": 41
    },
    {
      "contract_id": 20,
      "day_id": 2,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-03T07:53:04.000000Z",
      "created_at": "2024-11-03T07:53:04.000000Z",
      "id": 43
    },
    {
      "contract_id": 20,
      "day_id": 3,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-03T07:53:04.000000Z",
      "created_at": "2024-11-03T07:53:04.000000Z",
      "id": 44
    },
    {
      "contract_id": 20,
      "day_id": 4,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-03T07:53:05.000000Z",
      "created_at": "2024-11-03T07:53:05.000000Z",
      "id": 45
    },
    {
      "contract_id": 20,
      "day_id": 5,
      "check_in": "08:00",
      "check_out": "17:00",
      "updated_at": "2024-11-03T07:53:04.000000Z",
      "created_at": "2024-11-03T07:53:04.000000Z",
      "id": 42
    }
  ],
  "terms": {
    "contract_id": 20,
    "use_photos_for_art_and_activities": true,
    "use_photos_for_promotion": true,
    "walk_around_neighborhood": true,
    "walk_to_park_or_transport": true,
    "updated_at": "2024-11-03T07:51:40.000000Z",
    "created_at": "2024-11-03T07:51:40.000000Z",
    "id": 2,
    "guardian_received_manual": false,
    "share_photos_with_families": true,
    "allow_other_parents_to_take_photos": true,
    "walk_in_school": true
  },
  "contract_number": "ChildCare.10.6429",
  "contract_id": 20,
  "payment_method_id": 1,
  "total_to_pay": "1212.00",
  "start_date": "1212-12-12T04:56:16.000Z",
  "end_date": "1212-12-13T04:56:16.000Z",
  "guardian_id_titular": 11,
  "weekly_payment": "1212"
}