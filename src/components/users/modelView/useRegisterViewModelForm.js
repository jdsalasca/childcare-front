/* eslint-disable no-unused-vars */

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { customLogger } from "../../../configs/logger";
import { ApiModels } from "../../../models/ApiModels";
import UsersAPI from "../../../models/UsersAPI";

/**
 * This is the useModelview for the register Form.
 * @returns 
 */
const useRegisterViewModelForm = () => {
  const navigate = useNavigate();

  const {t} = useTranslation();
  const toast = useRef(null);

  const {getValues, setValue, watch, control, handleSubmit, formState: { errors },setError } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      birth_date: '',
      email: '',
      password: '',
    },
  });


  const onSubmit = async (data) =>{
    customLogger.debug("data", data);
    if(await emailExist(data) || await userNameExist(data)){
      return
    }
    // Accessing the static method build from UserBuilder
const userFormatted = ApiModels.UserBuilder.build(data);
    customLogger.debug("aca seguimos motherfuckers", data,userFormatted);
    const createUser =await  UsersAPI.createUser(userFormatted);

    customLogger.debug("Usuario creadooooooooooooooooooooooooooooo", createUser);
    
  }
// Check if email already exists
const emailExist = async (data) => {
  try {
    const userExists = await UsersAPI.getUserByEmail(getValues("email"));
    customLogger.debug("userExists", userExists);
    if (userExists.httpStatus === 200) {
      setError("email", {
        type: "manual",
        message: t("email_already_exists"),  // Set custom error message using i18n
      });
      return true;
    }
    return false;
  } catch (error) {
    customLogger.error("Email check failed", error);
  }
};

// Check if username already exists
const userNameExist = async (data) => {
  try {
    const userExists = await UsersAPI.getUserByNickname( getValues("username"));
    customLogger.debug("userExists", userExists);

    if (userExists.httpStatus === 200) {
      setError("userName", {
        type: "manual",
        message: t("username_already_exists"),  // Set custom error message using i18n
      });
      return true;
    }
    return false;
  } catch (error) {
    customLogger.error("Username check failed", error);
  }
};


  return {
    handleSubmit,
    onSubmit,
    control,
    toast,
    t,
    navigate,
    getValues,
    emailExist,
    userNameExist
  };
};

export default useRegisterViewModelForm;