// src/components/Login.js
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { customLogger } from '../../configs/logger';
import { useAuth } from '../../context/AuthContext';
import { login as performLogin } from '../../utils/auth';
import Loader from './Loader';
import './Login.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();
  
  const { login } = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await performLogin(username, password);
      customLogger.debug("token", token);
      login(token);
      navigate('/');
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
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
            <div className="p-field field-username">
              <label htmlFor="username">Email</label>
              <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-input username-field" />
            </div>
            <div className="p-field field-password">
              <label htmlFor="password">Contraseña</label>
              <Password id="password" value={password}
              
               onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask className="rounded-input password-field" />
            </div>
            {error && <div className="error">{error}</div>}
            <section className="c-section-login-actions">
            <Button type="submit" label="Login" className="login-button" />
            <Button type="submit" label={t('signUp')} className="login-button" onClick={() => navigate('/childadmin/admin/register')} />
              </section>
          </form>
        </Card>
      </div>
    </div>
  );
  
};

export default Login;
