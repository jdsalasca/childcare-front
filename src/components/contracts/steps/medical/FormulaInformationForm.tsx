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
  toast: React.RefObject<Toast>;
  setActiveIndex: (index: number) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
}

export const FormulaInformationForm: React.FC<FormulaInformationFormProps> = ({ contractInformation, setContractInformation, toast }) => {
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
        followMealProgram: null
      }
    });

    return value;
  };

  const onSubmit = (data: { childName: string; formulaInfo: FormulaInformation }) => {
    if (data.childName) {
      const updatedChildren = contractInformation.children.map((child: ChildType) => {
        const fullName = `${child.first_name} ${child.last_name}`;
        if (fullName === data.childName) {
          return {
            ...child,
            formulaInformation: data.formulaInfo
          };
        }
        return child;
      });

      setContractInformation({
        ...contractInformation,
        children: updatedChildren
      });

      toast.current?.show({ severity: 'success', summary: t('formulaInfoSaved') });
    }
  };

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
      <h4 className='text-center'>{t('babyFormulaAndFeeding')}</h4>

      <Controller
        name="childName"
        control={control}
        rules={{ required: t('requiredField') }}
        render={({ field }) => (
          <Dropdown
            id="childName"
            options={contractInformation.children.map((child: ChildType) => ({
              label: `${child.first_name} ${child.last_name}`,
              value: `${child.first_name} ${child.last_name}`
            }))}
            value={field.value}
            onChange={(e) => onChildChange(e.value)}
            placeholder={t('selectChild')}
          />
        )}
      />

      <InputTextAreaWrapper
        name="formulaInfo.formula"
        control={control}
        label={t('formula')}
        rules={{ required: t('requiredField') }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[0,1,2,3].map((index) => (
          <InputTextWrapper
            key={index}
            name={`formulaInfo.feedingTimes.${index}`}
            control={control}
            label={`${t('feeding')} ${index + 1}`}
          />
        ))}
      </div>

      <InputTextWrapper
        name="formulaInfo.maxBottleTime"
        control={control}
        label={t('maxBottleTime')}
        rules={{ required: t('requiredField') }}
      />

      <InputTextWrapper
        name="formulaInfo.minBottleTime"
        control={control}
        label={t('minBottleTime')}
        rules={{ required: t('requiredField') }}
       
      />

      <InputTextWrapper
        name="formulaInfo.bottleAmount"
        control={control}
        label={t('bottleAmount')}
        rules={{ required: t('requiredField') }}
        keyfilter="int"
      />

      <InputTextAreaWrapper
        name="formulaInfo.feedingInstructions"
        control={control}
        label={t('feedingInstructions')}
        rules={{ required: t('requiredField') }}
      />

      <InputTextAreaWrapper
        name="formulaInfo.otherFood"
        control={control}
        label={t('otherFood')}
        rules={{ required: t('requiredField') }}
      />

      <InputTextAreaWrapper
        name="formulaInfo.foodAllergies"
        control={control}
        label={t('foodAllergies')}
        rules={{ required: t('requiredField') }}
      />
       <CheckboxWrapper
        name="formulaInfo.followMealProgram"
        control={control}
        label={t('followMealProgram')}
      />

      <Button type="submit" label={t('save')} className='w-40 mx-auto' />
    </motion.form>
  );
}