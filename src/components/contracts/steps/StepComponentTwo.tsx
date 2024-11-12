import { LoadingInfo } from '@models/AppModels';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FC } from 'react';
import { Validations } from '../../../utils/validations';
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import { ContractInfo } from '../types/ContractInfo';
import useViewModelStepGuardians from '../viewModels/useviewModelStepGuardians';

interface StepComponentTwoProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo; // Adjust type as necessary
  setContractInformation: (info: ContractInfo) => void; // Adjust type as necessary
  setLoadingInfo: (info: LoadingInfo) => void; // Adjust type as necessary
  toast: any; // Adjust type as necessary
}

export const StepComponentTwo: FC<StepComponentTwoProps> = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
  toast,
}) => {
  const {
    onSubmit,
    handleSubmit,
    guardianOptions,
    control,
    fields,
    getValues,
    addGuardian,
    removeGuardian,
    getAvailableGuardianTypes,
    handleGuardianSelect,
    t,
  } = useViewModelStepGuardians({ toast, setActiveIndex, contractInformation, setContractInformation, setLoadingInfo });

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='field p-float-label' style={{ marginBottom: '30px', maxWidth: '15rem' }}>
          <Dropdown
            id='names-dropdown-child'
            filter
            optionLabel='label'
            emptyMessage={t('dropdownEmptyMessage')}
            options={guardianOptions}
            onChange={handleGuardianSelect}
          />
          <label htmlFor='names-dropdown-child' style={{ paddingTop: '0px' }}>
            {t('pickAGuardian')}
          </label>
        </div>
        {fields.map((guardian: GuardianType, index: number) => (
          <div key={guardian.id} className='child-form'>
            <InputTextWrapper
              name={`guardians[${index}].name`}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              control={control}
              rules={{ required: t('guardianNameRequired') }}
              label={t('guardianName')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].last_name`}
              control={control}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              rules={{ required: t('guardianLastNameRequired') }}
              label={t('guardianLastName')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].address`}
              control={control}
              rules={{ required: t('addressRequired') }}
              label={t('address')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].city`}
              control={control}
              rules={{ required: t('cityRequired') }}
              label={t('city')}
            />
            <InputTextWrapper
              name={`guardians[${index}].email`}
              control={control}
              keyFilter='email'
              rules={{
                required: t('emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('emailInvalid'),
                },
              }}
              label={t('email')}
              spanClassName='c-small-field r-m-13'
            />
            <InputTextWrapper
              name={`guardians[${index}].phone`}
              control={control}
              rules={{
                required: t('phoneNumberRequired'),
                pattern: {
                  value: /^[0-9+()-]*$/,
                  message: t('phoneNumberPattern'),
                },
              }}
              label={t('phoneNumber')}
              keyFilter={/^[0-9+()-]*$/}
              spanClassName='c-small-field r-m-10'
            />
            <InputTextWrapper
              name={`guardians[${index}].telephone`}
              control={control}
             /*  rules={{
                required: t('telephoneRequired'),
                pattern: {
                  value: /^[0-9+()-]*$/,
                  message: t('phoneNumberPattern'),
                },
              }} */
              label={t('telephone')}
              keyFilter={/^[0-9+()-]*$/}
              spanClassName='c-small-field r-m-10'
            />
            <DropdownWrapper
              
            rules={{ required: t('guardianTypeRequired') }}
              options={getAvailableGuardianTypes(index)}
              optionValue={'id'}
              optionLabel='name'
              label={t('guardianType')}
              spanClassName='c-small-field r-10'
              name={`guardians[${index}].guardian_type_id`}
              control={control}
            />
            <CheckboxWrapper
              name={`guardians[${index}].titular`}
              control={control}
              label={t('titular')}
              labelClassName='c-label-checkbox left'
              labelPosition='left'
            />
            <Button
              icon='pi pi-trash'
              className='p-button-danger p-button-text p-ml-2'
              onClick={e => { e.preventDefault(); e.stopPropagation(); removeGuardian(index); }}
            />
          </div>
        ))}

        <div className='button-group'>
          <Button
            icon='pi pi-plus'
            label={t('addGuardian')}
            className='p-button-success'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              addGuardian();
            }}
            disabled={getValues('guardians')?.length > 2}
          />
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary p-ml-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary p-ml-2'
            onClick={() => {
              setActiveIndex(0);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default StepComponentTwo;
