// Copyright 2017-2023 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { ApiPromise } from '@polkadot/api';

import React, { useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

const Settings = () => {
  const [processMessage, setProcessMessage] = useState('Click test button to begin');
  const { api, isApiReady } = useApi();
  const [status, setStatus] = useState({
    balanceSent: false,
    chainWorking: false,
    palletExists: false,
    proposalCreated: false,
    rpcMethodsExist: false,
    supersigCreated: false,
    supersigDeletionProposed: false,
    voteDeleteSubmitted: false,
    voteSubmitted: false
  });
  const [output, setOutput] = useState({
    balanceSent: '',
    chainWorking: '',
    palletExists: '',
    proposalCreated: '',
    rpcMethodsExist: '',
    supersigCreated: '',
    supersigDeletionProposed: '',
    voteDeleteSubmitted: '',
    voteSubmitted: ''
  });
  const [error, _setError] = useState({
    balanceSent: false,
    chainWorking: false,
    palletExists: false,
    proposalCreated: false,
    rpcMethodsExist: false,
    supersigCreated: false,
    supersigDeletionProposed: false,
    voteDeleteSubmitted: false,
    voteSubmitted: false
  });

  const handleClick = () => {
    if (!isApiReady) {
      return;
    }

    const checkChain = async (api: ApiPromise) => {
      try {
        setProcessMessage('Chain is is being checked');

        await api.rpc.system.chain();
        setStatus((prev) => ({ ...prev, chainWorking: true }));
        setOutput((prev) => ({ ...prev, chainWorking: 'Chain is working properly' }));

        return true;
      } catch (error) {
        const errorAsError = error as Error;

        setStatus((prev) => ({ ...prev, chainWorking: false }));
        setOutput((prev) => ({ ...prev, chainWorking: 'Error connecting to the chain: ' + errorAsError.message }));

        return false;
      }
    };

    const checkPallet = (api: ApiPromise) => {
      try {
        setProcessMessage('Checking for supersig pallet');

        const pallets = Object.keys(api.tx);

        if (pallets.includes('supersig')) {
          setStatus((prev) => ({ ...prev, palletExists: true }));
          setOutput((prev) => ({ ...prev, palletExists: 'Pallet supersig exists' }));

          return true;
        } else {
          throw new Error("Pallet 'supersig' does not exist");
        }
      } catch (error) {
        const errorAsError = error as Error;

        setStatus((prev) => ({ ...prev, palletExists: false }));
        setOutput((prev) => ({ ...prev, palletExists: 'Error checking pallet: ' + errorAsError.message }));

        return false;
      }
    };

    const checkRpcMethods = async (api: ApiPromise, chainWorking: boolean, palletExists: boolean) => {
      try {
        setProcessMessage('Checking for Rpc methods in the node');

        // check if the chain and pallet checks were successful before proceeding
        if (!chainWorking || !palletExists) {
          throw new Error('Previous checks failed. Cannot proceed to check RPC methods');
        }

        if ((api.rpc as any).superSig) {
          const metadata = await api.rpc.state.getMetadata();

          console.log(JSON.stringify(metadata.toHuman(), null, 2));
          console.log(Object.keys(api.rpc));
          setStatus((prev) => ({ ...prev, rpcMethodsExist: true }));
          setOutput((prev) => ({ ...prev, rpcMethodsExist: 'supersig rpc methods exist' }));
        } else {
          throw new Error("'superSig' RPC methods do not exist");
        }
      } catch (error) {
        const errorAsError = error as Error;

        setStatus((prev) => ({ ...prev, rpcMethodsExist: false }));
        setOutput((prev) => ({ ...prev, rpcMethodsExist: 'Error checking rpc methods: ' + errorAsError.message }));
        throw new Error('An error occurred while checking RPC methods: ' + errorAsError.message);
      }
    };

    const handler = async () => {
      try {
        const chainWorking = await checkChain(api);
        const palletExists = checkPallet(api);

        await checkRpcMethods(api, chainWorking, palletExists);
      } catch (error: any) {
        console.error('An error occurred:', error);
        setStatus((prev) => ({ ...prev, errorMessage: `An error occurred: ${error.message}` }));
        setOutput((prev) => ({ ...prev, errorMessage: `An error occurred: ${error.message}` }));
      }
    };

    handler();
  };

  return (
    <div>
      <h1>Supersig Workflow Tester</h1>
      <p>
      Quickly test endpoints to run a e2e workflow test which makes sure all the parts of the supersig user journey work as expected. Open the console to see the output of the tests.
      </p>
      {/* <label>
        Endpoint:
        <input type="text" style={{margin: "5px" ,padding:"5px", border: "sollid 1px gray", borderRadius: "4px", minWidth: "160px" }}value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </label> */}

      <button
        onClick={handleClick}
        style={{ backgroundColor: '#000', border: 'none', borderRadius: '4px', color: '#FFFFFF', cursor: 'pointer', margin: '5px', padding: '8px 15px 8px 15px' }}
      >
      Test Supersig
      </button>
      <h5> Current Status:</h5>
      <h3>{processMessage}</h3>
      {/* Display the status of each step */}
      {Object.entries(status).map(([key, value]) => (
        <div key={key}>
          {error[key as keyof typeof error]
            ? '🔴'
            : value ? '🟢' : '⚪️'} {key.charAt(0).toUpperCase() + key.slice(1)}
          <p style={{ fontStyle: 'italic' }}>{output[key as keyof typeof output]}</p>
        </div>
      ))}

    </div>
  );
};

export default Settings;
