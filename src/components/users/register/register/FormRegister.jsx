import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Messages } from "primereact/messages";
import { RegexPatterns } from "../../../../utils/regexPatterns";
import { Validations } from "../../../../utils/validations";
import CalendarWrapper from "../../../formsComponents/CalendarWrapper";
import InputTextWrapper from "../../../formsComponents/InputTextWrapper";
import PasswordWrapper from "../../../formsComponents/PasswordWrapper";
import SelectWrapper from "../../../formsComponents/SelectWrapper";
import useRegisterViewModelForm from "../../modelView/useRegisterViewModelForm";

const FormRegister = () => {
  const {
    control,
    onSubmit,
    handleSubmit,
    toast,
    t,
    getValues,
    userNameExist,
    emailExist,
    roles,
    cashiers,
  } = useRegisterViewModelForm();

  return (
    <Card className="c-register-card">
      <Messages ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} className="c-form-register">
        <h3 id="title">{t("Register User")}</h3>

        {/* Username */}
        <InputTextWrapper
          name="username"
          onBlur={userNameExist}
          keyFilter="alpha"
          control={control}
          rules={{
            required: t("username_is_required"),
            minLength: { value: 3, message: t("username_min_length") },
            maxLength: { value: 20, message: t("username_max_length") },
          }}
          label={t("userName")}
        />

        {/* First Name */}
        <InputTextWrapper
          name="first_name"
          control={control}
          keyFilter={RegexPatterns.namesAndLastNames()}
          rules={{
            required: t("first_name_is_required"),
            minLength: { value: 2, message: t("first_name_min_length") },
            maxLength: { value: 50, message: t("first_name_max_length") },
            pattern: {
              value: /^[A-Za-z ñÑ]+$/i,
              message: t("first_name_invalid_characters"),
            },
          }}
          onChangeCustom={(value) => Validations.capitalizeFirstLetter(value)}
          label={t("first_name")}
        />

        {/* Last Name */}
        <InputTextWrapper
          name="last_name"
          control={control}
          keyFilter={RegexPatterns.namesAndLastNames()}
          rules={{
            required: t("last_name_is_Required"),
            minLength: { value: 2, message: t("last_name_min_length") },
            maxLength: { value: 50, message: t("last_name_max_length") },
            pattern: {
              value: /^[A-Za-z ñÑ]+$/i,
              message: t("last_name_invalid_characters"),
            },
          }}
          onChangeCustom={(value) => Validations.capitalizeFirstLetter(value)}
          label={t("last_name")}
        />

        {/* Email */}
        <InputTextWrapper
          name="email"
          control={control}
          onBlur={emailExist}
          keyFilter="email"
          rules={{
            required: t("emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("emailInvalid"),
            },
          }}
          label={t("email")}
        />

        {/* Birth Date */}
        <CalendarWrapper
          name="birth_date"
          control={control}
          maxDate={new Date()}
          rules={{
            required: t("birth_date_is_required"),
            validate: (value) => {
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              return age >= 18 || t("must_be_18_or_older");
            },
          }}
          label={t("birth_date")}
        />

        <SelectWrapper
          name="cashiers_id"
          control={control}
          options={[
            { label: t("select_cashier number"), value: "" },
            ...(cashiers || []),
          ]}
          rules={{ required: t("box_is_required") }}
          label={t("cashier number")}
        />

        <SelectWrapper
          name="role_id"
          control={control}
          options={[{ label: t("select_role"), value: "" }, ...(roles || [])]}
          rules={{ required: t("role_is_required") }}
          label={t("role")}
        />
        {/* Password */}
        <PasswordWrapper
          name="password"
          addFooter
          addHeader
          control={control}
          rules={{
            required: t("password_is_required"),
            minLength: { value: 4, message: t("password_min_length") },
          }}
          label={t("password")}
        />

        {/* Password Confirmation */}
        <PasswordWrapper
          name="password_confirmation"
          control={control}
          rules={{
            required: t("password_is_required"),
            validate: (value) =>
              value === getValues("password") || t("passwords_do_not_match"),
          }}
          label={t("password_confirmation")}
        />

        <div className="c-section-register-actions">
          <Button label="Submit" type="submit" className="p-button-success" />
        </div>
      </form>
    </Card>
  );
};

export default FormRegister;
