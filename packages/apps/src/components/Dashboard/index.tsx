// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Account, Balance, MemberInfo, MemberRole, ProposalInfo, SupersigInfo } from '../../types/index.js';

import { Backdrop, Box, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { BN_ZERO } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { useApi } from '../../contexts/index.js';
import { formatAccount, formatBalance, getFreeBalance, getReservedBalance } from '../../utils/index.js';
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
  const { api, decimals, isConnecting, ss58Format } = useApi();
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
    const loadNonce = async () => {
      if (!api) {
        return;
      }

      await api.query.supersig.nonceSupersig((_nonce: any) =>
        setNonce(Number(_nonce.toPrimitive()))
      );
    };

    loadNonce();
  }, [api]);

  const fetchSupersigInfo = async (account: Account): Promise<SupersigInfo> => {
    const freeBalance = await getFreeBalance(api, account);
    const reservedBalance = await getReservedBalance(api, account);
    const balance = freeBalance.add(reservedBalance);

    const memberAccounts: Array<Account> = (
      await api.rpc.superSig.listMembers(account)
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

    const proposals: ProposalInfo = (
      await api.rpc.superSig.listProposals(account)
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

  useEffect(() => {
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
    if (!api) {
      return;
    }

    const getSuperSigAddress = async () => {
      const modl = '0x6d6f646c';
      const palletId = api.consts.supersig.palletId.toString();
      const addressArray: string[] = [];

      function* asyncGenerator() {
        let i = 0;

        while (i < nonce) {
          yield i++;
        }
      }

      const twoDigit = (number: number): string => {
        const twodigit = number >= 10 ? number : '0' + number.toString();

        return twodigit.toString();
      };

      for await (const num of asyncGenerator()) {
        const supersigConcat =
          modl +
          (palletId.slice(2, palletId.length) as string) +
          twoDigit(num) +
          '00000000000000000000000000000000000000';
        const account = encodeAddress(supersigConcat, ss58Format);

        try {
          const data = await api.rpc.superSig.listMembers(account);
          const members = data.toArray();

          if (members.length > 0) {
            addressArray.push(account.toString());
          }
        } catch (_err) {
          /** An error occured */
        }
      }

      setSupersigAccounts(addressArray);
    };

    getSuperSigAddress();
  }, [api, nonce]);

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
              <TableCell>supersig collectives</TableCell>
              <TableCell>live proposals</TableCell>
              <TableCell>balances of (members)</TableCell>
              <TableCell>supersig balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supersigs.map(
              (
                { account,
                  balance,
                  freeBalance,
                  members,
                  proposals,
                  reservedBalance },
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
                    {formatAccount(account)}
                  </TableCell>
                  <TableCell>
                    <ProposalDetail
                      members={members}
                      proposals={proposals}
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
        open={isConnecting || loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
};
