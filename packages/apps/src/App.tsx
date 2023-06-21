// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './App.css';

import type { ThemeDef } from '@polkadot/react-components/types';
import type { DecodedExtrinsic } from './components/Extrinsics/types.js';
import {
  ApiStatsCtxRoot,
  BlockAuthorsCtxRoot,
  BlockEventsCtxRoot,
  KeyringCtxRoot,
  QueueCtxRoot,
} from '@polkadot/react-hooks';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiCtxRoot } from '@polkadot/react-api';
import Signer from '@polkadot/react-signer';
import { settings } from '@polkadot/ui-settings';

import Decoder from './components/Extrinsics/Decoder.js';
import Submission from './components/Extrinsics/Submission.js';
import {
  Accounts,
  Dashboard,
  Header,
  LoadingWrapper,
  Sidebar,
  Status,
} from './components/index.js';
import {
  AccountsProvider,
  ChainProvider,
  ToastProvider,
  useChain,
} from './contexts/index.js';
import { darkTheme, lightTheme } from './themes.js';

function createTheme({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'dark' ? 'dark' : 'light';

  document &&
    document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'dark' ? darkTheme : lightTheme;
}

const App = () => {
  const [theme, setTheme] = useState(() => createTheme(settings));
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);

  useEffect((): void => {
    settings.on('change', (settings) => {
      setTheme(createTheme(settings));
    });
  }, []);

  const Main = () => {
    const { activeRpc } = useChain();

    return (
      <ApiCtxRoot apiUrl={activeRpc} isElectron={false}>
        <KeyringCtxRoot>
          <ApiStatsCtxRoot>
            <BlockAuthorsCtxRoot>
              <BlockEventsCtxRoot>
                <AccountsProvider>
                  <Signer>
                    <Router>
                      <div className='app-container'>
                        <Status />
                        <div className='header-container'>
                          <Header />
                        </div>
                        <div className='sidebar-container'>
                          <Sidebar />
                        </div>
                        <div className='main-content'>
                          <Routes>
                            <Route
                              element={<Navigate replace to='/dashboard' />}
                              index
                            />
                            <Route element={<Dashboard />} path='/dashboard' />
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
                          </Routes>
                        </div>
                      </div>
                    </Router>
                  </Signer>
                </AccountsProvider>
              </BlockEventsCtxRoot>
            </BlockAuthorsCtxRoot>
          </ApiStatsCtxRoot>
        </KeyringCtxRoot>
      </ApiCtxRoot>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <QueueCtxRoot>
        <ToastProvider>
          <ChainProvider>
            <Main />
          </ChainProvider>
        </ToastProvider>
      </QueueCtxRoot>
    </ThemeProvider>
  );
};

export default App;
