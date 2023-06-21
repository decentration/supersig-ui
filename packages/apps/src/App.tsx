// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './App.css';

import type { ThemeDef } from '@polkadot/react-components/types';
import type { DecodedExtrinsic } from './components/Extrinsics/types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiCtxRoot } from '@polkadot/react-api';

import Decoder from './components/Extrinsics/Decoder.js';
import Submission from './components/Extrinsics/Submission.js';
import { Accounts, Dashboard, Header, LoadingWrapper, Sidebar } from './components/index.js';
import { AccountsProvider, ChainProvider, ToastProvider, useChain } from './contexts/index.js';
import { darkTheme, lightTheme } from './themes.js';

function createTheme({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'dark' ? 'dark' : 'light';

  document &&
    document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'dark' ? darkTheme : lightTheme;
}

const App = () => {
  const [theme] = useState(() => createTheme({ uiTheme: 'light' }));

  const Main = () => {
    const { activeRpc } = useChain();
    const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);

    return (
      <ApiCtxRoot
        apiUrl={activeRpc}
        isElectron={false}
      >
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
                    element={
                      <Navigate
                        replace
                        to='/dashboard'
                      />
                    }
                    index
                  />
                  <Route
                    element={<Dashboard />}
                    path='/dashboard'
                  />
                  <Route
                    element={
                      <LoadingWrapper>
                        <Submission defaultValue={decoded} />
                      </LoadingWrapper>
                    }
                    path='/extrinsic'
                  />
                  <Route
                    element={
                      <LoadingWrapper>
                        <Submission defaultValue={decoded} />
                      </LoadingWrapper>
                    }
                    path='/extrinsic/:encoded'
                  />
                  <Route
                    element={
                      <LoadingWrapper>
                        <Decoder
                          defaultValue={decoded && decoded.hex}
                          setLast={setDecoded}
                        />
                      </LoadingWrapper>
                    }
                    path='/decode'
                  />
                  <Route
                    element={
                      <LoadingWrapper>
                        <Decoder
                          defaultValue={decoded && decoded.hex}
                          setLast={setDecoded}
                        />
                      </LoadingWrapper>
                    }
                    path='/decode/:encoded'
                  />
                  <Route
                    element={<Accounts />}
                    path='/wallet/accounts'
                  />
                  {/* <Route path='/settings' element={<Settings />} />
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
      </ApiCtxRoot>);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <ChainProvider>
          <Main />
        </ChainProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
