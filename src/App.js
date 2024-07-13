// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import './assets/styles/general.scss'
//import './App.scss';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
                  {/* Reports */}
        <Route path="/report-payments-by-date" element={<HomePage />} />
        <Route path="/report-teachers" element={<HomePage />} />
        <Route path="/report-students" element={<HomePage />} />

        {/* Users */}
        <Route path="/manage-users" element={<HomePage />} />
        <Route path="/active-users-report" element={<HomePage />} />
        <Route path="/manage-guardians" element={<HomePage />} />

        {/* Students */}
        <Route path="/manage-students" element={<HomePage />} />
        <Route path="/new-contract" element={<HomePage />} />
        <Route path="/contract-reports" element={<HomePage />} />

        {/* Teachers */}
        <Route path="/manage-teachers" element={<HomePage />} />

        {/* Payments */}
        <Route path="/register-payment-form" element={<HomePage />} />
        <Route path="/register-payments-excel" element={<HomePage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
