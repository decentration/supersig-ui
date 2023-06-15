import React, { createContext, useState } from 'react';

import { Chain } from '../components/ChainSelector/ChainSelector';

interface ChainContextProps {
  selectedChain: Chain | null;
  setSelectedChain: (_chain: Chain | null) => void;
  selectedRpc: string;
  setSelectedRpc: (_rpc: string) => void;
}

export const ChainContext = createContext<ChainContextProps>({
  selectedChain: null,
  setSelectedChain: () => {
    /** set selected chain */
  },
  selectedRpc: '',
  setSelectedRpc: () => {
    /** set selected rpc */
  },
});

interface ChainProviderProps {
  children: React.ReactNode;
}

export const ChainProvider = ({ children }: ChainProviderProps) => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedRpc, setSelectedRpc] = useState<string>(
    'wss://soupcan1.jelliedowl.com'
  );

  return (
    <ChainContext.Provider
      value={{ selectedChain, setSelectedChain, selectedRpc, setSelectedRpc }}
    >
      {children}
    </ChainContext.Provider>
  );
};
