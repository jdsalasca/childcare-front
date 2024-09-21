/* eslint-disable no-unused-vars */
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { customLogger } from "../../../../configs/logger";
import CalendarWrapper from "../../../formsComponents/CalendarWrapper";
import InputTextWrapper from "../../../formsComponents/InputTextWrapper";
import { MigrateBillsModels } from "../../models/MigrateBillsModels";

const MigrateBills = () => {
    const {t} = useTranslation();
    const {control, handleSubmit, formState: {errors}} = useForm({defaultValues: MigrateBillsModels.initialStateComponent});
    const onSubmit = (data) => {

    };
    const onChangeInitialDay = (value) => {
        customLogger.debug("onChangeInitialDay", value);
    };
    const onChangeTargetDay = (value) => {
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
                rules={{required: t('totalCashRequired')}}
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
