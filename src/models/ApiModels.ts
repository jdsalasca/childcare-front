import { ChildType } from 'types/child';
import { ChildrenGuardian } from 'types/childrenGuardian';
import { Guardian } from 'types/guardian';
import { Functions } from '../utils/functions';
import { ApiResponseModel } from './API';

export class PaymentMethod {
  method: string;
  status: string;
  translationLabel: string;

  constructor(method: string, status: string, translationLabel: string) {
    this.method = method;
    this.status = status;
    this.translationLabel = translationLabel;
  }
}

export class UserBuilder {
  static USER_STATUS_CREATED = 1;

  birth_date: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number: string;
  role: string;
  username: string;
  user_status_id: number;
  cashiers_id: number;
  role_id: number;

  constructor(
    birth_date: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    phone_number: string,
    role: string,
    username: string,
    cashiers_id: number,
    role_id: number,
    user_status_id: number = UserBuilder.USER_STATUS_CREATED
  ) {
    this.birth_date = birth_date;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password = password;
    this.phone_number = phone_number;
    this.role = role;
    this.username = username;
    this.cashiers_id = cashiers_id;
    this.role_id = role_id;
    this.user_status_id = user_status_id;
  }

  /**
   * Builds a user object from the instance properties.
   *
   * @returns {Object} - A user object.
   */
  build() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      birth_date: Functions.formatDateToYYYYMMDD(this.birth_date),
      password: this.password,
      phone_number: this.phone_number,
      username: this.username,
      cashiers_id: this.cashiers_id,
      role_id: this.role_id,
      user_status_id: this.user_status_id ?? UserBuilder.USER_STATUS_CREATED,
    };
  }

  /**
   * Static method to create and build a user object from provided data.
   *
   * @param {Partial<UserBuilder>} data - The user data.
   * @returns {Object} - A formatted user object.
   */
  static build(data: Partial<UserBuilder>) {
    const {
      birth_date,
      email,
      first_name,
      last_name,
      password,
      phone_number,
      role,
      username,
      cashiers_id,
      role_id,
    } = data;
    const userBuilder = new UserBuilder(
      birth_date ?? '',
      email ?? '',
      first_name ?? '',
      last_name ?? '',
      password ?? '',
      phone_number ?? '',
      role ?? '',
      username ?? '',
      cashiers_id ?? 0,
      role_id ?? 0
    );
    return userBuilder.build();
  }
}

export class ChildrenGuardiansBuilder {
  children: ChildType[];
  guardians: Guardian[];

  constructor(children: ChildType[], guardians: Guardian[]) {
    this.children = children;
    this.guardians = guardians;
  }

  /**
   * Builds an array of children-guardians objects to use the method of creating children-guardians.
   *
   * @returns {Array} - An array of children-guardians objects.
   */
  build() {
    const childrenGuardians: ChildrenGuardian[] = [];
    for (const child of this.children) {
      for (const guardian of this.guardians) {
        childrenGuardians.push({
          child_id: child.id,
          guardian_id: guardian.id!,
          guardian_type_id: guardian.guardian_type_id,
        });
      }
    }
    return childrenGuardians;
  }
}

/**
 * Class representing a contract day schedule.
 */
class ContractDaySchedule {
  contract_id: number;
  day_id: string;
  check_in: string;
  check_out: string;

  constructor(
    contractId: number,
    dayId: string,
    checkIn: string,
    checkOut: string
  ) {
    this.contract_id = contractId;
    this.day_id = dayId;
    this.check_in = checkIn;
    this.check_out = checkOut;
  }

  /**
   * Builds an array of contract-day-schedule objects to use the method of creating contract-day-schedules.
   *
   * @returns {Array} - An array of contract-day-schedule objects.
   */
  build() {
    return [
      {
        contract_id: this.contract_id,
        day_id: this.day_id,
        check_in: this.check_in,
        check_out: this.check_out,
      },
    ];
  }
}

/**
 * Provides default response models for API calls.
 */
export const ApiModels = {
  /**
   * The default response model for API calls from the API.
   */
  defaultResponseModel: new ApiResponseModel(400, 'Error'),
  /**
   * UserBuilder for creating user objects.
   */
  UserBuilder: UserBuilder,
};
/**
 * Class representing a validator for API responses.
 */
export class ApiValidator {
  static STATUS_RESPONSE_VALID = [200, 201];

  static validResponse(status: number = 0): boolean {
    return (
      status !== null && ApiValidator.STATUS_RESPONSE_VALID.includes(status)
    );
  }
  static invalidResponse(status: number = 0): boolean {
    return !ApiValidator.validResponse(status);
  }
}

export { ContractDaySchedule };
