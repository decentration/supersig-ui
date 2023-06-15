import { ApiPromise, WsProvider } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Accounts from './components/Accounts/Accounts';
import AuthSwitcher from './components/Auth/AuthSwitcher/AuthSwitcher';
import UserDetails from './components/Auth/UserDetails/UserDetails';
import { Chain } from './components/ChainSelector/ChainSelector';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header';
import MembershipDetails from './components/Memberships/MembershipDetails';
import Modal from './components/Memberships/Modal';
import PaymentAuthorization from './components/Memberships/PaymentAuthorization';
import RegistrationForm from './components/Memberships/RegistrationForm';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import { AccountsProvider } from './contexts/AccountsContext';
import { ApiPromiseContext } from './contexts/ApiPromiseContext';
import { ChainContext } from './contexts/ChainContext'; //

const App = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [isMembershipDetailsOpen, setIsMembershipDetailsOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedRpc, setSelectedRpc] = useState<string>(
    'wss://soupcan1.jelliedowl.com'
  );
  const [decimals, setDecimals] = useState<number | null>(null);

  const handleAccountSelected = (selectedAccount: InjectedAccountWithMeta) => {
    setSelectedAccount(selectedAccount);
    setIsUserDetailsOpen(true);
  };

  const handleMembershipDetails = (
    selectedAccount: InjectedAccountWithMeta
  ) => {
    setSelectedAccount(selectedAccount);
    setIsMembershipDetailsOpen(true);
  };

  const handleCloseMembershipDetailsModal = () => {
    setIsMembershipDetailsOpen(false);
  };

  const handleCloseUserDetailsModal = () => {
    setIsUserDetailsOpen(false);
  };

  useEffect(() => {
    let subscription: any = null;

    const initPolkadotAPI = async (selectedChain: any) => {
      if (!selectedRpc) {
        return;
      }

      const rpcUrl = selectedRpc;

      // Disconnect from the old endpoint before connecting to the new one
      // api?.disconnect();
      try {
        const provider = new WsProvider(rpcUrl);

        const newApi = await ApiPromise.create({
          provider,
          types: selectedChain?.definitions.types[0].types,
          rpc: selectedChain?.definitions.rpc,
        });
        console.log(selectedChain?.definitions.types[0].types);
        // If the above line did not throw an error, then the connection was successful
        const latestBlockNumber = await newApi.rpc.chain.getHeader();
        console.log(
          'Latest block number:',
          latestBlockNumber.number.toNumber()
        );

        const chainInfo = await newApi.registry.getChainProperties();
        console.log(chainInfo);

        const decimals = chainInfo.tokenDecimals[0]?.toNumber();
        setDecimals(decimals);

        setApi(newApi);

        // Subscribe to disconnect events and cleanup the API instance.
        subscription = newApi.on('disconnected', () => {
          console.log(`Disconnected from ${selectedRpc}`);
          newApi.disconnect();
          setApi(null);
        });
      } catch (error) {
        console.error('Failed to create Polkadot API:', error);
        setApi(null); // Clear the API instance in case of error
        setError(
          `Failed to connect to ${selectedRpc}. Please check the connection or choose another chain.`
        );
      }
    };

    initPolkadotAPI(selectedChain);

    return () => {
      if (typeof subscription?.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      api?.disconnect();
    };
  }, [selectedRpc, selectedChain]);

  return (
    <ChainContext.Provider
      value={{
        selectedChain,
        setSelectedChain,
        selectedRpc,
        setSelectedRpc,
      }}
    >
      <ApiPromiseContext.Provider
        value={{ api, decimals, setApi, setDecimals }}
      >
        <AccountsProvider>
          <Router>
            <div className='app-container'>
              <div className='header-container'>
                <Header
                  openUserDetails={setIsUserDetailsOpen}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  selectedRpc={selectedRpc}
                  setSelectedRpc={setSelectedRpc}
                  selectedChain={selectedChain}
                  setSelectedChain={setSelectedChain}
                />
              </div>
              <div className='sidebar-container'>
                <Sidebar />
              </div>
              <div className='main-content'>
                <Routes>
                  <Route
                    path='/organisations/dashboard'
                    element={<Dashboard api={api} />}
                  />
                  <Route path='/wallet/accounts' element={<Accounts />} />
                  <Route path='/settings' element={<Settings />} />
                  <Route
                    path='/register'
                    element={
                      <RegistrationForm
                        onAccountSelected={handleAccountSelected}
                      />
                    }
                  />
                  <Route
                    path='/authorize-payment'
                    element={<PaymentAuthorization account={account} />}
                  />
                </Routes>
              </div>
            </div>
            <Modal
              isOpen={isMembershipDetailsOpen}
              onClose={handleCloseMembershipDetailsModal}
            >
              <MembershipDetails account={selectedAccount} />
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
            </Modal>
          </Router>
        </AccountsProvider>
      </ApiPromiseContext.Provider>
    </ChainContext.Provider>
  );
};

export default App;

function setError(arg0: string) {
  throw new Error('Function not implemented.');
}
