import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';

import { Header } from './components';
import { Accounts } from './components/Accounts';
import { Dashboard } from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { AccountsProvider } from './contexts/Accounts';
import { ApiProvider } from './contexts/Api';
import { ChainProvider } from './contexts/Chain';
import { ToastProvider } from './contexts/Toast';

const App = () => {
  return (
    <ToastProvider>
      <ChainProvider>
        <ApiProvider>
          <AccountsProvider>
            <Router>
              <div className='app-container'>
                <div className='header-container'>
                  <Header />
                </div>

                <div className='sidebar-container'>
                  <Sidebar />
                </div>

                <div className='main-content'>
                  <Routes>
                    <Route
                      index
                      element={
                        <Navigate replace to='/organisations/dashboard' />
                      }
                    />
                    <Route
                      path='/organisations/dashboard'
                      element={<Dashboard />}
                    />
                    <Route path='/wallet/accounts' element={<Accounts />} />

                    {/*<Route path='/settings' element={<Settings />} />
                    <Route path='/register' element={<RegistrationForm />} />
                    <Route
                      path='/authorize-payment'
                      element={<PaymentAuthorization />}
                    /> */}
                  </Routes>
                </div>
              </div>
              {/* <Modal
              isOpen={isMembershipDetailsOpen}
              onClose={handleCloseMembershipDetailsModal}
            >
              <MembershipDetails />
            </Modal>
            <Modal
              isOpen={isUserDetailsOpen}
              onClose={handleCloseUserDetailsModal}
            >
              <AuthSwitcher mode={mode} setMode={setMode} />
              <RegistrationForm onAccountSelected={handleAccountSelected} />
              <UserDetails
                account={selectedAccount}
                mode={mode}
                setMode={setMode}
              />
            </Modal> */}
            </Router>
          </AccountsProvider>
        </ApiProvider>
      </ChainProvider>
    </ToastProvider>
  );
};

export default App;
