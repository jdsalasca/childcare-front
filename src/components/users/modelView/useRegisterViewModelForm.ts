// src/pages/Users/modelView/useRegisterViewModelForm.ts
import { useEffect, useState, RefObject } from "react";
import { useForm, Control, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { customLogger } from "../../../configs/logger";
import { ApiModels } from "../../../models/ApiModels";
import UsersAPI from "../../../models/UsersAPI";
import { Messages } from "primereact/messages";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role_id: string | number;
  cashiers_id: string | number;
  user_status_id: number;
}

interface Role {
  id: number;
  name: string;
}

interface Cashier {
  id: number;
  cashierNumber: string;
}

interface FormValues {
  username: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: string;
  cashiers_id: string;
  user_status_id: number;
}

interface SelectOption {
  label: string;
  value: string | number;
}

interface UseRegisterViewModelFormProps {
  onUserCreated: () => void;
  editingUser: User | null;
  onCancelEdit: () => void;
  toastRef: RefObject<Messages>;
}

interface UseRegisterViewModelFormReturn {
  handleSubmit: UseFormReturn<FormValues>['handleSubmit'];
  onSubmit: (data: FormValues) => Promise<void>;
  control: Control<FormValues>;
  getValues: UseFormReturn<FormValues>['getValues'];
  emailExist: () => Promise<boolean>;
  userNameExist: () => Promise<boolean>;
  roles: SelectOption[];
  cashiers: SelectOption[];
  errors: UseFormReturn<FormValues>['formState']['errors'];
  setValue: UseFormReturn<FormValues>['setValue'];
  reset: UseFormReturn<FormValues>['reset'];
}

const useRegisterViewModelForm = (
  onUserCreated: () => void,
  editingUser: User | null = null,
  onCancelEdit: () => void = () => {},
  toastRef: RefObject<Messages> = null
): UseRegisterViewModelFormReturn => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<SelectOption[]>([]);
  const [cashiers, setCashiers] = useState<SelectOption[]>([]);

  const {
    getValues,
    setValue,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
      cashiers_id: "",
      user_status_id: 1,
    },
  });

  const isEditing = Boolean(editingUser);

  useEffect(() => {
    if (editingUser) {
      Object.entries(editingUser).forEach(([key, value]) => {
        if (key !== "password" && key !== "password_confirmation") {
          setValue(key as keyof FormValues, value as string);
        }
      });
      setValue("password", "");
      setValue("password_confirmation", "");
    } else {
      reset();
    }
  }, [editingUser, reset, setValue]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const rolesRes = await UsersAPI.getRoles();
        const cashiersRes = await UsersAPI.getCashiers();

        if (rolesRes?.httpStatus === 200) {
          setRoles(
            rolesRes.response.map((r: Role) => ({ label: r.name, value: r.id }))
          );
        }
        if (cashiersRes?.httpStatus === 200) {
          setCashiers(
            cashiersRes.response.map((c: Cashier) => ({
              label: c.cashierNumber,
              value: c.id,
            }))
          );
        }
      } catch (error) {
        customLogger.error("Error fetching roles or cashiers", error);
      }
    };
    fetchData();
  }, []);

  const emailExist = async (): Promise<boolean> => {
    try {
      const res = await UsersAPI.getUserByEmail(getValues("email"));
      if (res.httpStatus === 200) {
        setError("email", {
          type: "manual",
          message: t("email_already_exists"),
        });
        return true;
      }
    } catch (error) {
      customLogger.error("Email check failed", error);
    }
    return false;
  };

  const userNameExist = async (): Promise<boolean> => {
    try {
      const res = await UsersAPI.getUserByNickname(getValues("username"));
      if (res.httpStatus === 200) {
        setError("username", {
          type: "manual",
          message: t("username_already_exists"),
        });
        return true;
      }
    } catch (error) {
      customLogger.error("Username check failed", error);
    }
    return false;
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
    const userFormatted = ApiModels.UserBuilder.build(data);

    try {
      let result;

      if (isEditing) {
        if (!data.password) {
          delete userFormatted.password;
          delete userFormatted.password_confirmation;
        }
        result = await UsersAPI.updateUser(editingUser!.id, userFormatted);
        if (result?.httpStatus === 200) {
          toastRef?.current?.show({
            severity: "success",
            summary: t("success"),
            detail: t("user_updated_successfully"),
            life: 3000,
          });
        }
      } else {
        if ((await emailExist()) || (await userNameExist())) return;
        result = await UsersAPI.createUser(userFormatted);
        if (result?.httpStatus === 201 || result?.httpStatus === 200) {
          toastRef?.current?.show({
            severity: "success",
            summary: t("success"),
            detail: t("user_created_successfully"),
            life: 3000,
          });
        }
      }

      reset();

      if (typeof onCancelEdit === "function") onCancelEdit();
      if (typeof onUserCreated === "function") onUserCreated();
    } catch (error) {
      customLogger.error("Error saving user", error);
      toastRef?.current?.show({
        severity: "error",
        summary: t("error"),
        detail: isEditing
          ? t("failed_to_update_user")
          : t("failed_to_create_user"),
        life: 3000,
      });
    }
  };

  return {
    handleSubmit,
    onSubmit,
    control,
    getValues,
    emailExist,
    userNameExist,
    roles,
    cashiers,
    errors,
    setValue,
    reset,
  };
};

export default useRegisterViewModelForm;