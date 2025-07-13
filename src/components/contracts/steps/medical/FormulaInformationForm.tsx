import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { ContractInfo } from '../../types/ContractInfo';
import { ChildType, FormulaInformation } from 'types/child';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import { InputTextAreaWrapper } from '@components/formsComponents/InputTextAreaWrapper';
import { LoadingInfo } from '@models/AppModels';
import { motion } from 'framer-motion';
import CheckboxWrapper from '@components/formsComponents/CheckboxWrapper';

interface FormulaInformationFormProps {
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setActiveIndex: (index: number) => void;
  toast: React.RefObject<Toast | null>;
}

export const FormulaInformationForm: React.FC<FormulaInformationFormProps> = ({
  contractInformation,
  setContractInformation,
  setActiveIndex,
  toast,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<{
    childName: string;
    formulaInfo: FormulaInformation;
  }>();

  const onChildChange = (value: string) => {
    const selectedChild = contractInformation.children.find(
      child => `${child.first_name} ${child.last_name}` === value
    );

    reset({
      childName: value,
      formulaInfo: selectedChild?.formulaInformation || {
        formula: '',
        feedingTimes: ['', '', '', ''],
        maxBottleTime: '',
        minBottleTime: '',
        bottleAmount: '',
        feedingInstructions: '',
        otherFood: '',
        foodAllergies: '',
        followMealProgram: null,
      },
    });

    return value;
  };

  const onSubmit = (data: {
    childName: string;
    formulaInfo: FormulaInformation;
  }) => {
    toast.current?.show({ severity: 'info', summary: t('formulaInfoSaved') });
    if (data.childName) {
      const updatedChildren = contractInformation.children.map(
        (child: ChildType) => {
          const fullName = `${child.first_name} ${child.last_name}`;
          if (fullName === data.childName) {
            return {
              ...child,
              formulaInformation: data.formulaInfo,
            };
          }
          return child;
        }
      );

      setContractInformation({
        ...contractInformation,
        children: updatedChildren,
      });

      toast.current?.show({
        severity: 'success',
        summary: t('formulaInfoSaved'),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-4xl mx-auto w-full p-4'
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
          <h4 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
            {t('babyFormulaAndFeeding')}
          </h4>

          <div className='mb-8'>
            <Controller
              name='childName'
              control={control}
              render={({ field }) => (
                <Dropdown
                  id='childName'
                  options={contractInformation.children.map(
                    (child: ChildType) => ({
                      label: `${child.first_name} ${child.last_name}`,
                      value: `${child.first_name} ${child.last_name}`,
                    })
                  )}
                  value={field.value}
                  onChange={e => onChildChange(e.value)}
                  placeholder={t('selectChild')}
                  className='w-full'
                />
              )}
            />
          </div>

          <motion.div
            className='bg-gray-50 rounded-lg p-6 mb-6'
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <InputTextAreaWrapper
              name='formulaInfo.formula'
              control={control}
              label={t('formula')}
            />

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 my-6'>
              {[0, 1, 2, 3].map(index => (
                <InputTextWrapper
                  key={index}
                  name={`formulaInfo.feedingTimes.${index}`}
                  control={control}
                  label={`${t('feddingTimes')} ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className='bg-gray-50 rounded-lg p-6 mb-6'
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <InputTextWrapper
                name='formulaInfo.maxBottleTime'
                control={control}
                label={t('maxBottleTime')}
              />
              <InputTextWrapper
                name='formulaInfo.minBottleTime'
                control={control}
                label={t('minBottleTime')}
              />
              <InputTextWrapper
                name='formulaInfo.bottleAmount'
                control={control}
                label={t('bottleAmount')}
                keyfilter='int'
              />
            </div>
          </motion.div>

          <motion.div
            className='bg-gray-50 rounded-lg p-6'
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className='grid grid-cols-1 gap-6'>
              <InputTextAreaWrapper
                name='formulaInfo.feedingInstructions'
                control={control}
                label={t('feedingInstructions')}
              />
              <InputTextAreaWrapper
                name='formulaInfo.otherFood'
                control={control}
                label={t('otherFood')}
              />
              <InputTextAreaWrapper
                name='formulaInfo.foodAllergies'
                control={control}
                label={t('foodAllergies')}
              />
              <CheckboxWrapper
                name='formulaInfo.followMealProgram'
                control={control}
                label={t('followMealProgram')}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className='flex justify-center gap-4 mt-8'
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary px-6 py-2'
          />
          <Button
            label={t('goToPermissionsInfo')}
            icon='pi pi-arrow-right'
            iconPos='right'
            className='p-button-primary px-4 py-2 text-sm font-medium'
            onClick={() => setActiveIndex(8)}
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary px-6 py-2'
            onClick={() => setActiveIndex(6)}
          />
        </motion.div>
      </motion.form>
    </motion.div>
  );
};
