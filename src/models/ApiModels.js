import { Functions } from "../utils/functions";

/**
 * Class representing an API response model.
 */
export class ApiResponseModel {
    /**
     * Creates an instance of ApiResponseModel.
     * 
     * @param {number} [httpStatus=null] - The HTTP status code of the response.
     * @param {Object} [response=null] - The response data.
     */
    constructor(httpStatus = null, response = null) {
        this.httpStatus = httpStatus;
        this.response = response;
    }
}

export class paymentMethod {
    constructor(method, status, translationLabel) {
        this.method = method;
        this.status = status;
        this.translationLabel = translationLabel;
    }
}   

export class UserBuilder {

    static USER_STATUS_CREATED = 1;
    constructor(birth_date, email, first_name, last_name, password, phone_number, role, username, user_status_id) {
        this.birth_date = birth_date;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
        this.username = username;
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
            user_status_id: this.user_status_id ?? UserBuilder.USER_STATUS_CREATED,
        };
    }

    /**
     * Static method to create and build a user object from provided data.
     * 
     * @param {Object} data - The user data.
     * @returns {Object} - A formatted user object.
     */
    static build(data) {
        const { birth_date, email, first_name, last_name, password, phone_number, role, username } = data;
        const userBuilder = new UserBuilder(birth_date, email, first_name, last_name, password, phone_number, role, username);
        return userBuilder.build();
    }
}

export class ChildrenGuardiansBuilder {
    constructor(children, guardians) {
        this.children = children;
        this.guardians = guardians;
    }
    
    /**
     * Builds an array of children-guardians objects to use the method of creating children-guardians.
     * 
     * @returns {Array} - An array of children-guardians objects.
     */
    build() {
        const childrenGuardians = [];
        for (const child of this.children) {
            for (const guardian of this.guardians) {
                childrenGuardians.push({
                    child_id: child.id,
                    guardian_id: guardian.id,
                    guardian_type_id: guardian.guardian_type_id,
                });
            }
        }
        return childrenGuardians;
    }
}   


/**
 * Class representing a contract day schedule.
 * 
 */
export class ContractDaySchedule {
    constructor(contractId, dayId, checkIn, checkOut) {
        this.contractId = contractId;
        this.dayId = dayId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }
    
    /**
     * Builds an array of contract-day-schedule objects to use the method of creating contract-day-schedules.
     * 
     * @returns {Array} - An array of contract-day-schedule objects.
     */
    build() {
        const contractDaySchedules = [];
        contractDaySchedules.push({
            contract_id: this.contractId,
            day_id: this.dayId,
            check_in: this.checkIn,
            check_out: this.checkOut,
        });
        return contractDaySchedules;
    }
}   


/**
 * Provides default response models for API calls.
 */
export const ApiModels = {
    /**
     * The default response model for API calls from the API.
     * 
     * @type {ApiResponseModel}
     */
    defaultResponseModel: new ApiResponseModel(),
      /**
     * UserBuilder for creating user objects.
     * 
     * @type {UserBuilder}
     */
      UserBuilder: UserBuilder

};

/**
 * Class representing a validator for API responses.
 */
export class ApiValidator {
    static  STATUS_RESPONSE_VALID = [200,201]
    static validResponse(status = 0) {
        return status !=null && ApiValidator.STATUS_RESPONSE_VALID.includes(status);
    } 
    static invalidResponse(status = 0) {
        return !ApiValidator.validResponse(status);
    }
}