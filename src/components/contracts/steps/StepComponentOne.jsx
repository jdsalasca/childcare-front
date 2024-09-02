import React, { useEffect, useState } from 'react';
import { useForm,  useFieldArray } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { calculateAge, calculateWeeksOld, capitalizeFirstLetter, determineProgram} from '../utilsAndConsts';
import ChildrenAPI, { useChildren } from '../../../models/ChildrenAPI';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import useGenderOptions from '../../../utils/customHooks/useGenderOptions';

/**
 * 
 * @param {setLoadingInfo}  setLoadingInfo :: Arg used to set an error message
 * @returns 
 */
export const StepComponentOne = ({ setLoadingInfo, setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { t } = useTranslation();
  const [childrenOptions, setChildrenOptions] = useState([]);
  const { genderOptions } = useGenderOptions();
  const { data: children } = useChildren();
  useEffect(() => {
    if (children?.response != null && children?.httpStatus === 200) {
      setChildrenOptions(
        children?.response?.map(child => ({
          ...child,
          fullName: `${child.first_name} ${child.last_name}`
        }))
      )
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      })
    }
    return () => {
    };
  }, [children, setLoadingInfo]);

  /**
   * Component Initialization
   */
  useEffect(() => {
    setLoadingInfo({
      loading: children == null,
      loadingMessage: t("weAreLookingForChildrenInformation")
    })
    return () => {

    };

  }, []);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      children: contractInformation.children || []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children'
  });
  const onCreateChild =async (data) => {
    return await ChildrenAPI.createChild(data).then(response => {
      console.log("response", response);
      if (response.httpStatus === 200) {
        //toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
        return response.response;
      }
    });

  };
  const onUpdateChild = async (data) => {
    return await ChildrenAPI.updateChild(data.id, data).then(response => {
      if (response.httpStatus === 200) {
        //toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
        return response.response;
      }
    });
  };
  const onHandlerChildBackendAsync = async (data) => {
    // Map over the children to create an array of promises
    setLoadingInfo({
      loading: true,
      loadingMessage: t("weAreSavingChildrenInformation")
    })
    const promises = data.children.map(child => {
      if (child.id == null) {
        // Create child if ID is null
        return onCreateChild(child); // Return the promise from onCreateChild
      } else {
        // Update child if ID is present
        return onUpdateChild(child); // Return the promise from onUpdateChild
      }
    });
  
    try {
      // Wait for all promises to resolve
      const responses = await Promise.all(promises);
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      })
      // Handle the resolved responses as needed
      console.log("All responses received", responses);
      
      // Return or process the responses as needed
      return responses;
  
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      })
      console.error('Error processing children data', error);
      // Handle the error as needed
      throw error; // Optionally re-throw the error to be handled by the caller
    }
  };
  
  //#region  onSubmit method
  const onSubmit = async(data) => {
 
  try {
    console.log("data", data);
    
    const childrenAsync = await onHandlerChildBackendAsync(data);
    console.log("responses", childrenAsync);

    // Update parent component with the new children data
    setContractInformation({ ...contractInformation, children: childrenAsync });
    
    // Show success toast message
    toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
    
    // Optionally update active index or handle other logic
    setActiveIndex(1);
  } catch (error) {
    console.error('Error processing children data', error);
    // Show error toast or handle error as needed
    toast.current.show({ severity: 'error', summary: 'Error', detail: t('childrenInfoSaveFailed'), life: 3000 });
  }
};

  const addChild = () => {
    append({ name: '', age: '', bornDate: null, program: '' });
  };

  const removeChild = (index) => {
    remove(index);
  };

  const handleBornDateChange = (date, index) => {
    console.log("date", date);
    console.log("index", index);


    const weeksOld = calculateWeeksOld(date);
    console.log("weeksOld", weeksOld);

    const program = determineProgram(weeksOld);
    const age = calculateAge(date);
    setValue(`children[${index}].program`, program);
    setValue(`children[${index}].age`, age);
    return date;
  };

  const handleChildSelect = (e) => {
    const selectedChild = e.value;
    console.log("selectedChild", selectedChild);

    toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoLoaded'), life: 3000 });

    // Check if the child already exists in the fields
    const existingChildIndex = fields.findIndex(child => child.fullName === selectedChild.fullName);

    if (existingChildIndex === -1) {
      // If the child does not exist, add it to the fields
      append({
        ...selectedChild,
        name: selectedChild.first_name || selectedChild.name,
        last_name	: selectedChild.last_name || selectedChild.lastName,
        age: calculateAge(selectedChild.born_date),
        born_date: new Date(selectedChild.born_date), 
        program: determineProgram(calculateWeeksOld(selectedChild.born_date))
      });
    } else {
      // If the child exists, populate the form with the child's data
      setValue(`children[${existingChildIndex}].born_date`, new Date(selectedChild.born_date));
    }
  };
  //#region  form
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
              onChangeCustom={(value) => capitalizeFirstLetter(value)}
              errors={errors}
            />

            <InputTextWrapper
              name={`children[${index}].last_name`}
              control={control}
              rules={{ required: t('childLastNameRequired') }}
              label={t('childLastName')}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              onChangeCustom={(value) => capitalizeFirstLetter(value)}

            />
            <CalendarWrapper
              name={`children[${index}].born_date`}
              control={control}
              rules={{ required: t('bornDateRequired') }}
              label={t('bornDate')}
              dateFormat="yy-mm-dd"
              showIcon
              onChangeCustom={(value) => handleBornDateChange(value, index)}
            />
            <InputTextWrapper
              name={`children[${index}].age`}
              control={control}
              rules={{
                min: { value: 0, message: t('ageMustBeGreaterThanZero') }
              }}
              label={t('childAge')}
              disabled
              keyFilter="int"
              spanClassName="c-small-field"
              placeholder={t('agePlaceholder')} // Optional placeholder text
            />

            {/* <Controller
              name={`children[${index}].program`}
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <Dropdown
                    style={{ minWidth: "10rem" }}
                    id={`child-program-${index}`}
                    {...field}
                    options={programOptions}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].program })}
                    disabled
                  />
                  <label htmlFor={`child-program-${index}`}>{t('program')}</label>
                </span>
              )}
            /> */}

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
          {/* <Button label={!validForm ? t('fillTheForm') : t('next')} className="p-button-secondary p-ml-2" onClick={goToNextStep} disabled={!validForm} /> */}
        </div>
      </form>
    </div>
  );
};

export default StepComponentOne;
