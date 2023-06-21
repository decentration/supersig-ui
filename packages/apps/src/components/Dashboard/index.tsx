// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Account, Balance, MemberInfo, MemberRole, ProposalsInfo, SupersigInfo } from '../../types/index.js';

import { Backdrop, Box, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { formatBalance, generateSupersigAccounts, getFreeBalance, getReservedBalance } from '../../utils/index.js';
import { BalanceDetail } from './BalanceDetail.js';
import { ProposalDetail } from './ProposalDetail.js';
import { Summary } from './Summary.js';

const sxs = {
  button: {
    border: '1px solid rgb(221, 221, 221)',
    borderRadius: 8,
    color: 'rgb(24, 24, 24)'
  },
  buttonGroup: {
    display: 'flex',
    gap: 2
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: 4
  }
};

export const Dashboard = () => {
  const { api, chainSS58, isApiReady, tokenDecimals: decimals } = useApi();
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);
  const [supersigAccounts, setSupersigAccounts] = useState<string[]>([]);
  const [supersigs, setSupersigs] = useState<Array<SupersigInfo>>([]);

  const liveProposalsCount: number = supersigs.reduce(
    (sum, supersig) => sum + supersig.proposals.proposals_info.length,
    0
  );

  const totalFunds: Balance = supersigs.reduce(
    (sum: Balance, supersig: SupersigInfo) => sum.add(supersig.balance),
    BN_ZERO
  );

  useEffect(() => {
    if (!api || !isApiReady) {
      return;
    }

    const loadNonce = async () => {
      await api.query.supersig.nonceSupersig((_nonce: any) =>
        setNonce(Number(_nonce.toPrimitive()))
      );
    };

    loadNonce();
  }, [api, isApiReady]);

  useEffect(() => {
    const fetchSupersigInfo = async (account: Account): Promise<SupersigInfo> => {
      const freeBalance = await getFreeBalance(api, account);
      const reservedBalance = await getReservedBalance(api, account);
      const balance = freeBalance.add(reservedBalance);

      const memberAccounts: Array<Account> = (
        await (api.rpc as any).superSig.listMembers(account)
      ).toPrimitive();

      const members: Array<MemberInfo> = await Promise.all(
        memberAccounts.map(async (member) => {
        // here you get the list of members of a supersig
          const account = member[0];
          const role = Object.keys(member[1])[0] as MemberRole;
          const free = await getFreeBalance(api, account);
          const reserved = await getReservedBalance(api, account);

          return {
            account,
            balance: free.add(reserved),
            role
          };
        })
      );

      const proposals: ProposalsInfo = (
        await (api.rpc as any).superSig.listProposals(account)
      ).toPrimitive();

      return {
        account,
        balance,
        freeBalance,
        members,
        proposals,
        reservedBalance
      };
    };

    const init = async () => {
      setLoading(true);

      const infos: Array<SupersigInfo> = [];

      for await (const account of supersigAccounts) {
        const info = await fetchSupersigInfo(account);

        infos.push(info);
      }

      setSupersigs(infos);

      setLoading(false);
    };

    init();
  }, [api, supersigAccounts]);

useEffect(() => {
    if (!api || !isApiReady) {
      return;
    }

    const getSuperSigAddress = async () => {
      const addressArray: string[] = [];
      const palletId = api.consts.supersig.palletId.toString();

      const accounts = generateSupersigAccounts(nonce, palletId, chainSS58);

      for await (const account of accounts) {
        try {
          const data = await (api.rpc as any).superSig.listMembers(account.address);
          const members = data.toArray();

          if (members.length > 0) {
            addressArray.push(account.address);
          }
        } catch (_err) {
          /** An error occured */
        }
      }

      setSupersigAccounts(addressArray);
    };

    getSuperSigAddress();
  }, [api, isApiReady, nonce, chainSS58]);
  
  return (
    <>
      <Box sx={{ ...sxs.dashboard }}>
        <Summary
          liveProposalsCount={liveProposalsCount}
          totalFunds={formatBalance(totalFunds, decimals)}
          totalSupersigs={supersigs.length}
        />
        <Box sx={{ ...sxs.buttonGroup }}>
          {[
            {
              clickHandler: () => false,
              title: 'Create Org'
            },
            {
              clickHandler: () => false,
              title: 'Add Member'
            },
            {
              clickHandler: () => false,
              title: 'Propose'
            }
          ].map(({ clickHandler, title }, index) => (
            <Button
              key={index}
              onClick={clickHandler}
              sx={{ ...sxs.button }}
              variant='outlined'
            >
              {title}
            </Button>
          ))}
        </Box>
        <Typography variant='h5'>Organisations</Typography>
        <Table
          aria-label='simple table'
          sx={{ minWidth: 650 }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Supersig Collectives</TableCell>
              <TableCell>Live Proposals</TableCell>
              <TableCell>Balances of (Members)</TableCell>
              <TableCell>Supersig Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supersigs.map(
              (
                { account,
                  balance,
                  members,
                  proposals },
                index
              ) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component='th'
                    scope='row'
                  >
                    <AddressSmall value={account} />
                  </TableCell>
                  <TableCell>
                    <ProposalDetail
                      members={members}
                      proposals={proposals}
                      supersigAccount={account}
                    />
                  </TableCell>
                  <TableCell>
                    <BalanceDetail members={members} />
                  </TableCell>
                  <TableCell>
                    {formatBalance(balance, decimals)} UNIT
                  </TableCell>
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
