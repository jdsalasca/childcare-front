import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { ContractInfo } from '../../types/ContractInfo';
import { ChildType, MedicalInformation } from 'types/child';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { InputTextAreaWrapper } from '@components/formsComponents/InputTextAreaWrapper';
import { Toast } from 'primereact/toast';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { LoadingInfo } from '@models/AppModels';
interface MedicalInformationFormProps {
  setLoadingInfo: (info: LoadingInfo) => void;  
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast>;
  setActiveIndex: (index: number) => void;
}

export const MedicalInformationForm: React.FC<MedicalInformationFormProps> 
= ({ setLoadingInfo, contractInformation, setContractInformation, toast, setActiveIndex }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<{ 
    childName: string;
    medicalInfo: MedicalInformation;
  }>();

  const onChildChange = (value: string) => {
    // Find the selected child's medical information
    const selectedChild = contractInformation.children.find(
      child => `${child.first_name} ${child.last_name}` === value
    );

    // Reset form with either existing medical info or empty values
    reset({
      childName: value,
      medicalInfo: selectedChild?.medicalInformation || {
        healthStatus: '',
        treatment: '',
        allergies: '',
        instructions: ''
      }
    });

    return value;
  };


  const onSubmit = (data: { childName: string; medicalInfo: MedicalInformation }) => {
    if (data.childName) {
      const updatedChildren = contractInformation.children.map(child => {
        const fullName = `${child.first_name} ${child.last_name}`;
        if (fullName === data.childName) {
          return {
            ...child,
            medicalInformation: data.medicalInfo
          };
        }
        return child;
      });

      setContractInformation({
        ...contractInformation,
        children: updatedChildren
      });

      toast.current?.show({ severity: 'success', summary: t('medicalInfoSaved') });
    /* setActiveIndex(7); */ // Move to the next step or handle as needed

    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col  gap-10'>
      <h4 className='text-center'>{t('medicalInformation')}</h4>
      
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
        name="medicalInfo.healthStatus"
        control={control}
        label={t('healthStatus')}
      />

      <InputTextWrapper
        name="medicalInfo.treatment"
        control={control}
        label={t('treatment')}
      />

      <InputTextAreaWrapper
        name="medicalInfo.allergies"
        control={control}
        label={t('allergies')}
      />

      <InputTextAreaWrapper
        name="medicalInfo.instructions"
        control={control}
        label={t('instructions')}
      />

      <Button type="submit" label={t('save')} className='w-40 mx-auto' />
    </form>
  );
};