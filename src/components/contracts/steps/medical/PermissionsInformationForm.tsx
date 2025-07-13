import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { ContractInfo } from '../../types/ContractInfo';
import { PermissionsInformation } from 'types/child';
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

export const PermissionsInformationForm: React.FC<PermissionsInformationFormProps> = ({ contractInformation, 
  setActiveIndex,setContractInformation, toast }) => {
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
    toast.current?.show({ severity: 'info', summary: t('permissionsInfoSaved') });
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full p-4"
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className='flex flex-col gap-6'
      >
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h4 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
            {t('permissions')}
          </h4>

          <div className="mb-8">
            <Controller
              name="childName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Dropdown
                    id="childName"
                  options={contractInformation.children.map(child => ({
                    label: `${child.first_name} ${child.last_name}`,
                    value: `${child.first_name} ${child.last_name}`
                  }))}
                  value={field.value}
                  onChange={(e) => onChildChange(e.value)}
                  placeholder={t('selectChild')}
                    className="w-full"
                  />
                  {error && <small className="p-error">{error.message}</small>}
                </>
              )}
            />
          </div>

          <motion.div 
            className="bg-gray-50 rounded-lg p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CheckboxWrapper
                name="permissions.soap"
                control={control}
                label={t('soap')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />

              <CheckboxWrapper
                name="permissions.sanitizer"
                control={control}
                label={t('sanitizer')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />

              <CheckboxWrapper
                name="permissions.rashCream"
                control={control}
                label={t('rashCream')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />  

              <CheckboxWrapper
                name="permissions.teethingMedicine"
                control={control}
                labelPosition='left'
                label={t('teethingMedicine')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />

              <CheckboxWrapper
                name="permissions.sunscreen"
                control={control}
                label={t('sunscreen')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />

              <CheckboxWrapper
                name="permissions.insectRepellent"
                control={control}
                label={t('insectRepellent')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
              />
            </div>

            <div className="mt-6">
              <InputTextWrapper
                name="permissions.other"
                control={control}
                label={t('otherPermissions')}
                checkboxClassName="bg-white p-4 rounded-lg shadow-sm"
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
            type="submit"
            label={t('save')}
            className='p-button-primary px-6 py-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary px-6 py-2'
            onClick={() => setActiveIndex(7)}
          />
          <Button
            label={t('goToContractInfo')}
            icon="pi pi-arrow-right"
            iconPos="right"
            className='p-button-primary px-4 py-2 text-sm font-medium'
            onClick={() => setActiveIndex(9)}
          />

        </motion.div>
      </motion.form>
    </motion.div>
  );
}