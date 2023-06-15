import { web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { useState } from 'react';

export const useSignMessage = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messageToSign = 'Please sign this message to verify your identity';

  const signMessage = async (account: InjectedAccountWithMeta) => {
    if (!account) {
      setError('Please connect an account');
      return;
    }

    try {
      const { signer } = await web3FromSource(account.meta.source);
      if (!signer || !signer.signRaw) {
        setError('Signer not found');
        return;
      }

      const payload: SignerPayloadRaw = {
        address: account.address,
        data: messageToSign,
        type: 'bytes',
      };

      const signed = await signer.signRaw(payload);
      if (signed) {
        setSignature(signed.signature);
        return signed;
      } else {
        setError('Error signing message');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      setError('Error signing message');
    }
  };

  return { signature, error, signMessage, messageToSign };
};
