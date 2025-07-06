import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Bills } from './components/bills/Bills'
import { MigrateBills } from './components/bills/components/migrateBills/migrateBills'
import { Contracts } from './components/contracts/Contracts'
import HomePage from './components/homepage/HomePage'
import FormRegister from './components/users/register/register/FormRegister'
import Layout from './components/utils/Layout'
import Login from './components/utils/Login'
import SessionExpired from './components/utils/SessionExpired'
import { UnderConstruction } from './components/utils/UnderConstruction'
import DepositsMenu from './components/deposits/DepositsMenu'
import CashRegister from './components/deposits/cashRegister/CashRegister'
function RouterLayout() {
  return (
    <Router >
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="auth/*" element={<Layout insideAuthApplication={false} />}>
            <Route path="childadmin/admin/login" element={<Login />} />
            <Route path="childadmin/admin/register" element={<FormRegister />} />
          </Route>
          <Route path="info/*" element={<Layout insideAuthApplication={false} />}>
          </Route>
          <Route path="*"  element={<Layout insideAuthApplication={false} />}>
            <Route path="childadmin/admin/session-expired/" element={<SessionExpired />} />
          <Route path="childadmin/admin/" element={<Login />} />

          </Route>
          {/* Main Application Routes */}
          <Route path="*" element={<Layout insideAuthApplication={true} />}>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="childadmin/admin/homepage" element={<HomePage />} />
            
            <Route path="childadmin/admin/report-payments-by-date" element={<HomePage />} />
            <Route path="childadmin/admin/report-teachers" element={<HomePage />} />
            <Route path="childadmin/admin/report-students" element={<HomePage />} />
            <Route path="childadmin/admin/contracts" element={<Contracts />} />
            <Route path="childadmin/admin/review-contracts" element={<UnderConstruction />} />
            <Route path="childadmin/admin/bills"  element={<Bills />} />
            <Route path="childadmin/admin/migrate/bills" element={<MigrateBills />}  />
            <Route path="childadmin/admin/active-users-report" element={<HomePage />} />
            <Route path="childadmin/admin/manage-guardians" element={<HomePage />} />
            <Route path="childadmin/admin/new-contract" element={<HomePage />} />
            <Route path="childadmin/admin/contract-reports" element={<HomePage />} />
            <Route path="childadmin/admin/manage-teachers" element={<HomePage />} />
            <Route path="childadmin/admin/register-payment-form" element={<HomePage />} />
            <Route path="childadmin/admin/register-payments-excel" element={<HomePage />} />
            <Route path="childadmin/admin/users"  element={<FormRegister />} />
            {/* Deposits Section */}
            <Route path="childadmin/admin/deposits" element={<DepositsMenu />}>
              <Route path="cash-register" element={<CashRegister />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default RouterLayout;
