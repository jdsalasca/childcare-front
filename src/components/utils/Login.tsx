// src/components/Login.tsx
import { ApiResponse } from '@models/API';
import UsersAPI, { User } from '@models/UsersAPI';
import { customLogger } from 'configs/logger';
import { SecurityService } from 'configs/storageUtils';
import Lottie from 'lottie-react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import animationData from '../../assets/lottie/hellow_login.json';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';
import InputTextWrapper from '../formsComponents/InputTextWrapper';
import PasswordWrapper from '../formsComponents/PasswordWrapper';
import Loader from './Loader';

// Define the form data type
interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit, setError } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { t } = useTranslation();
  // const { login } = useAuth();

  // Define the handleLogin function
  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    customLogger.debug("data", data);
    setLoading(true);
    try {
      const token = await UsersAPI.authUser(data);
      customLogger.debug("token", token);
      SecurityService.getInstance().setEncryptedItem("token", token.response.token!);
      if(token.httpStatus === 200){
        customNavigate('/homepage');
      }else{
        customLogger.error("error on login", token);
      }
      customLogger.debug("data", data);
      
      // login(token);
      customNavigate('/homepage');
    } catch (error) {
      const errorcasted = error as ApiResponse<User>;
      customLogger.error("error on login", error);
      if(errorcasted.response.errorType === "username"){
        setError("username", { type: 'manual', message: errorcasted.response.error });
      }else{
        setError("password", { type: 'manual', message: errorcasted.response.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="login-form-container">
        <Card className="login-card">
        <Lottie animationData={animationData} className='c-lottie-animation login' />

          <form onSubmit={handleSubmit(handleLogin)}>
            <h3 id='title'>{t("login")}</h3>
            <InputTextWrapper
              name="username"
              control={control}
              rules={{
                required: t("username_is_required"),
                minLength: { value: 3, message: t("username_min_length") },
                maxLength: { value: 20, message: t("username_max_length") },
              }}
              label={t("userNameOrEmail")}
            />
            <PasswordWrapper
              name="password"
              control={control}
              rules={{
                required: t("password_is_required"),
              }}
              label={t("password")}
            />
            <section className="c-section-login-actions">
              <Button type="submit" label={t('signIn')} className="p-button-success" />
              
            </section>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
