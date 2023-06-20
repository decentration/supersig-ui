// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  kabochaDefinitions,
  soupcanDefinitions,
  statemineDefinitions,
} from './specs/index.js';
import type { Chain } from '../../types/index.js';


export const chains: Chain[] = [
  {
    name: 'Soupcan',
    ss58Format: 27,
    decimals: 12,
    rpcEndpoints: [
      'wss://soupcan1.jelliedowl.com',
      'wss://soupcan2.jelliedowl.com',
    ],
    definitions: soupcanDefinitions,
  },
  {
    name: 'Kabocha',
    ss58Format: 27,
    decimals: 12,
    rpcEndpoints: [
      'wss://kabocha1.jelliedowl.com',
      'wss://kabocha.jelliedowl.com',
    ],
    definitions: kabochaDefinitions,
  },
  {
    name: 'Statemine',
    ss58Format: 2,
    decimals: 12,
    rpcEndpoints: [
      'wss://statemine.api.onfinality.io/public-ws',
      'wss://rpc-statemine.luckyfriday.io',
    ],
    definitions: statemineDefinitions,
  },
  // Add more chains if needed
];

export const defaultChain = chains[0];
