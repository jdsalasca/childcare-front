import { useFieldArray, Control } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { motion } from 'framer-motion';

interface EmergencyContactCardProps {
  control: Control<any>;
  type: 'release' | 'emergency';
  maxContacts?: number;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  control,
  type,
  maxContacts = 4
}) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: type === 'emergency' ? 'emergencyContacts' : 'releasedToPersons'
  });

  const addContact = () => {
    if (fields.length < maxContacts) {
      append({
        name: '',
        address: '',
        city: '',
        phone: '',
        type
      });
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
        {type === 'emergency' ? t('emergencyContacts') : t('releasedToPersons')}
      </h4>

      {fields.map((field, index) => (
        <motion.div 
          key={field.id}
          className="bg-gray-50 rounded-lg p-6 mb-4"
          whileHover={{ scale: 1.01 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputTextWrapper
              name={`${type === 'emergency' ? 'emergencyContacts' : 'releasedToPersons'}.${index}.name`}
              control={control}
              label={t('name')}
              rules={{ required: t('required') }}
            />
            <InputTextWrapper
              name={`${type === 'emergency' ? 'emergencyContacts' : 'releasedToPersons'}.${index}.phone`}
              control={control}
              label={t('phone')}
              rules={{ required: t('required') }}
            />
            <InputTextWrapper
              name={`${type === 'emergency' ? 'emergencyContacts' : 'releasedToPersons'}.${index}.address`}
              control={control}
              label={t('address')}
              rules={{ required: t('required') }}
            />
            <InputTextWrapper
              name={`${type === 'emergency' ? 'emergencyContacts' : 'releasedToPersons'}.${index}.city`}
              control={control}
              label={t('city')}
              rules={{ required: t('required') }}
            />
          </div>
          <Button
            icon="pi pi-trash"
            className="p-button-danger p-button-text mt-2"
            onClick={() => remove(index)}
          />
        </motion.div>
      ))}

      {fields.length < maxContacts && (
        <Button
          label={t('addContact')}
          icon="pi pi-plus"
          className="p-button-secondary mt-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addContact();
          }}
        />
      )}
    </motion.div>
  );
};