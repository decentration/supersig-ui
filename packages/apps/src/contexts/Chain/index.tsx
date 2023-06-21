// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from '../../types/index.js';

import React, { createContext, type ReactNode, useContext, useState } from 'react';

import { defaultChain } from '../../config/chains/index.js';

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
  activeRpc: 'wss://soupcan1.jelliedowl.com',
  setActiveChain: () => {
    /** set selected chain */
  },
  setActiveRpc: () => {
    /** set selected rpc */
  }
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
        activeRpc,
        setActiveChain,
        setActiveRpc
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

const useChain = () => useContext(ChainContext);

export { ChainContext, ChainProvider, useChain };
