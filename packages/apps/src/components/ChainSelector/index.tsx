// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './index.css';

import type { Chain } from '../../types/index.js';

import { Radio } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { settings } from '@polkadot/ui-settings';

import { chains } from '../../config/chains/index.js';
import { useChain } from '../../contexts/index.js';

export const ChainSelector = () => {
  const { activeChain: selectedChain,
    activeRpc: selectedRpc,
    setActiveChain: setSelectedChain,
    setActiveRpc: setSelectedRpc } = useChain();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [rpc, setRpc] = useState<string>(selectedRpc); // temporary RPC URL
  const [chain, setChain] = useState<Chain>(selectedChain);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={menuRef}>
      <button
        className='network-button block w-full text-left text-black p-8'
        onClick={() => setOpen(!open)}
      >
        {selectedChain.name || 'Select Network'}
      </button>
      {open && (
        <div className='chains absolute bg-white rounded shadow-md text-black'>
          {chains.map((chain: Chain, index: number) => (
            <details
              key={index}
              open={chain === selectedChain}
            >
              <summary className='font-semibold text-black text-sm'>
                {chain.name}
              </summary>
              <div>
                {chain.rpcEndpoints.map((rpcUrl, index) => (
                  <div
                    className='chain-rpc flex items-center'
                    key={index}
                    onClick={() => {
                      setRpc(rpcUrl);
                      setChain(chain);
                    }}
                  >
                    <Radio
                      checked={rpcUrl === rpc}
                      key={index}
                      size='small'
                      value={rpcUrl}
                    />
                    <label className='rpc-name text-black'>{rpcUrl}</label>
                  </div>
                ))}
              </div>
            </details>
          ))}
          <button
            className='select-button block w-full text-left px-4 py-2 text-black hover:bg-gray-100'
            onClick={() => {
              setOpen(false);
              setSelectedRpc(rpc);
              setSelectedChain(chain);
              settings.set({ ...(settings.get()), apiUrl: rpc });
              window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(rpc)}${window.location.hash}`);
            }}
          >
            Select {chain.name}
          </button>
        </div>
      )}
    </div>
  );
};
