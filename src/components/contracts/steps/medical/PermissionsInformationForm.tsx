import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { ContractInfo } from '../../types/ContractInfo';
import { ChildType, PermissionsInformation } from 'types/child';
import CheckboxWrapper from '@components/formsComponents/CheckboxWrapper';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { LoadingInfo } from '@models/AppModels';
import { motion } from 'framer-motion';

interface PermissionsInformationFormProps {
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast>;
  setActiveIndex: (index: number) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
}

export const PermissionsInformationForm: React.FC<PermissionsInformationFormProps> = ({ contractInformation, setContractInformation, toast }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<{
    childName: string;
    permissions: PermissionsInformation;
  }>();

  const onChildChange = (value: string) => {
    const selectedChild = contractInformation.children.find(
      child => `${child.first_name} ${child.last_name}` === value
    );

    reset({
      childName: value,
      permissions: selectedChild?.permissionsInformation || {
        soap: false,
        sanitizer: false,
        rashCream: false,
        teethingMedicine: false,
        sunscreen: false,
        insectRepellent: false,
        other: ''
      }
    });

    return value;
  };

  const onSubmit = (data: { childName: string; permissions: PermissionsInformation }) => {
    if (data.childName) {
      const updatedChildren = contractInformation.children.map(child => {
        const fullName = `${child.first_name} ${child.last_name}`;
        if (fullName === data.childName) {
          return {
            ...child,
            permissionsInformation: data.permissions
          };
        }
        return child;
      });

      setContractInformation({
        ...contractInformation,
        children: updatedChildren
      });

      toast.current?.show({ severity: 'success', summary: t('permissionsInfoSaved') });
    }
  };

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
      <h4 className='text-center'>{t('permissions')}</h4>

      <Controller
        name="childName"
        control={control}
        rules={{ required: t('requiredField') }}
        render={({ field }) => (
          <Dropdown
            id="childName"
            options={contractInformation.children.map(child => ({
              label: `${child.first_name} ${child.last_name}`,
              value: `${child.first_name} ${child.last_name}`
            }))}
            value={field.value}
            onChange={(e) => onChildChange(e.value)}
            placeholder={t('selectChild')}
          />
        )}
      />

      <CheckboxWrapper
        name="permissions.soap"
        control={control}
        label={t('soap')}
      />

      <CheckboxWrapper
        name="permissions.sanitizer"
        control={control}
        label={t('sanitizer')}
      />

      <CheckboxWrapper
        name="permissions.rashCream"
        control={control}
        label={t('rashCream')}
      />

      <CheckboxWrapper
        name="permissions.teethingMedicine"
        control={control}
        labelPosition='left'
        label={t('teethingMedicine')}
      />

      <CheckboxWrapper
        name="permissions.sunscreen"
        control={control}
        label={t('sunscreen')}
      />

      <CheckboxWrapper
        name="permissions.insectRepellent"
        control={control}
        label={t('insectRepellent')}
      />

      <InputTextWrapper
        name="permissions.other"
        control={control}
        label={t('otherPermissions')}
      />

      <Button type="submit" label={t('save')} className='w-40 mx-auto' />
    </motion.form>
  );
}