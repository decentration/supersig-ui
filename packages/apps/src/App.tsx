// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './App.css';

import { ApiCtxRoot } from '@polkadot/react-api';
import {
  Header,
  Accounts,
  Dashboard,
  Sidebar,
  LoadingWrapper,
} from './components/index.js';
import {
  ToastProvider,
  ChainProvider,
  ApiProvider,
  AccountsProvider,
  useChain,
} from './contexts/index.js';
import Submission from './components/Extrinsics/Submission.js';
import { DecodedExtrinsic } from './components/Extrinsics/types.js';
import Decoder from './components/Extrinsics/Decoder.js';
import { darkTheme, lightTheme } from './themes.js';
import { ThemeDef } from '@polkadot/react-components/types';

function createTheme({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'dark' ? 'dark' : 'light';

  document &&
    document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'dark' ? darkTheme : lightTheme;
}

const App = () => {
  const [theme] = useState(() => createTheme({ uiTheme: 'light' }));
  const { activeRpc } = useChain();
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <ChainProvider>
          <ApiCtxRoot apiUrl={activeRpc} isElectron={false}>
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
                        <Route
                          path='/extrinsic'
                          element={
                            <LoadingWrapper>
                              <Submission defaultValue={decoded} />
                            </LoadingWrapper>
                          }
                        />
                        <Route
                          path='/extrinsic/:encoded'
                          element={
                            <LoadingWrapper>
                              <Submission defaultValue={decoded} />
                            </LoadingWrapper>
                          }
                        />
                        <Route
                          path='/decode'
                          element={
                            <Decoder
                              defaultValue={decoded && decoded.hex}
                              setLast={setDecoded}
                            />
                          }
                        />
                        <Route
                          path='/decode/:decoded'
                          element={
                            <Decoder
                              defaultValue={decoded && decoded.hex}
                              setLast={setDecoded}
                            />
                          }
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
          </ApiCtxRoot>
        </ChainProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
