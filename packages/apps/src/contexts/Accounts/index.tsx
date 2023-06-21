// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

interface AccountsContextProps {
  accounts: InjectedAccountWithMeta[];
  extrinsicCall: any,
  setExtrinsic: Dispatch<SetStateAction<any>>
}

interface AccountsProviderProps {
  children: ReactNode;
}

// Create the context with default values
const AccountsContext = createContext<AccountsContextProps>({
  accounts: [],
  extrinsicCall: null,
  setExtrinsic: () => { }
});

const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [extrinsicCall, setExtrinsic] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('Supersig UI');
        const allAccounts = await web3Accounts();

        setAccounts(allAccounts);
      } catch (error) {
        // No accounts found
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider value={{ accounts, extrinsicCall, setExtrinsic }}>
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => useContext(AccountsContext);

export { AccountsProvider, useAccounts };
