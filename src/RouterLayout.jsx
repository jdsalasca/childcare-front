import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bills } from './components/bills/Bills';
import { MigrateBills } from './components/bills/components/migrateBills/MigrateBills';
import { Contracts } from './components/contracts/Contracts';
import HomePage from './components/homepage/HomePage';
import FormRegister from './components/users/register/register/FormRegister';
import Layout from './components/utils/Layout';
import Login from './components/utils/Login';
import SessionExpired from './components/utils/SessionExpired';
import { UnderConstruction } from './components/utils/UnderConstruction';
import DepositsMenu from './components/deposits/DepositsMenu';
import CashRegister from './components/deposits/cashRegister/CashRegister';
import ErrorBoundary from './components/utils/ErrorBoundary';
function RouterLayout() {
  return (
    <ErrorBoundary>
      <Router basename='/childadmin/admin'>
        <div className='App'>
          <Routes>
            {/* Authentication Routes */}
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<FormRegister />} />
            <Route path='/session-expired' element={<SessionExpired />} />

            {/* Main Application Routes */}
            <Route path='/*' element={<Layout insideAuthApplication={true} />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path='homepage' element={<HomePage />} />
              <Route path='report-payments-by-date' element={<HomePage />} />
              <Route path='report-teachers' element={<HomePage />} />
              <Route path='report-students' element={<HomePage />} />
              <Route path='contracts' element={<Contracts />} />
              <Route path='review-contracts' element={<UnderConstruction />} />
              <Route
                path='bills'
                element={
                  <ErrorBoundary>
                    <Bills />
                  </ErrorBoundary>
                }
              />
              <Route path='migrate/bills' element={<MigrateBills />} />
              <Route path='active-users-report' element={<HomePage />} />
              <Route path='manage-guardians' element={<HomePage />} />
              <Route path='new-contract' element={<HomePage />} />
              <Route path='contract-reports' element={<HomePage />} />
              <Route path='manage-teachers' element={<HomePage />} />
              <Route path='register-payment-form' element={<HomePage />} />
              <Route path='register-payments-excel' element={<HomePage />} />
              <Route path='users' element={<FormRegister />} />
              {/* Deposits Section */}
              <Route path='deposits' element={<DepositsMenu />}>
                <Route path='cash-register' element={<CashRegister />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default RouterLayout;
