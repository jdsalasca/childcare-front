/* eslint-disable no-unused-vars */

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { customLogger } from "../../../configs/logger";

/**
 * This is the useModelview for the register Form.
 * @returns 
 */
const useRegisterViewModelForm = () => {
  const navigate = useNavigate();

  const {t} = useTranslation();
  const toast = useRef(null);

  const {getValues, setValue, watch, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      birth_date: '',
      email: '',
      password: '',
    },
  });


  const onSubmit = (data) =>{
    customLogger.debug("data", data);
  }
 

  return {
    handleSubmit,
    onSubmit,
    control,
    toast,
    t,
    navigate
  };
};  

export default useRegisterViewModelForm;