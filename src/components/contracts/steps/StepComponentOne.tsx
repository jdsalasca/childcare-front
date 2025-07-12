import { LoadingInfo } from '@models/AppModels';
import { customLogger } from 'configs/logger';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useEffect, useState, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChildType } from 'types/child';
import ChildrenAPI, { useChildren } from '../../../models/ChildrenAPI';
import useGenderOptions from '../../../utils/customHooks/useGenderOptions';
import { Validations } from '../../../utils/validations';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractService } from '../contractModelView';
import { ContractInfo } from '../types/ContractInfo';
import { calculateAge, calculateWeeksOld, determineProgram } from '../utilsAndConstants';



interface StepComponentOneProps {
  setLoadingInfo: (info: LoadingInfo) => void;
  loadingInfo: LoadingInfo;
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast>,
}

export const StepComponentOne: React.FC<StepComponentOneProps> = ({
  setLoadingInfo,
  loadingInfo,
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast,
}) => {
  const { t } = useTranslation();
  const { genderOptions } = useGenderOptions();
  const { data: children, isLoading, refreshChildren } = useChildren();

  // Memoize children options to prevent unnecessary re-renders
  const childrenOptions = useMemo(() => {
    if (!children) return [];
    return children.map((child: ChildType) => ({
      ...child,
      fullName: `${child.first_name} ${child.last_name}`,
    }));
  }, [children]);

  useEffect(() => {
    customLogger.debug("children", children);
  
    // Handle loading state
    if (isLoading) {
      // Only set loading info if it's not already set
      if (!loadingInfo.loading) {
        setLoadingInfo({
          loading: true,
          loadingMessage: t("weAreLookingForChildrenInformation"),
        });
      }
    } else {
      // Update loading info if it needs to change
      const loadingMessage = children?.length === 0 ? t("noChildrenAvailable") : "";
      if (loadingInfo.loading || loadingInfo.loadingMessage !== loadingMessage) {
        setLoadingInfo({
          loading: false,
          loadingMessage: loadingMessage,
        });
      }
    }
  }, [children, isLoading, loadingInfo.loading, loadingInfo.loadingMessage, t, setLoadingInfo]);

  const { control, handleSubmit, formState: { errors }, setValue,getValues,  } = useForm<{ children: ChildType[] }>({
    defaultValues: {
      children: contractInformation.children || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'children',
  });

  const onCreateChild = async (data: ChildType): Promise<ChildType | undefined> => {
    const response = await ChildrenAPI.createChild(data);
    if (response.httpStatus === 200) {
      return response.response;
    }
  };

  const onUpdateChild = async (data: ChildType): Promise<ChildType | undefined> => {
    const response = await ChildrenAPI.updateChild(data.id!, data);
    if (response.httpStatus === 200) {
      return response.response;
    }
  };

  const onHandlerChildBackendAsync = async (data: { children: ChildType[] }): Promise<ChildType[]> => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t("weAreSavingChildrenInformation"),
    });
  
    const promises = data.children.map(child => 
      child.id == null ? onCreateChild(child) : onUpdateChild(child)
    );

    try {
      const responses = await Promise.all(promises);
      
      // Filter out undefined responses
      const validResponses = responses.filter((response): response is ChildType => response !== undefined);
      await refreshChildren();
      setLoadingInfo({
        loading: false,
        loadingMessage: "",
      });
      
      return validResponses;
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: "",
      });
      console.error('Error processing children data', error);
      throw error;
    }
};

