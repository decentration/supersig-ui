import { Radio } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';

import { chains } from '../../config/chains';
import { useChain } from '../../contexts/Chain';
import { Chain } from '../../types';

export const ChainSelector = () => {
  const {
    activeChain: selectedChain,
    setActiveChain: setSelectedChain,
    activeRpc: selectedRpc,
    setActiveRpc: setSelectedRpc,
  } = useChain();
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
        onClick={() => setOpen(!open)}
        className='network-button block w-full text-left text-black p-8'
      >
        {selectedChain.name || 'Select Network'}
      </button>
      {open && (
        <div className='chains absolute bg-white rounded shadow-md text-black'>
          {chains.map((chain, index) => (
            <details key={index} open={chain === selectedChain}>
              <summary className='font-semibold text-black text-sm'>
                {chain.name}
              </summary>
              <div>
                {chain.rpcEndpoints.map((rpcUrl, index) => (
                  <div
                    key={index}
                    className='chain-rpc flex items-center'
                    onClick={() => {
                      setRpc(rpcUrl);
                      setChain(chain);
                    }}
                  >
                    <Radio
                      key={index}
                      value={rpcUrl}
                      size='small'
                      checked={rpcUrl === rpc}
                    />

                    <label className='rpc-name text-black'>{rpcUrl}</label>
                  </div>
                ))}
              </div>
            </details>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              setSelectedRpc(rpc);
              setSelectedChain(chain);
            }}
            className='select-button block w-full text-left px-4 py-2 text-black hover:bg-gray-100'
          >
            Select {chain.name}
          </button>
        </div>
      )}
    </div>
  );
};
