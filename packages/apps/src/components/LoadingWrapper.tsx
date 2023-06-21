// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

import { useApi } from '@polkadot/react-hooks';

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export const LoadingWrapper = ({ children }: LoadingWrapperProps) => {
  const { api, isApiReady } = useApi();

  return api && isApiReady
    ? (
      children
    )
    : (
      <Backdrop
        open
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    );
};
