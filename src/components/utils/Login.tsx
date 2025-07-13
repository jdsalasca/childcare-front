// src/components/Login.tsx
import { ApiResponse } from '@models/API';
import UsersAPI, { User } from '@models/UsersAPI';
import { customLogger } from 'configs/logger';
import { SecurityService } from 'configs/storageUtils';
import { errorHandler } from '../../utils/ErrorHandler';
import Lottie from 'lottie-react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import animationData from '../../assets/lottie/hellow_login.json';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';
import { accessibilityUtils } from '../../utils/AccessibilityUtils';
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

  const customNavigate = useCustomNavigate();
  const { t } = useTranslation();
  // const { login } = useAuth();

  // Define the handleLogin function
  const handleLogin: SubmitHandler<LoginFormData> = async data => {
    customLogger.debug('data', data);
    setLoading(true);
    try {
      const token = await UsersAPI.authUser(data);
      customLogger.debug('token', token);

      // Check if token response exists and has token property
      if (token.response && token.response.token) {
        SecurityService.getInstance().setEncryptedItem(
          'token',
          token.response.token
        );
        if (token.httpStatus === 200) {
          customNavigate('/homepage');
        } else {
          customLogger.error('error on login', token);
        }
      } else {
        customLogger.error('Invalid token response', token);
        setError('username', {
          type: 'manual',
          message: t('invalid_login_response'),
        });
      }
    } catch (error) {
      const errorInfo = errorHandler.handleAuthError(error);

      // Handle specific error types
      if (errorInfo.code === 'AUTH_ERROR' || errorInfo.status === 401) {
        setError('password', {
          type: 'manual',
          message: t('password_error'),
        });
      } else if (errorInfo.code === 'username') {
        setError('username', {
          type: 'manual',
          message: errorInfo.message || t('username_error'),
        });
      } else {
        // General error fallback
        setError('username', {
          type: 'manual',
          message: errorHandler.getUserFriendlyMessage(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container' role='main' aria-label='Login page'>
      {loading && <Loader />}
      <div className='login-form-container'>
        <Card className='login-card'>
          <Lottie
            animationData={animationData}
            className='c-lottie-animation login'
            aria-label='Login animation'
          />

          <form
            onSubmit={handleSubmit(handleLogin)}
            aria-label='Login form'
            role='form'
          >
            <h1 id='title'>{t('login')}</h1>
            <InputTextWrapper
              name='username'
              control={control}
              rules={{
                required: t('username_is_required'),
                minLength: { value: 3, message: t('username_min_length') },
                maxLength: { value: 20, message: t('username_max_length') },
              }}
              label={t('userNameOrEmail')}
              aria-describedby='username-error'
            />
            <PasswordWrapper
              name='password'
              control={control}
              rules={{
                required: t('password_is_required'),
              }}
              label={t('password')}
              aria-describedby='password-error'
            />
            <section className='c-section-login-actions'>
              <Button
                type='submit'
                label={t('signIn')}
                className='p-button-success'
                aria-label={t('signIn')}
                {...accessibilityUtils.createButtonAccessibilityProps(
                  t('signIn')
                )}
              />
            </section>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
