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
import { motion } from 'framer-motion';

interface StepComponentThreeProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast | null>;
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
        toast as React.RefObject<Toast>,
        'info',
        'info',
        t('contractInformationRequiredMessage'),
        3000
      );
      return;
    }

    console.log('data', data);

    const termsRegistry = {
      ...data.terms,
      contract_id: contractInformation.contract_id,
    };
    console.log('termsRegistry', termsRegistry);

    const permissionsCreated =
      await ContractPermissionsAPI.createContractPermissions(termsRegistry);
    if (ApiValidator.invalidResponse(permissionsCreated.httpStatus)) {
      ToastInterpreterUtils.toastInterpreter(
        toast as React.RefObject<Toast>,
        'error',
        t('permissionsCreationFailed'),
        t('permissionsCreationFailedMessage')
      );
      return;
    }

    setContractInformation({
      ...contractInformation,
      terms: permissionsCreated.response,
    });
    ToastInterpreterUtils.toastInterpreter(
      toast as React.RefObject<Toast>,
      'success',
      t('termsUpdated'),
      t('termsUpdatedMessage')
    );
    setActiveIndex(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-4xl mx-auto w-full p-4'
    >
      <motion.form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <motion.div
          className='bg-white rounded-xl shadow-lg p-6'
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h3
            className='text-xl font-semibold text-center text-gray-800 mb-6'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {t('termsAndPermissions')}
          </motion.h3>

          <motion.div
            className='bg-gray-50 rounded-xl p-4'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {ContractModel.CONTRACT_PERMISSIONS.map((term, index) => (
                <motion.div
                  key={term}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                  className='bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center'
                >
                  <div className='flex items-start w-full gap-3'>
                    <div className='flex-shrink-0 pt-1'>
                      <CheckboxWrapper
                        name={`terms.${term}`}
                        control={control}
                        label={''}
                        className='flex items-center'
                        checkboxClassName='w-5 h-5 rounded-md border-2 border-gray-300 
                          checked:bg-blue-500 checked:border-blue-500 
                          hover:border-blue-400 transition-colors duration-200
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      />
                    </div>
                    <label
                      className='text-gray-700 text-sm font-medium flex-grow 
                        cursor-pointer hover:text-gray-900 transition-colors duration-200
                        break-words whitespace-normal justify-center align-middle'
                      style={{ wordBreak: 'break-word' }}
                    >
                      {t(term)}
                    </label>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className='flex justify-end gap-3 mt-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.4,
              ease: 'easeOut',
            }}
          >
            <Button
              type='submit'
              label={t('save')}
              className='p-button-primary px-6 py-2 text-sm font-medium rounded-lg 
                hover:shadow-lg transition-all duration-200 
                hover:scale-105 active:scale-95'
            />
            <Button
              label={t('returnToPreviousStep')}
              className='p-button-secondary px-6 py-2 text-sm font-medium rounded-lg 
                hover:shadow-lg transition-all duration-200
                hover:scale-105 active:scale-95'
              onClick={() => setActiveIndex(1)}
            />
          </motion.div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default StepComponentThree;
