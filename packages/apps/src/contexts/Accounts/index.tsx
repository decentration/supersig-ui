// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { Contact } from '../AddressBookContext/index.js';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { generateSupersigAccounts } from '../../utils/index.js';
import { useAddressBook } from '../AddressBookContext/index.js';

interface AccountsContextProps {
  accounts: InjectedAccountWithMeta[];
}

interface AccountsProviderProps {
  children: React.ReactNode;
}

const AccountsContext = createContext<AccountsContextProps>({
  accounts: []
});



const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const { api, chainSS58, isApiReady } = useApi();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const { contacts } = useAddressBook();

  

  useEffect(() => {
    console.log('Running supersig accounts effect');

    if (!api || !isApiReady) {
      console.log('API is not ready yet');

      return;
    }

    const palletId = api.consts.supersig.palletId.toString();
    const accounts = generateSupersigAccounts(30, palletId, chainSS58);

    for (const account of accounts) {
      const { address, meta } = account;

      // ensure the genesisHash is a hexadecimal string prefixed by 0x.
      const adjustedMeta = { name: meta.name, source: meta.source }; 

      console.log(`Saving supersig account with address: ${address}`);
      keyring.saveAddress(address, adjustedMeta, 'address');
    }
  }, [api, isApiReady, chainSS58]);

  console.log('Contacts before useEffect: ', contacts);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('Supersig UI');
        const allAccounts = await web3Accounts();

        console.log('Fetched accounts: ', allAccounts);

        const contactsFromLocalStorage = JSON.parse(localStorage.getItem('contacts') || '[]');
        const allContacts = [...contacts, ...contactsFromLocalStorage];

        // Add the addresses from the AddressBookContext to the accounts array
        console.log('Contacts at mapping point: ', allContacts);
        const accountsWithContacts = allAccounts.concat(allContacts.map((contact: Contact) => ({
          address: contact.address,
          meta: { name: contact.name, source: 'AddressBook' },
          type: 'sr25519'
        })));

        console.log('this is', accountsWithContacts);

        setAccounts(accountsWithContacts);
      } catch (_error) {
        // No accounts found
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, [contacts]);

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => useContext(AccountsContext);

export { AccountsProvider, useAccounts };
