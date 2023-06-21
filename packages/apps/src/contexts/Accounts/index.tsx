// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';

interface AccountsContextProps {
  accounts: InjectedAccountWithMeta[];
}

interface AccountsProviderProps {
  children: ReactNode;
}

// Create the context with default values
const AccountsContext = createContext<AccountsContextProps>({
  accounts: []
});

const AccountsProvider = ({ children }: AccountsProviderProps) => {
  useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('Supersig UI');
        const allAccounts = await web3Accounts();

        setAccounts(allAccounts);
      } catch (_error) {
        // No accounts found
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => useContext(AccountsContext);

export { AccountsProvider, useAccounts };
