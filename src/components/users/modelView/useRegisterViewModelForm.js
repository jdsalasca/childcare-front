import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { customLogger } from "../../../configs/logger";
import { ApiModels } from "../../../models/ApiModels";
import UsersAPI from "../../../models/UsersAPI";

const useRegisterViewModelForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useRef(null);

  const [roles, setRoles] = useState([]);
  const [cashiers, setCashiers] = useState([]);

  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    setError,
    reset, // ✅ añadido aquí
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      birth_date: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_id: '',
      cashiers_id: '',
      user_status_id: 1,
    },
  });

  const fetchData = async () => {
    try {
      const rolesRes = await UsersAPI.getRoles();
      const cashiersRes = await UsersAPI.getCashiers();

      console.log("rolesRes", rolesRes);
      console.log("cashiersRes", cashiersRes);

      if (rolesRes?.httpStatus === 200 && Array.isArray(rolesRes.response)) {
        setRoles(
          rolesRes.response.map((role) => ({
            label: role.name,
            value: role.id,
          }))
        );
      }

      if (cashiersRes?.httpStatus === 200 && Array.isArray(cashiersRes.response)) {
        setCashiers(
          cashiersRes.response.map((cashier) => ({
            label: cashier.cashierNumber,
            value: cashier.id,
          }))
        );
      }
    } catch (error) {
      customLogger.error("Error fetching roles or cashiers", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (await emailExist(data) || await userNameExist(data)) return;

    const userFormatted = ApiModels.UserBuilder.build(data);

    try {
      const createUser = await UsersAPI.createUser(userFormatted);
      customLogger.debug("Usuario creado:", createUser);

      if (createUser?.httpStatus === 201 || createUser?.httpStatus === 200) {
        toast.current?.show({
          severity: "success",
          summary: t("success"),
          detail: t("user_created_successfully"),
          life: 3000,
        });

        // ✅ limpia el formulario después de crear el usuario
        reset({
          username: '',
          first_name: '',
          last_name: '',
          birth_date: '',
          email: '',
          password: '',
          password_confirmation: '',
          role_id: '',
          cashiers_id: '',
          user_status_id: 1,
        });
      }
    } catch (error) {
      customLogger.error("Error al crear el usuario", error);
      toast.current?.show({
        severity: "error",
        summary: t("error"),
        detail: t("failed_to_create_user"),
        life: 3000,
      });
    }
  };

  const emailExist = async () => {
    try {
      const userExists = await UsersAPI.getUserByEmail(getValues("email"));
      if (userExists.httpStatus === 200) {
        setError("email", {
          type: "manual",
          message: t("email_already_exists"),
        });
        return true;
      }
      return false;
    } catch (error) {
      customLogger.error("Email check failed", error);
    }
  };

  const userNameExist = async () => {
    try {
      const userExists = await UsersAPI.getUserByNickname(getValues("username"));
      if (userExists.httpStatus === 200) {
        setError("username", {
          type: "manual",
          message: t("username_already_exists"),
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
    userNameExist,
    roles,
    cashiers,
  };
};

export default useRegisterViewModelForm;
