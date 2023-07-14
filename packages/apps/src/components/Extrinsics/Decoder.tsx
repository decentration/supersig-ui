// Copyright 2017-2023 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Input, InputExtrinsic, MarkError } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Call as CallDisplay } from '@polkadot/react-params';
import { assert, isHex } from '@polkadot/util';

import Decoded from './Decoded.js';

interface Props {
  className?: string;
  defaultValue?: HexString | null;
}

interface ExtrinsicInfo {
  decoded: SubmittableExtrinsic<'promise'> | null;
  extrinsicCall: Call | null;
  extrinsicError: string | null;
  extrinsicFn: SubmittableExtrinsicFunction<'promise'> | null;
  extrinsicHex: string | null;
  extrinsicKey: string;
  isCall: boolean;
}

const DEFAULT_INFO: ExtrinsicInfo = {
  decoded: null,
  extrinsicCall: null,
  extrinsicError: null,
  extrinsicFn: null,
  extrinsicHex: null,
  extrinsicKey: 'none',
  isCall: true
};

function Decoder ({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { encoded } = useParams<{ encoded: string }>();
  const [initialValue] = useState(() => defaultValue || encoded);
  const { api } = useApi();

  const [{ decoded, extrinsicCall, extrinsicError, extrinsicFn, extrinsicKey, isCall }, setExtrinsicInfo] = useState<ExtrinsicInfo>(DEFAULT_INFO);

  const _setExtrinsicHex = useCallback(
    (hex: string): void => {
      try {
        assert(isHex(hex), 'Expected a hex-encoded call');

        let extrinsicCall: Call;
        let decoded: SubmittableExtrinsic<'promise'> | null = null;
        let isCall = true;

        try {
          // cater for an extrinsic input...
          decoded = api.tx(hex);
          extrinsicCall = api.createType('Call', decoded.method);
          isCall = false;
        } catch (_e) {
          extrinsicCall = api.createType('Call', hex);
        }

        const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
        const extrinsicFn = api.tx[section][method];

        const extrinsicKey = extrinsicCall.callIndex.toString();

        if (!decoded) {
          decoded = extrinsicFn(...extrinsicCall.args);
        }

        setExtrinsicInfo({ ...DEFAULT_INFO, decoded, extrinsicCall, extrinsicFn, extrinsicHex: hex, extrinsicKey, isCall });
      } catch (e) {
        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicError: (e as Error).message });
      }
    },
    [api]
  );

  return (
    <div className={className}>
      <Input
        defaultValue={initialValue}
        isError={!extrinsicFn}
        label='hex-encoded call'
        onChange={_setExtrinsicHex}
        placeholder='0x...'
      />
      {extrinsicError && (
        <MarkError content={extrinsicError} />
      )}
      {extrinsicFn && extrinsicCall && (
        <>
          <InputExtrinsic
            defaultValue={extrinsicFn}
            isDisabled
            key={`extrinsicKey:${extrinsicKey}`}
            label='decoded call'
          />
          <CallDisplay
            className='details'
            value={extrinsicCall}
          />
        </>
      )}
      <Decoded
        extrinsic={decoded}
        isCall={isCall}
        withData={false}
      />
    </div>
  );
}

export default React.memo(Decoder);
