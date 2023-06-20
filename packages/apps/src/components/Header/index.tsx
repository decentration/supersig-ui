// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ChainSelector } from '../ChainSelector/index.js';

export const Header = () => {
  return (
    <header className='header subby-style'>
      <div className='relative inline-block text-left'>
        <div className='chain-selector-container'>
          <ChainSelector />
        </div>
      </div>
      <div className='logo subverse-style'>Subverse</div>
      <div className='accounts-area'>
        {/* <button
          className='accounts-button subverse-style'
          onClick={handleOpenUserDetails}
        >
          <FontAwesomeIcon icon={faWallet} style={{ marginRight: '10px' }} />{' '}
          Memberships
        </button> */}
      </div>
    </header>
  );
};
