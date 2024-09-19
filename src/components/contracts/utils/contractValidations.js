export const ContractConstraints = {
    defaultContractModelView: {
        children: [{name: null, last_name: null, age: null, born_date: null, program: null}],
        guardians: [{name: null, last_name: null, address: null, city: null, email: null, phone: null, guardian_type_id: null, titular: null}],
        titular_guardian_id: null,
    },
    
/**
 * @typedef {Object} ContractMediaPermissions
 * @property {number} id - The unique identifier for the permission.
 * @property {number} contract_id - The contract associated with this permission.
 * @property {boolean} share_media_with_families - Whether media can be shared with families.
 * @property {boolean} allow_other_parents - Whether other parents are allowed.
 * @property {boolean} use_for_art_and_activities - Whether media can be used for art and activities.
 * @property {boolean} promote_childcare - Whether media can be used to promote childcare.
 * @property {Date} created_at - The timestamp when the record was created.
 * @property {Date} updated_at - The timestamp when the record was last updated.
 */
contractMediaPermissionsModel: {
    id: 1,
    contract_id: 123,
    share_media_with_families: true,
    allow_other_parents: false,
    use_for_art_and_activities: true,
    promote_childcare: true,
    created_at: new Date(),
    updated_at: new Date(),
},

/**
 * @typedef {Object} ContractOutdoorPermissions
 * @property {number} id - The unique identifier for the permission.
 * @property {number} contract_id - The contract associated with this permission.
 * @property {boolean} walk_around_neighborhood - Whether walking around the neighborhood is allowed.
 * @property {boolean} walk_to_park_or_transport - Whether walking to the park or transport is allowed.
 * @property {boolean} walk_in_school - Whether walking in school is allowed.
 * @property {Date} created_at - The timestamp when the record was created.
 * @property {Date} updated_at - The timestamp when the record was last updated.
 */
contractOutdoorPermissionsModel:{
    id: 1,
    contract_id: 123,
    walk_around_neighborhood: true,
    walk_to_park_or_transport: false,
    walk_in_school: true,
    created_at: new Date(),
    updated_at: new Date(),
},

/**
 * @typedef {Object} Guardian
 * @property {number} id - The unique identifier for the guardian.
 * @property {string} name - The first name of the guardian.
 * @property {string} last_name - The last name of the guardian.
 * @property {string} address - The address of the guardian.
 * @property {string} city - The city where the guardian resides.
 * @property {string} phone - The phone number of the guardian.
 * @property {number} guardian_type_id - The type of the guardian.
 * @property {Date} created_at - The timestamp when the record was created.
 * @property {Date} updated_at - The timestamp when the record was last updated.
 * @property {string} email - The email address of the guardian.
 */
guardianDefault: {
    id: 1,
    name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    city: 'Springfield',
    phone: '555-1234',
    guardian_type_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
    email: 'john.doe@example.com',
}

};


export const GuardiansValidations = {


    allHaveUniqueGuardianTypes: (guardians=ContractConstraints.defaultContractModelView.guardians) => {
    const uniqueGuardianTypes = new Set(guardians.map(guardian => guardian.guardian_type_id));
    return uniqueGuardianTypes.size === guardians.length;

    },
} 


export const ChildrenValidations = {

    allChildrenHaveName: (children=ContractConstraints.defaultContractModelView.children) => {
        return  children != null && children.length>  0 && !children.some(child => child.first_name == null);
    },
} 


