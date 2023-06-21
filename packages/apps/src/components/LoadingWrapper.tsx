// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Backdrop, CircularProgress } from '@mui/material';
import { useApi } from '@polkadot/react-hooks';
import React from 'react';

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export const LoadingWrapper = ({ children }: LoadingWrapperProps) => {
  const { isApiReady } = useApi();

  return isApiReady ? (
    children
  ) : (
    <Backdrop
      open
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};
