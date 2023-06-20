// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

interface ToastManager {
  toastSuccess: (_msg: string, _duration?: number) => void;
  toastError: (_msg: string, _duration?: number) => void;
  toastInfo: (_msg: string, _duration?: number) => void;
}

const defaultToastManager = {
  toastSuccess: () => {
    /* */
  },
  toastError: () => {
    /* */
  },
  toastInfo: () => {
    /* */
  },
};

const ToastContext = createContext<ToastManager>(defaultToastManager);

interface Props {
  children: React.ReactNode;
}

type ToastParam = {
  message: string;
  duration: number;
  type: 'success' | 'error' | 'warning' | 'info';
};

const ToastProvider = ({ children }: Props) => {
  const [toasts, setToasts] = useState<ToastParam[]>([]);

  const addToast = (toast: ToastParam) => {
    setToasts([...toasts, toast]);
  };

  const removeToast = (index: number) => {
    setToasts(toasts.filter((_v, i) => i !== index));
  };

  const toastSuccess = (message: string, duration = 3000) => {
    addToast({
      message,
      duration,
      type: 'success',
    });
  };

  const toastError = (message: string, duration = 3000) => {
    addToast({
      message,
      duration,
      type: 'error',
    });
  };

  const toastInfo = (message: string, duration = 3000) => {
    addToast({
      message,
      duration,
      type: 'info',
    });
  };

  return (
    <ToastContext.Provider value={{ toastSuccess, toastError, toastInfo }}>
      {children}
      {toasts.map(({ duration, type, message }, index) => (
        <Snackbar
          key={index}
          open
          autoHideDuration={duration}
          onClose={() => removeToast(index)}
        >
          <Alert
            onClose={() => removeToast(index)}
            severity={type}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };
