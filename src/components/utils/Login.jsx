// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { login as performLogin } from '../../utils/auth';
import Loader from './Loader';
import './Login.scss';
import { useAuth } from '../../context/AuthContext';
//import {image} from '../public/login_image.jpg'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await performLogin(username, password);
      console.log("token", token);
      login(token);
      navigate('/');
    } catch (error) {
      setError('Usuario o contraseña incorrectas');
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
            <Button type="submit" label="Login" className="login-button" />
          </form>
        </Card>
      </div>
    </div>
  );
  
};

export default Login;
