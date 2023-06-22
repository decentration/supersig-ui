// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { generateSupersigAccounts } from '../../utils/index.js';
import { useAddressBook } from '../AddressBookContext/index.tsx';


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
  const { api, chainSS58, isApiReady } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const { contacts } = useAddressBook();


  useEffect(() => {
    if (!api || !isApiReady) {
      return;
    }

    const palletId = api.consts.supersig.palletId.toString();
    const accounts = generateSupersigAccounts(20, palletId, chainSS58);

    for (const account of accounts) {
      const { address, meta } = account;

      keyring.saveAddress(address, { ...meta }, 'address');
    }
  }, [api, isApiReady, chainSS58]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('Supersig UI');
        const allAccounts = await web3Accounts();

        // Add the addresses from the AddressBookContext to the accounts array
        const accountsWithContacts = allAccounts.concat(contacts.map((contact: { address: any; name: any; }) => ({
          address: contact.address,
          meta: { name: contact.name, source: 'AddressBook' },
          type: 'sr25519',
        })));

        setAccounts(accountsWithContacts);

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
