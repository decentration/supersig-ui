// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';

import { Header, Accounts, Dashboard, Sidebar } from './components/index.js';
import { ToastProvider, ChainProvider, ApiProvider, AccountsProvider } from './contexts/index.js';

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
