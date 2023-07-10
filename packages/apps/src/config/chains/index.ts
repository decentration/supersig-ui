// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from '../../types/index.js';

import { kabochaDefinitions, soupcanDefinitions, statemineDefinitions } from './specs/index.js';

export const chains: Chain[] = [
  {
    decimals: 42,
    definitions: soupcanDefinitions,
    name: 'Development',
    rpcEndpoints: [
      'ws://127.0.0.1:9944',
     
    ],
    ss58Format: 27
  },
  {
    decimals: 12,
    definitions: soupcanDefinitions,
    name: 'Soupcan',
    rpcEndpoints: [
      'wss://soupcan1.jelliedowl.com',
      'wss://soupcan2.jelliedowl.com'
    ],
    ss58Format: 27
  },
  {
    decimals: 12,
    definitions: kabochaDefinitions,
    name: 'Kabocha',
    rpcEndpoints: [
      'wss://kabocha.jelliedowl.com'
    ],
    ss58Format: 27
  },
  {
    decimals: 12,
    definitions: statemineDefinitions,
    name: 'Statemine',
    rpcEndpoints: [
      'wss://statemine.api.onfinality.io/public-ws',
      'wss://rpc-statemine.luckyfriday.io'
    ],
    ss58Format: 2
  }
  // Add more chains if needed
];

export const isSupportedRpc = (apiUrl: string): boolean => {
  return chains.reduce((result, chain) => result || chain.rpcEndpoints.includes(apiUrl), false);
};

export const defaultChain = chains[0];
