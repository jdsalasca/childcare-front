import { Button } from "primereact/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { customLogger } from "../../../../configs/logger";
import CalendarWrapper from "../../../formsComponents/CalendarWrapper";
import InputTextWrapper from "../../../formsComponents/InputTextWrapper";
import { MigrateBillsModels } from "../../models/MigrateBillsModels";

interface MigrateBillsForm {
  initial_day: Date | null; // Allow null
  total_cash_initial_day: number | null; // Allow null
  total_check_initial_day: number | null; // Allow null
  target_day: Date | null; // Allow null
  total_cash_target_day: number | null; // Allow null
  total_check_target_day: number | null; // Allow null
}

const MigrateBills: React.FC = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = useForm<MigrateBillsForm>({
    defaultValues: MigrateBillsModels.initialStateComponent,
  });

  const onSubmit: SubmitHandler<MigrateBillsForm> = (data) => {
    // Handle form submission
  };

  const onChangeInitialDay = (value: Date) => { // Adjust the type as necessary
    customLogger.debug("onChangeInitialDay", value);
  };

  const onChangeTargetDay = (value: Date) => { // Adjust the type as necessary
    customLogger.debug("onChangeTargetDay", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="c-form-migrate-bills">
      <h3>{t('migrateBills')}</h3>
      <div className="c-form-group">
        <section>
          <CalendarWrapper
            control={control}
            name="initial_day"
            label={t('initialDay')}
            onChangeCustom={onChangeInitialDay}
          />
          <InputTextWrapper
            control={control}
            name="total_cash_initial_day"
            rules={{ required: t('totalCashRequired') }}
            label={t('totalCashInitialDay')}
          />
          <InputTextWrapper
            control={control}
            name="total_check_initial_day"
            label={t('totalCheckInitialDay')}
          />
        </section>
        <section>
          <CalendarWrapper
            control={control}
            name="target_day"
            label={t('targetDay')}
            onChangeCustom={onChangeTargetDay}
          />
          <InputTextWrapper
            control={control}
            name="total_cash_target_day"
            label={t('totalCashTargetDay')}
          />
          <InputTextWrapper
            control={control}
            name="total_check_target_day"
            label={t('totalCheckTargetDay')}
          />
        </section>
      </div>

      <Button type="submit" label={t('requestMigration')} className="p-button-success" />
    </form>
  );
};

export { MigrateBills };
