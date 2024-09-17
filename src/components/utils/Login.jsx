// src/components/Login.js
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { customLogger } from '../../configs/logger';
import { useAuth } from '../../context/AuthContext';
import UsersAPI from '../../models/UsersAPI';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';
import InputTextWrapper from '../formsComponents/InputTextWrapper';
import PasswordWrapper from '../formsComponents/PasswordWrapper';
import Loader from './Loader';
import './Login.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit,setError } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const {t} = useTranslation();
  
  const { login } = useAuth();


  const handleLogin = async (data) => {
    customLogger.debug("data", data);
    setLoading(true);
    try {
      const token = await  UsersAPI.authUser(data);
      customLogger.debug("token", token);
      login(token);
      customNavigate('/');
    } catch (error) {
      customLogger.error("error on login",error);
      setError('Usuario o contraseña incorrectas', error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="login-form-container">
        <Card className="login-card">
          <form onSubmit={handleSubmit(handleLogin)}> 
          <h3 id='title'>Login</h3>
          <InputTextWrapper
            name={`username`}
            control={control}
            rules={{
              required: t("username_is_required"),
              minLength: { value: 3, message: t("username_min_length") },
              maxLength: { value: 20, message: t("username_max_length") },
            }}
            label={t("userNameOrEmail")}
          />
          <PasswordWrapper
            name={`password`}
            control={control}
            rules={{
              required: t("password_is_required"),
            }}
            label={t("password")}
          />
          
            <section className="c-section-login-actions">
            <Button type="submit" label={t('signIn')} className="p-button-success" />
            <Button type="submit" label={t('signUp')} severity="secondary" onClick={() => navigate('/auth/childadmin/admin/register')} />
              </section>
          </form>
        </Card>
      </div>
    </div>
  );
  
};

export default Login;
