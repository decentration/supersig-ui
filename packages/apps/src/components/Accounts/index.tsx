// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */

import type { Balance } from '../../types/index.js';

import { Backdrop, Box, Checkbox, CircularProgress, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { useAccounts } from '../../contexts/index.js';
import { formatBalance, getFreeBalance } from '../../utils/index.js';

export const Accounts = () => {
  const { api, chainSS58, isApiReady, tokenDecimals: decimals } = useApi();
  const { accounts } = useAccounts();
  const [balances, setBalances] = useState<Array<Balance>>([]);
  const [emptyShow, showEmpty] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!api) {
        return;
      }

      setLoading(true);
      const _balances: Array<Balance> = [];

      for await (const { address } of accounts) {
        _balances.push(await getFreeBalance(api, address));
      }

      setBalances(_balances);
      setLoading(false);
    };

    fetchBalances();
  }, [api, accounts]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant='h5'>Accounts</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={emptyShow}
              onChange={(e) => showEmpty(e.target.checked)}
            />
          }
          label='Show empty balances'
        />
        <Table
          aria-label='simple table'
          sx={{ minWidth: 650 }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balances.map(
              (balance, index) =>
                (emptyShow || !balance.eq(BN_ZERO)) && (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component='th'
                      scope='row'
                    >
                      <Typography variant='h6'>
                        {accounts[index].meta.name}
                      </Typography>
                      <Typography variant='h6'>
                        {encodeAddress(accounts[index].address, chainSS58)}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatBalance(balance, decimals)}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </Box>
      <Backdrop
        open={!isApiReady || loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
};
