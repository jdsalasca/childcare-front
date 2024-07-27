import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/utils/Layout';
import Login from './components/utils/Login';
import { Contracts } from './components/contracts/Contracts';
import HomePage from './components/homepage/HomePage';
import Bills from './components/contracts/bills/Bills';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/report-payments-by-date" element={<HomePage />} />
                  <Route path="/report-teachers" element={<HomePage />} />
                  <Route path="/report-students" element={<HomePage />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/active-users-report" element={<HomePage />} />
                  <Route path="/manage-guardians" element={<HomePage />} />
                  <Route path="/new-contract" element={<HomePage />} />
                  <Route path="/contract-reports" element={<HomePage />} />
                  <Route path="/manage-teachers" element={<HomePage />} />
                  <Route path="/register-payment-form" element={<HomePage />} />
                  <Route path="/register-payments-excel" element={<HomePage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
