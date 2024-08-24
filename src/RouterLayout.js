import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/utils/Layout';
import Login from './components/utils/Login';
import { Contracts } from './components/contracts/Contracts';
import HomePage from './components/homepage/HomePage';
import Bills from './components/bills/Bills';
import { BillsUpload } from './components/bills/billsUpload/BillsUpload';
import ReviewContracts from './components/contracts/reviewContracts/ReviewContracts';

function RouterLayout() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/childadmin/admin/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/childadmin/admin/" element={<HomePage />} />
                  <Route path="/childadmin/admin/report-payments-by-date" element={<HomePage />} />
                  <Route path="/childadmin/admin/report-teachers" element={<HomePage />} />
                  <Route path="/childadmin/admin/report-students" element={<HomePage />} />
                  <Route path="/childadmin/admin/contracts" element={<Contracts />} />
                  <Route path="/childadmin/admin/review-contracts" element={<ReviewContracts />} />
                  <Route path="/childadmin/admin/bills" element={<Bills />} />
                  <Route path="/childadmin/admin/bills-upload" element={<BillsUpload />} />
                  <Route path="/childadmin/admin/active-users-report" element={<HomePage />} />
                  <Route path="/childadmin/admin/manage-guardians" element={<HomePage />} />
                  <Route path="/childadmin/admin/new-contract" element={<HomePage />} />
                  <Route path="/childadmin/admin/contract-reports" element={<HomePage />} />
                  <Route path="/childadmin/admin/manage-teachers" element={<HomePage />} />
                  <Route path="/childadmin/admin/register-payment-form" element={<HomePage />} />
                  <Route path="/childadmin/admin/register-payments-excel" element={<HomePage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default RouterLayout;
