import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React from 'react';

interface AuthFormProps {
  account: InjectedAccountWithMeta | null;
  mode: 'login' | 'signup';
  onConfirm: (account: InjectedAccountWithMeta | null) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ account, mode, onConfirm }) => {
  const handleButtonClick = () => {
    onConfirm(account);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {mode === 'signup' ? 'Signup' : 'Login'}
      </button>
    </div>
  );
};

export default AuthForm;
