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
/**
 * Provides default response models for API calls.
 */
export const ApiModels = {
    /**
     * The default response model for API calls from the API.
     * 
     * @type {ApiResponseModel}
     */
    defaultResponseModel: new ApiResponseModel()
};

export class paymentMethod {
    constructor(method, status, translationLabel) {
        this.method = method;
        this.status = status;
        this.translationLabel = translationLabel;
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