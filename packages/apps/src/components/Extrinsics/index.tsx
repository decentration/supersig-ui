// Copyright 2017-2023 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props, TabItem } from '@polkadot/react-components/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Decoder from './Decoder.js';
import Submission from './Submission.js';

function createItemsRef (): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'create',
      text: 'Submission'
    },
    {
      hasParams: true,
      name: 'decode',
      text: 'Decode'
    }
  ];
}

function ExtrinsicsApp ({ basePath }: Props): React.ReactElement<Props> {
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);
  const itemsRef = useRef(createItemsRef());

  return (
    <main className='extrinsics--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Decoder
                defaultValue={decoded && decoded.hex}
                setLast={setDecoded}
              />
            }
            path='decode/:encoded?'
          />
          <Route
            element={
              <Submission defaultValue={decoded} />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export { ExtrinsicsApp };

export default React.memo(ExtrinsicsApp);
