// src/pages/Users/components/FormRegister.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Messages } from "primereact/messages";
import CalendarWrapper from "../../../formsComponents/CalendarWrapper";
import InputTextWrapper from "../../../formsComponents/InputTextWrapper";
import PasswordWrapper from "../../../formsComponents/PasswordWrapper";
import SelectWrapper from "../../../formsComponents/SelectWrapper";
import useRegisterViewModelForm from "../../modelView/useRegisterViewModelForm";
import UsersAPI from "../../../../models/UsersAPI";
import { useTranslation } from "react-i18next";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  cashiers_id: number;
  role_id: number;
  role?: {
    name: string;
  };
  cashier?: {
    name: string;
  };
}

interface FormRegisterProps {
  // Add any props if needed
}

const FormRegister: React.FC<FormRegisterProps> = () => {
  const { t } = useTranslation();
  const toast = useRef<Messages>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [changePassword, setChangePassword] = useState<boolean>(false);

  const fetchUsers = async (): Promise<void> => {
    try {
      const res = await UsersAPI.getUsers();
      if (res.httpStatus === 200 && Array.isArray(res.response)) {
        setUsers(res.response);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editingUser = users.find((user) => user.id === editingUserId) || null;
  const isEditing = Boolean(editingUser);

  const resetForm = (): void => {
    setEditingUserId(null);
    setChangePassword(false);
    reset();
  };

  const {
    control,
    onSubmit,
    handleSubmit,
    getValues,
    emailExist,
    userNameExist,
    roles,
    cashiers,
    setValue,
    reset,
  } = useRegisterViewModelForm(fetchUsers, editingUser, resetForm, toast);

  return (
    <Card className="c-register-card">
      <Messages ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} className="c-form-register">
        <h3 id="title">{isEditing ? t("Edit User") : t("Register User")}</h3>

        <InputTextWrapper
          name="username"
          control={control}
          label={t("userName")}
          onBlur={userNameExist}
          rules={{ required: t("username_is_required") }}
        />

        <InputTextWrapper
          name="first_name"
          control={control}
          label={t("first_name")}
          rules={{ required: t("first_name_is_required") }}
        />

        <InputTextWrapper
          name="last_name"
          control={control}
          label={t("last_name")}
          rules={{ required: t("last_name_is_required") }}
        />

        <InputTextWrapper
          name="email"
          control={control}
          label={t("email")}
          onBlur={emailExist}
          rules={{ required: t("emailRequired") }}
        />

        <CalendarWrapper
          name="birth_date"
          control={control}
          label={t("birth_date")}
          rules={{ required: t("birth_date_is_required") }}
        />

        <SelectWrapper
          name="cashiers_id"
          control={control}
          options={[
            { label: t("select_cashier number"), value: "" },
            ...cashiers,
          ]}
          label={t("cashier number")}
          rules={{ required: t("box_is_required") }}
        />

        <SelectWrapper
          name="role_id"
          control={control}
          options={[{ label: t("select_role"), value: "" }, ...roles]}
          label={t("role")}
          rules={{ required: t("role_is_required") }}
        />

        {!isEditing || changePassword ? (
          <>
            <PasswordWrapper
              name="password"
              control={control}
              label={t("password")}
              rules={{ required: t("password_is_required") }}
            />
            <PasswordWrapper
              name="password_confirmation"
              control={control}
              label={t("password_confirmation")}
              rules={{
                required: t("password_is_required"),
                validate: (value: string) =>
                  value === getValues("password") ||
                  t("passwords_do_not_match"),
              }}
            />
          </>
        ) : (
          <Button
            type="button"
            label={t("Change Password")}
            className="p-button-warning"
            onClick={() => {
              setChangePassword(true);
              setValue("password", "");
              setValue("password_confirmation", "");
            }}
          />
        )}

        {isEditing && changePassword && (
          <Button
            type="button"
            label={t("Cancel Password Change")}
            className="p-button-secondary"
            onClick={() => {
              setChangePassword(false);
              setValue("password", "");
              setValue("password_confirmation", "");
            }}
          />
        )}

        <div
          className="c-section-register-actions"
          style={{ marginTop: "1rem" }}
        >
          <Button
            type="submit"
            label={isEditing ? t("Update") : t("Submit")}
            className="p-button-success"
          />
          {isEditing && (
            <Button
              type="button"
              label={t("Cancel")}
              onClick={resetForm}
              className="p-button-secondary"
              style={{ marginLeft: "0.5rem" }}
            />
          )}
        </div>
      </form>

      <hr />
      <h4>{t("Registered Users")}</h4>
      <table
        className="p-datatable"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th>#</th>
            <th>{t("Username")}</th>
            <th>{t("First Name")}</th>
            <th>{t("Last Name")}</th>
            <th>{t("Email")}</th>
            <th>{t("Rol")}</th>
            <th>{t("Cashier")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role?.name || ""}</td>
              <td>{user.cashier?.name || ""}</td>
              <td>
                <Button
                  type="button"
                  label={t("Edit")}
                  className="p-button-warning p-button-sm"
                  onClick={() => setEditingUserId(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default FormRegister;