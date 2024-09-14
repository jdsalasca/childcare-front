import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Bills from './components/bills/Bills'
import { Contracts } from './components/contracts/Contracts'
import HomePage from './components/homepage/HomePage'
import FormRegister from './components/users/register/register/FormRegister'
import Layout from './components/utils/Layout'
import Login from './components/utils/Login'

function RouterLayout () {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='auth'
            element={
              <Layout insideAuthApplication={false}>
                <Route path='/childadmin/admin/login' element={<Login />} />

              </Layout>
            }
          />
          <Route
            path='*'
            element={
              <Layout insideAuthApplication={false}>
                <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/childadmin/admin/' element={<HomePage />} />
                  <Route
                  path='/childadmin/admin/register'
                  element={<FormRegister />}
                />

                  <Route
                    path='/childadmin/admin/report-payments-by-date'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/report-teachers'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/report-students'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/contracts'
                    element={<Contracts />}
                  />
                  <Route
                    path='/childadmin/admin/review-contracts'
                    element={<FormRegister />}
                  />
                  <Route path='/childadmin/admin/bills' element={<Bills />} />
                  {/* <Route path="/childadmin/admin/bills-upload" element={<BillsUpload />} /> */}
                  <Route
                    path='/childadmin/admin/active-users-report'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/manage-guardians'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/new-contract'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/contract-reports'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/manage-teachers'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/register-payment-form'
                    element={<HomePage />}
                  />
                  <Route
                    path='/childadmin/admin/register-payments-excel'
                    element={<HomePage />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default RouterLayout
