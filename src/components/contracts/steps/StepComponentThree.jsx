import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useTranslation } from 'react-i18next';


export const StepComponentThree = ({ setActiveIndex, contractInformation, setContractInformation, toast }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            terms: contractInformation.terms
        }
    });

    const { t } = useTranslation();

    const onSubmit = (data) => {
        setContractInformation({ ...contractInformation, terms: data.terms });
        toast.current.show({ severity: 'success', summary: t('termsUpdated'), detail: t('termsUpdatedMessage') });
        setActiveIndex(3); // Move to the next step or handle as needed
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                {["walkAroundNeighborhood", "walkToThePark", "walkAroundSchool",  "allowPhotos", "allowExternalPhotos", "specialExternalUsage", "externalUsageAllowed","receiveManual"].map((term) => (
                    <div key={term} className="checkbox-container">
                        <Controller
                            name={`terms.${term}`}
                            control={control}
                            render={({ field }) => (
                                <div className="checkbox-wrapper">
                                    <Checkbox id={term} {...field} checked={field.value} />
                                    <label htmlFor={term} style={{ fontWeight: term === "receiveManual" ? "bold" : "normal" }}>{t(term)}</label>

                                </div>
                            )}
                        />
                    </div>
                ))}
                <div className="button-group">
                    <Button type="submit" label={t('save')} className="p-button-primary rounded-button" />
                    <Button label={t('returnToPreviousStep')} className="p-button-secondary rounded-button" onClick={() => setActiveIndex(1)} />
                    <Button label={t('nextStep')} className="p-button-success rounded-button" onClick={() => setActiveIndex(4)} />
                </div>
            </form>
        </div>
    );
};

export default StepComponentThree;