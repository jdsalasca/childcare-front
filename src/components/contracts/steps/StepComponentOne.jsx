import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ChildrenAPI, { useChildren } from '../../../models/ChildrenAPI';
import useGenderOptions from '../../../utils/customHooks/useGenderOptions';
import { Validations } from '../../../utils/validations';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractService } from '../contractModelView';
import { calculateAge, calculateWeeksOld, determineProgram } from '../utilsAndConstants';

/**
 * @param {Object} props
 * @param {Function} props.setLoadingInfo - Function to set loading state and message
 * @param {Function} props.setActiveIndex - Function to set the active step index
 * @param {Object} props.contractInformation - Contract information object
 * @param {Function} props.setContractInformation - Function to update contract information
 * @param {Object} props.toast - Toast object for showing messages
 * @returns 
 */
export const StepComponentOne = ({ setLoadingInfo, setActiveIndex, contractInformation, setContractInformation, toast }) => {
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
    return () => {};
  }, [children, setLoadingInfo]);

  useEffect(() => {
    setLoadingInfo({
      loading: children == null,
      loadingMessage: t("weAreLookingForChildrenInformation")
    })
    return () => {};
  }, [t, setLoadingInfo, children]);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      children: contractInformation.children || []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children'
  });

  const onCreateChild = async (data) => {
    return await ChildrenAPI.createChild(data).then(response => {
      if (response.httpStatus === 200) {
        return response.response;
      }
    });
  };

  const onUpdateChild = async (data) => {
    return await ChildrenAPI.updateChild(data.id, data).then(response => {
      if (response.httpStatus === 200) {
        return response.response;
      }
    });
  };

  const onHandlerChildBackendAsync = async (data) => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t("weAreSavingChildrenInformation")
    });
    const promises = data.children.map(child => {
      if (child.id == null) {
        return onCreateChild(child);
      } else {
        return onUpdateChild(child);
      }
    });

    try {
      const responses = await Promise.all(promises);
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      });
      return responses;
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      });
      console.error('Error processing children data', error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (ContractService.isInvalidFormDataChildren(data)) {
      ToastInterpreterUtils.toastInterpreter(toast, 'info', t('info'), t('addAtLeastOneGuardianAndAtLeastOneChild'), 3000);
      return;
    }

    try {
      const childrenAsync = await onHandlerChildBackendAsync(data);
      setContractInformation({ ...contractInformation, children: childrenAsync });
      toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
      setActiveIndex(1);
    } catch (error) {
      console.error('Error processing children data', error);
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
    const weeksOld = calculateWeeksOld(date);
    const program = determineProgram(weeksOld);
    let age = calculateAge(date);
    if (age === 0) { age = "0" }

    setValue(`children[${index}].program`, program);
    setValue(`children[${index}].age`, age);
    return date;
  };

  const handleChildSelect = (e) => {
    const selectedChild = e.value;

    toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoLoaded'), life: 3000 });

    const existingChildIndex = fields.findIndex(child => child.fullName === selectedChild.fullName);

    if (existingChildIndex === -1) {
      append({
        ...selectedChild,
        name: selectedChild.first_name || selectedChild.name,
        last_name: selectedChild.last_name || selectedChild.lastName,
        age: calculateAge(selectedChild.born_date),
        born_date: new Date(selectedChild.born_date),
        program: determineProgram(calculateWeeksOld(selectedChild.born_date))
      });
    } else {
      setValue(`children[${existingChildIndex}].born_date`, new Date(selectedChild.born_date));
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
              spanClassName="c-small-field r-m-13"
              showIcon
              onChangeCustom={(value) => handleBornDateChange(value, index)}
            />
            <InputTextWrapper
              name={`children[${index}].age`}
              control={control}
              readOnly={true}
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

// Define prop types for StepComponentOne
StepComponentOne.propTypes = {
  setLoadingInfo: PropTypes.func.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  contractInformation: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      age: PropTypes.string,
      bornDate: PropTypes.instanceOf(Date),
      program: PropTypes.string,
    })),
  }).isRequired,
  setContractInformation: PropTypes.func.isRequired,
  toast: PropTypes.shape({
    current: PropTypes.shape({
      show: PropTypes.func,
    }),
  }),
};

export default StepComponentOne;
