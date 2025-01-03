import { WorkInformation } from "@components/contracts/types/ContractInfo";

export interface Guardian {
  id?:               number;
  name:             string;
  last_name:        string;
  address:          string;
  city:             string;
  phone:            string;
  guardian_type_id?: number;
  created_at:       Date|string;
  updated_at:       Date|string;
  email:            string;
  status:           'Active' | 'Inactive';
  id_static?: string;
  value?: number;
  titular:          boolean;
  telephone?: string;
  workInformation?: WorkInformation;
}

export const defaultGuardian: Guardian = {
  name: '',
  last_name: '',
  address: '',
  city: '',
  telephone: '',
  phone: '',
  guardian_type_id: undefined, // or another appropriate default value
  created_at: new Date(), // or a specific date if needed
  updated_at: new Date(), // or a specific date if needed
  email: '',
  status: 'Active', // or 'Inactive' based on your requirements
  id_static: '', // or another appropriate default value
  value: 0, // or another appropriate default value
  titular: false,
};
