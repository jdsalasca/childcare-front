import { InputNumber } from 'primereact/inputnumber';
import { Nullable } from 'primereact/ts-helpers';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Bill {
  id: string; // Adjust based on your data structure
  bill: string; // Adjust based on your data structure
}

interface BillTypesController {
  amount: number | null;
  value: number | null;
}

interface BillsByNominationProps {
  bill: Bill;
  index: number;
  control: any; // Replace with appropriate type if available
  handleAmountChange: (index: number, value: Nullable<number | null>) => void;
  billTypesController: BillTypesController[];
}

const BillsByNomination: React.FC<BillsByNominationProps> = ({
  bill,
  index,
  control,
  handleAmountChange,
  billTypesController,
}) => {
  const { t } = useTranslation();

  return (
    <div className='bill-card'>
      <span className='p-field'>
        <Controller
          name={`billTypes.${index}.billTypeId`}
          control={control}
          render={() => (
            <p style={{ minWidth: '10rem' }}>
              {t('bill')} {bill.bill}
            </p>
          )}
        />
      </span>

      <span className='p-float-label'>
        <Controller
          name={`billTypes.${index}.amount`}
          control={control}
          render={({ field }) => (
            <InputNumber
              id={`billTypes.${index}.amount`}
              value={field.value}
              onValueChange={e => handleAmountChange(index, e.value)}
            />
          )}
        />
        <label htmlFor={`billTypes.${index}.amount`}>{t('quantity')}</label>
      </span>

      <span className='p-field'>
        <Controller
          name={`billTypes.${index}.total`}
          control={control}
          render={() => (
            <p style={{ minWidth: '10rem' }}>
              {t('total')} $
              {(
                billTypesController[index].amount ||
                0 * (billTypesController[index].value || 0)
              ).toFixed(2)}
            </p>
          )}
        />
      </span>
    </div>
  );
};

interface BillsContainerProps {
  billTypeFields: Bill[];
  billTypesController: BillTypesController[];
  handleAmountChange: (index: number, value: Nullable<number | null>) => void;
  show: boolean;
  control: any; // Replace with appropriate type if available
}

const BillsContainer: React.FC<BillsContainerProps> = ({
  billTypeFields,
  billTypesController,
  handleAmountChange,
  show,
  control,
}) => {
  return (
    <div
      className='bills-container'
      style={{ display: show ? 'block' : 'none' }}
    >
      <h4>Payment Information</h4>
      {billTypeFields.map((bill, index) => (
        <BillsByNomination
          key={bill.id}
          bill={bill}
          index={index}
          control={control}
          handleAmountChange={handleAmountChange}
          billTypesController={billTypesController}
        />
      ))}
    </div>
  );
};

export { BillsByNomination, BillsContainer };
