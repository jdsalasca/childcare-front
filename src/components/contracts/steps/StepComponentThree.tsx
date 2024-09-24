import { LoadingInfo } from '@models/AppModels';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { customLogger } from '../../../configs/logger';
import { ApiValidator } from '../../../models/ApiModels';
import { ContractModel } from '../../../models/ContractAPI';
import { ContractPermissionsAPI } from '../../../models/ContractPermissionsAPI';
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractInfo } from '../types/ContractInfo';


interface StepComponentThreeProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast>,
  setLoadingInfo: (info: LoadingInfo) => void;
}

const StepComponentThree: React.FC<StepComponentThreeProps> = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast,
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      terms: contractInformation.terms,
    },
  });
  const { t } = useTranslation();

  const onSubmit = async (data: any) => {
    customLogger.debug('contractInformation', contractInformation);

    if (contractInformation.contract_id == null) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'info',
        'info',
        t('contractInformationRequiredMessage'),
        3000
      );
      return;
    }

    console.log('data', data);

    const termsRegistry = { ...data.terms, contract_id: contractInformation.contract_id };
    console.log('termsRegistry', termsRegistry);

    const permissionsCreated = await ContractPermissionsAPI.createContractPermissions(termsRegistry);
    if (ApiValidator.invalidResponse(permissionsCreated.httpStatus)) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'error',
        t('permissionsCreationFailed'),
        t('permissionsCreationFailedMessage')
      );
      return;
    }

    setContractInformation({ ...contractInformation, terms: permissionsCreated.response });
    ToastInterpreterUtils.toastInterpreter(
      toast,
      'success',
      t('termsUpdated'),
      t('termsUpdatedMessage')
    );
    setActiveIndex(3);
  };

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {ContractModel.CONTRACT_PERMISSIONS.map((term) => (
          <CheckboxWrapper
            key={term}
            name={`terms.${term}`}
            control={control}
            label={t(term)}
            labelClassName='c-label-checkbox right'
            labelPosition='right'
          />
        ))}
        <div className='button-group'>
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary p-ml-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary p-ml-2'
            onClick={() => setActiveIndex(1)}
          />
        </div>
      </form>
    </div>
  );
};

export default StepComponentThree;
