import { useTranslation } from 'react-i18next'
import {
  ApiModels,
  ApiResponseModel,
  ChildrenGuardiansBuilder
} from '../../models/ApiModels'
import { ChildrenGuardiansAPI } from '../../models/ChildrenGuardiansAPI'
import { ContractAPI } from '../../models/ContractAPI'
import {
  ChildrenValidations,
  ContractConstraints,
  GuardiansValidations
} from './utils/contractValidations'

/**
 * ContractService provides methods for managing contracts, validating them,
 * and creating relationships between children and guardians.
 */
export class ContractService {
  /**
   * Validates the contract data by ensuring that all guardians have unique types
   * and all children have associated programs.
   *
   * @param {Array} children - The list of children associated with the contract.
   * @param {Array} guardians - The list of guardians associated with the contract.
   * @throws {Error} Throws an error if validation fails.
   */
  /**
   * Validates the contract data by ensuring that all guardians have unique types
   * and all children have associated programs.
   *
   * @param {Array} children - The list of children associated with the contract.
   * @param {Array} guardians - The list of guardians associated with the contract.
   * @param {Function} t - The translation function.
   * @throws {Error} Throws an error if validation fails.
   */
  static async validateContractData (
    children = ContractConstraints.defaultContractModelView.children,
    guardians = ContractConstraints.defaultContractModelView.guardians,
    t
  ) {
    if (!GuardiansValidations.allHaveUniqueGuardianTypes(guardians)) {
      return new ApiResponseModel(400, { message: t('uniqueGuardianType') })
    }
    if (children == null || children.length === 0) {
      return new ApiResponseModel(400, { message: t('atLeastOneChild') })
    }

    if (!ChildrenValidations.allChildrenHaveName(children)) {
      return new ApiResponseModel(400, { message: t('childrenHaveProgram') })
    }

    // If everything is fine
    return new ApiResponseModel(200, { message: t('success') })
  }
  /**
   * Creates relationships between children and guardians after validation.
   *
   * @param {Array} children - The list of children to associate with guardians.
   * @param {Array} guardians - The list of guardians to associate with children.
   * @returns {Promise<Object>} - Returns a promise with the result of the API call.
   */
  static async createChildrenGuardianRelationships (children, guardians, t) {
    const validations = await this.validateContractData(children, guardians, t)
    if (validations.httpStatus !== 200) {
      return validations
    }
    const childrenGuardians = new ChildrenGuardiansBuilder(
      children,
      guardians
    ).build()
    const creations = childrenGuardians.map(childGuardian => {
      console.log('childGuardian', childGuardian)
     return ChildrenGuardiansAPI.createChildrenGuardians(childGuardian)
    })

    const creationResponses = await Promise.all(creations)

    console.log('childrenGuardiansBuilder', childrenGuardians)
    console.log('creationResponses', creationResponses)
    return creationResponses;
  }

  /**
   * Creates a new contract base in the system.
   *
   * @param {Object} contract - The contract data to be created.
   * @returns {Promise<Object>} - Returns a promise with the result of the API call.
   */
  static async createContractBase (contract) {
    return await ContractAPI.createContract(contract)
  }

  /**
   * Creates a full contract, including relationships between children and guardians.
   *
   * @param {Object} contract - The contract object, defaulting to an empty model
   * @returns {List<<ApiResponseModel>>} - Performs the operations but does not return data directly
   */
  static async createContract (
    children = ContractConstraints.defaultContractModelView.children,
    guardians = ContractConstraints.defaultContractModelView.guardians,
    t
  ) {
    const relationships = await this.createChildrenGuardianRelationships(
      children,
      guardians,
      t
    )
    console.log('relationships', relationships)
    const contractData = await this.createContractBase(guardians);
    console.log("contractData", contractData)
    return {guardianChildren:relationships,contractInfo: contractData} 
  }
}
