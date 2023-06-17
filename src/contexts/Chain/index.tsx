import React, { createContext, ReactNode, useContext, useState } from 'react';

import { defaultChain } from '../../config/chains';
import { Chain } from '../../types';

interface ChainContextProps {
  activeChain: Chain;
  setActiveChain: (_chain: Chain) => void;
  activeRpc: string;
  setActiveRpc: (_rpc: string) => void;
}

interface ChainProviderProps {
  children: ReactNode;
}

const ChainContext = createContext<ChainContextProps>({
  activeChain: defaultChain,
  setActiveChain: () => {
    /** set selected chain */
  },
  activeRpc: '',
  setActiveRpc: () => {
    /** set selected rpc */
  },
});

const ChainProvider = ({ children }: ChainProviderProps) => {
  const [activeChain, setActiveChain] = useState<Chain>(defaultChain);
  const [activeRpc, setActiveRpc] = useState<string>(
    defaultChain.rpcEndpoints[0]
  );

  return (
    <ChainContext.Provider
      value={{
        activeChain,
        setActiveChain,
        activeRpc,
        setActiveRpc,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

const useChain = () => useContext(ChainContext);

export { ChainContext, ChainProvider, useChain };
