import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import 'primereact/resources/themes/saga-blue/theme.css';  // Choose the theme you prefer
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RouterLayout from './RouterLayout';

// Create a client for React Query
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <RouterLayout />
        </QueryClientProvider>
      </I18nextProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
