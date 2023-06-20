// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useChain } from '../Chain/index.js';
import { useToast } from '../Toast/index.js';

interface ApiContextType {
  api: any | null;
  decimals: number;
  ss58Format: number;
  isConnecting: boolean;
}

const defaultContext = {
  api: null,
  decimals: 9,
  ss58Format: 42,
  isConnecting: false,
};

const ApiContext = createContext<ApiContextType>(defaultContext);

interface ApiProviderProps {
  children: ReactNode;
}

const ApiProvider = ({ children }: ApiProviderProps) => {
  const { toastError, toastInfo, toastSuccess } = useToast();
  const { activeChain, activeRpc } = useChain();

  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isConnecting, setConnecting] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const initPolkadotAPI = async () => {
      try {
        const provider = new WsProvider(activeRpc);

        setConnecting(true);

        const _api = await ApiPromise.create({
          provider,
          types: activeChain.definitions.types![0].types as Record<
            string,
            string
          >,
          rpc: activeChain?.definitions.rpc,
        });

        toastSuccess(`Successfully connected to ${activeChain.name}`);
        setConnecting(false);

        // Subscribe to disconnect events and cleanup the API instance.
        subscription = _api.on('disconnected', () => {
          toastInfo(`Disconnected from ${activeChain.name}`);
          _api.disconnect();
          setApi(null);
        });

        setApi(_api);
      } catch (error) {
        setApi(null); // Clear the API instance in case of error
        toastError(`Cannot connect to RPC endpoint: ${activeRpc}`);
      }
    };

    initPolkadotAPI();

    return () => {
      if (typeof subscription?.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      api?.disconnect();
    };
  }, [activeRpc]);

  return (
    <ApiContext.Provider
      value={{
        api,
        isConnecting,
        decimals: activeChain.decimals,
        ss58Format: activeChain.ss58Format,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => useContext(ApiContext);

export { ApiProvider, useApi };
