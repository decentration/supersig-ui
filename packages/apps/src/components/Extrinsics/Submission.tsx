// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { Call } from '@polkadot/types/interfaces';
import type { DecodedExtrinsic } from './types.js';

import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
import { BalanceFree } from '@polkadot/react-query';
import { assert, isHex } from '@polkadot/util';

import Decoded from './Decoded.js';

interface Props {
  className?: string;
  defaultValue?: DecodedExtrinsic | null;
  setLast?: (value: DecodedExtrinsic | null) => void;
}
interface DefaultExtrinsic {
  defaultArgs?: RawParam[];
  defaultFn: SubmittableExtrinsicFunction<'promise'>;
}

function extractDefaults (value: DecodedExtrinsic | null, defaultFn: SubmittableExtrinsicFunction<'promise'>): DefaultExtrinsic {
  if (!value) {
    return { defaultFn };
  }

  return {
    defaultArgs: value.call.args.map((value) => ({
      isValid: true,
      value
    })),
    defaultFn: value.fn
  };
}

function getDecodedExtr (api: ApiPromise, encodedVal: string, defaultValue: DecodedExtrinsic | null | undefined): DecodedExtrinsic | null {
  try {
    if (encodedVal === undefined && defaultValue) {
      return defaultValue;
    }

    let extrinsicCall: Call;
    const hex = encodedVal;
    let decoded: SubmittableExtrinsic<'promise'> | null = null;

    assert(isHex(hex), 'Expected a hex-encoded call');

    try {
      decoded = api.tx(hex);
      extrinsicCall = api.createType('Call', decoded.method);
    } catch (_e) {
      extrinsicCall = api.createType('Call', hex);
    }

    const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
    const extrinsicFn = api.tx[section][method];

    return { call: extrinsicCall, fn: extrinsicFn, hex };
  } catch (_e) {
    return null;
  }
}

function Selection ({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { encoded } = useParams<{ encoded: string }>();

  const [initialValue] = useState<DecodedExtrinsic | null>(() => getDecodedExtr(api, encoded === undefined ? '' : encoded, defaultValue));
  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];

  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudoSupersig = (api.tx.supersig && api.tx.supersig.submitCall) || apiDefaultTx;

  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(api.tx[defaultSection].approveCall);
  const [defaultExtr] = useState<DefaultExtrinsic>(() => extractDefaults(initialValue, apiDefaultTxSudoSupersig));

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) =>
      setExtrinsic(() => {
        return method || null;
      }),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) =>
      setError(error ? error.message : null),
    []
  );

  return (
    <div className={className}>
      <InputAddress
        label='using the selected account'
        labelExtra={
          <BalanceFree
            label={<label>free balance</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <Extrinsic
        defaultArgs={defaultExtr.defaultArgs}
        defaultValue={defaultExtr.defaultFn}
        label='submit the following extrinsic'
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      <Decoded
        extrinsic={extrinsic}
        isCall
      />
      {error && !extrinsic && (
        <MarkError content={error} />
      )}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isUnsigned
          label='Submit Unsigned'
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          label='Submit Transaction'
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Selection);