const onSubmit = async (data: { children: ChildType[] }) => {
  if (ContractService.isInvalidFormDataChildren(data)) {
    ToastInterpreterUtils.toastInterpreter(toast, 'info', t('info'), t('addAtLeastOneGuardianAndAtLeastOneChild'), 3000);
    return;
  }

  try {
    const childrenAsync = await onHandlerChildBackendAsync(data);
    
    // Create a map of existing children's additional information
    const existingChildrenMap = new Map(
      contractInformation.children?.map(child => [
        child.id,
        {
          medicalInformation: child.medicalInformation,
          formulaInformation: child.formulaInformation,
          permissionsInformation: child.permissionsInformation
        }
      ])
    );

    // Merge new children data with existing additional information
    const mergedChildren = childrenAsync.map(child => ({
      ...child,
      medicalInformation: existingChildrenMap.get(child.id)?.medicalInformation || child.medicalInformation,
      formulaInformation: existingChildrenMap.get(child.id)?.formulaInformation || child.formulaInformation,
      permissionsInformation: existingChildrenMap.get(child.id)?.permissionsInformation || child.permissionsInformation
    }));

    setContractInformation({ 
      ...contractInformation, 
      children: mergedChildren 
    });

    toast?.current?.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
    setActiveIndex(1);
  } catch (error) {
    console.error('Error processing children data', error);
    toast?.current?.show({ severity: 'error', summary: 'Error', detail: t('childrenInfoSaveFailed'), life: 3000 });
  }
};
  const addChild = () => {
    append({
      first_name: '',
      last_name: '',
      name: '', // Set a default or empty value as needed
      born_date:  undefined,
      program: '',
      classroom: '', // Set a default or empty value as needed
      age: 0, // or any default value you prefer
      fullName: '', // or set it based on first_name and last_name,
      status: "Active",
  });
  };

  const removeChild = (index: number) => {
    remove(index);
  };
  const handleBornDateChange = (date: Date | undefined, index: number) => {
    customLogger.debug("date", date, getValues());
    if (!date) return;
  
    const weeksOld = calculateWeeksOld(date);
    const program = determineProgram(weeksOld);
    let age = calculateAge(date);
    
    // Convert age to string if necessary
    if (age === 0) { 
      age = 1; 
    }
  
    const currentProgram = getValues(`children.${index}.program`);
    const currentAge = getValues(`children.${index}.age`);
  
    // Update only if the new values are different
    if (currentProgram !== program) {
      customLogger.debug("Updating program", { currentProgram, newProgram: program });
      setValue(`children.${index}.program` as const, program);
    }
  
    if (currentAge !== age) {
      customLogger.debug("Updating age", { currentAge, newAge: age });
      setValue(`children.${index}.age` as const, age);
    }
    update(index, { ...getValues(`children.${index}`), program, age });
  };
  
  
  const handleChildSelect = (e: { value: ChildType }) => {
    const selectedChild = e.value;

    toast?.current?.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoLoaded'), life: 3000 });

    const existingChildIndex = fields.findIndex(child => {  
      if(child.static_id && selectedChild.static_id){
        return child.static_id === selectedChild.static_id;
      }else if(child.name && selectedChild.name){
        return (child.name+child.last_name).toLowerCase() ===  (selectedChild.name+selectedChild.last_name).toLowerCase();
      }
      return false;
    });
    customLogger.debug("existingChildIndex", existingChildIndex);
    customLogger.debug("selectedChild", selectedChild);
    customLogger.debug("fields", fields);
    if (existingChildIndex === -1) {
      append({
        ...selectedChild,
        name: selectedChild.first_name || selectedChild.name,
        last_name: selectedChild.last_name,
        age: calculateAge(selectedChild.born_date!),
        born_date: new Date(selectedChild.born_date!),
        program: determineProgram(calculateWeeksOld(selectedChild.born_date!)),
      });
    } else {
      setValue(`children.${existingChildIndex}.born_date` as const, new Date(selectedChild.born_date!));
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field p-float-label" style={{ marginBottom: "30px", maxWidth: "15rem" }}>
          <Dropdown
            id="names-dropdown-child"
            filter
            options={childrenOptions}
            onChange={handleChildSelect}
            optionLabel="fullName"
          />
          <label htmlFor="names-dropdown-child" style={{ paddingTop: "0px" }}>{t('pickAChild')}</label>
        </div>
        {fields.map((child, index) => (
          <div key={child.id} className="child-form">
            <DropdownWrapper
              name={`children[${index}].gender_id`}
              control={control}
              options={genderOptions || []}
              optionValue="id"
              optionLabel="short_name"
              rules={{ required: t('genderRequired') }}
              label={t('gender')}
              placeholder={t('selectGender')}
              spanClassName="c-small-field"
            />
            <InputTextWrapper
              name={`children[${index}].first_name`}
              control={control}
              rules={{ required: t('childNameRequired') }}
              label={t('childName')}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              onChangeCustom={(value) => Validations.capitalizeFirstLetter(value)}
              errors={errors}
            />
            <InputTextWrapper
              name={`children[${index}].last_name`}
              control={control}
              rules={{ required: t('childLastNameRequired') }}
              label={t('childLastName')}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              onChangeCustom={(value) => Validations.capitalizeFirstLetter(value)}
            />
            <CalendarWrapper
              name={`children[${index}].born_date`}
              control={control}
              maxDate={new Date()}
              rules={{ required: t('bornDateRequired') }}
              label={t('bornDate')}
              dateFormat="mm/dd/yy"
              spanClassName="p-float-label"

              showIcon
              onChangeCustom={(value : Date) => handleBornDateChange(value, index)}
            />
            <InputTextWrapper
              name={`children[${index}].age`}
              control={control}
              disabled={true}
              rules={{
                min: { value: 0, message: t('ageMustBeGreaterThanZero') }
              }}
              label={t('childAge')}
              spanClassName="c-small-field r-m-9"
            />
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-text p-ml-2"
              onClick={() => removeChild(index)}
            />
          </div>
        ))}
        <div className="button-group">
          <Button
            icon="pi pi-plus"
            label={t('addChild')}
            className="p-button-success"
            onClick={(e) => {
              e.preventDefault();
              addChild();
            }}
          />
          <Button type="submit" label={t('save')} className="p-button-primary p-ml-2" />
        </div>
      </form>
    </div>
  );
};

export default StepComponentOne;
