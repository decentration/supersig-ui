// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

interface ToastManager {
  toastSuccess: (_msg: string, _duration?: number) => void;
  toastError: (_msg: string, _duration?: number) => void;
  toastInfo: (_msg: string, _duration?: number) => void;
}

const defaultToastManager = {
  toastError: () => {
    /* */
  },
  toastInfo: () => {
    /* */
  },
  toastSuccess: () => {
    /* */
  }
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
      duration,
      message,
      type: 'success'
    });
  };

  const toastError = (message: string, duration = 3000) => {
    addToast({
      duration,
      message,
      type: 'error'
    });
  };

  const toastInfo = (message: string, duration = 3000) => {
    addToast({
      duration,
      message,
      type: 'info'
    });
  };

  return (
    <ToastContext.Provider value={{ toastError, toastInfo, toastSuccess }}>
      {children}
      {toasts.map(({ duration, message, type }, index) => (
        <Snackbar
          autoHideDuration={duration}
          key={index}
          onClose={() => removeToast(index)}
          open
        >
          <Alert
            onClose={() => removeToast(index)}
            severity={type}
            sx={{ width: '100%' }}
            variant='filled'
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
