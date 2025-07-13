import { ApiResponseModel } from '../../models/API';
import {
  ChildrenGuardiansBuilder,
  ContractDaySchedule,
} from '../../models/ApiModels';
import { ChildrenGuardiansAPI } from '../../models/ChildrenGuardiansAPI';
import { ContractAPI } from '../../models/ContractAPI';
import { ChildType, defaultChild } from '../../types/child';
import { defaultGuardian, Guardian } from '../../types/guardian';
import { ChildrenValidations, GuardiansValidations } from './utils/contractValidations';
import { ContractInfo } from './types/ContractInfo';
import { GuardiansFactory } from '@models/factories/GuardiansFactory';


/**
 * ContractService provides methods for managing contracts, validating them,
 * and creating relationships between children and guardians.
 */
export class ContractService {
  static isInvalidFormData(data: any, formData: any): boolean {
    return !data || !data.guardians || data.guardians.length === 0 || !formData.children || formData.children.length === 0;
  }

  /**
   * Method to check if the form data is valid for children.
   * @param data - The form data to check.
   * @returns Whether the data is invalid.
   */
  static isInvalidFormDataChildren(data: any): boolean {
    return !data.children || data.children.length === 0;
  }

  /**
   * Validates the contract data by ensuring that all guardians have unique types
   * and all children have associated programs.
   *
   * @param children - The list of children associated with the contract.
   * @param guardians - The list of guardians associated with the contract.
   * @param t - The translation function.
   * @throws {Error} Throws an error if validation fails.
   */
  static async validateContractData(
    children: ChildType[] =  Array.of(defaultChild),
    guardians: any[] =  Array.of(defaultGuardian),
    t: (key: string) => string
  ): Promise<ApiResponseModel> {
    if (!GuardiansValidations.allHaveUniqueGuardianTypes(guardians)) {
      return new ApiResponseModel(400, t('uniqueGuardianType') );
    }
    if (children == null || children.length === 0) {
      return new ApiResponseModel(400, t('atLeastOneChild') );
    }

    if (!ChildrenValidations.allChildrenHaveName(children)) {
      return new ApiResponseModel(400,  t('childrenHaveName') );
    }

    // If everything is fine
    return new ApiResponseModel(200, t('success') );
  }

  /**
   * Creates relationships between children and guardians after validation.
   *
   * @param children - The list of children to associate with guardians.
   * @param guardians - The list of guardians to associate with children.
   * @returns A promise with the result of the API call.
   */
  static async createChildrenGuardianRelationships(
    children: ChildType[] ,
    guardians: any[],
    t: (key: string) => string
  ): Promise<any> {
    const validations = await this.validateContractData(children, guardians, t);
    if (validations.httpStatus !== 200) {
      return validations;
    }
    const childrenGuardians = new ChildrenGuardiansBuilder(children, guardians).build();
    const creations = childrenGuardians.map(childGuardian => {
      console.log('childGuardian', childGuardian);
      return ChildrenGuardiansAPI.createChildrenGuardians(childGuardian);
    });

    const creationResponses = await Promise.all(creations);

    console.log('childrenGuardiansBuilder', childrenGuardians);
    console.log('creationResponses', creationResponses);
    return creationResponses;
  }

  /**
   * Creates a full contract, including relationships between children and guardians.
   *
   * @param children - The list of children to associate with guardians.
   * @param guardians - The list of guardians to associate with children.
   * @param t - The translation function.
   * @param contractInformation - The contract information object.
   * @returns An object containing guardianChildren and contractInfo.
   */
  static async createContract(
    children: ChildType[],
    guardians: Guardian[],
    t: (key: string) => string,
    contractInformation: ContractInfo
  ): Promise<{ guardianChildren: any; contractInfo: any }> {
    const titularGuardian = GuardiansFactory.getTitularGuardian(guardians);
    if (!titularGuardian) {
      throw new Error('No titular guardian found');
    }
  
    try {
      // Create relationships first
      const relationships = await this.createChildrenGuardianRelationships(children, guardians, t);
  
      // Only create new contract if one doesn't exist
      if (!contractInformation.contract_id) {
        const contractBuild = {
          guardian_id_titular: titularGuardian.id,
          status: 'Active',
          // Add any other required contract fields
        };
  
        const contractData = await ContractAPI.createContract(contractBuild);
        return { guardianChildren: relationships, contractInfo: contractData };
      }
  
      return { guardianChildren: relationships, contractInfo: null };
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  static async createContractSchedule(schedules: ContractDaySchedule[]): Promise<any[]> {
    
    const days = schedules.map(schedule => ContractAPI.createContractSchedule(schedule));
    return await Promise.all(days);
  }
}
