import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AccountsContextProps {
  accounts: InjectedAccountWithMeta[];
}

interface AccountsProviderProps {
  children: ReactNode;
}

// Create the context with default values
const AccountsContext = createContext<AccountsContextProps>({
  accounts: [],
});

const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

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
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

const useAccounts = () => useContext(AccountsContext);

export { AccountsProvider, useAccounts };
