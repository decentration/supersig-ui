import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { BN_ZERO } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';
import { useEffect, useState } from 'react';

import Summary from './Summary';
import { useApi } from '../../contexts/Api';
import { Account, Balance, ProposalInfo, SupersigInfo } from '../../types';
import { formatBalance, getFreeBalance, getReservedBalance } from '../../utils';

const sxs = {
  dashboard: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3 
  },
  button: {
    borderRadius: 8,
    border: '1px solid rgb(221, 221, 221)',
    color: 'rgb(24, 24, 24)'    
  },
  buttonGroup: {
    display: 'flex',
    gap: 2    
  }
}

export const Dashboard = () => {
  const { api, ss58Format, isConnecting, decimals } = useApi();
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
      if (!api) return;

      await api.query.supersig.nonceSupersig((_nonce: any) =>
        setNonce(Number(_nonce.toPrimitive()))
      );
    };
    loadNonce();
  }, [api]);

  const fetchSupersigInfo = async (account: Account): Promise<SupersigInfo> => {
    const balance = await getFreeBalance(api, account);

    const memberAccounts: Array<Account> = (
      await api.rpc.superSig.listMembers(account)
    ).toPrimitive();

    const members = await Promise.all(
      memberAccounts.map(async (member) => {
        const account = member[0];
        const free = await getFreeBalance(api, account);
        const reserved = await getReservedBalance(api, account);
        return { account, balance: free.add(reserved) };
      })
    );

    const proposals: ProposalInfo = (
      await api.rpc.superSig.listProposals(account)
    ).toPrimitive();

    return { account, balance, members, proposals };
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
  }, [supersigAccounts]);

  useEffect(() => {
    if (!api) return;

    const getSuperSigAddress = async () => {
      const modl = '0x6d6f646c';
      const pallet_id = api.consts.supersig.palletId.toString();
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
        const supersig_concat =
          modl +
          pallet_id.slice(2, pallet_id.length) +
          twoDigit(num) +
          '00000000000000000000000000000000000000';
        const account = encodeAddress(supersig_concat, ss58Format);

        try {
          const data = await api.rpc.superSig.listMembers(account);
          const members = data.toArray();

          if (members.length > 0) {
            addressArray.push(account.toString());
          }
        } catch (err) {
          /**An error occured */
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
          totalSupersigs={supersigs.length}
          liveProposalsCount={liveProposalsCount}
          totalFunds={formatBalance(totalFunds, decimals)}
        />

        <Box sx={{ ...sxs.buttonGroup }}>
          {
            [
              {   
                title: 'Create Org',
                clickHandler: () => false 
              },
              {   
                title: 'Add Member',
                clickHandler: () => false
              },
              {   
                title: 'Propose',
                clickHandler: () => false
              },
            ].map(({ title, clickHandler }, index) => (
              <Button
                startIcon={<AddIcon />}
                variant='outlined'
                sx={{ ...sxs.button }}
                onClick={clickHandler}
                key = {index}
              >
                { title }
              </Button>  
            ))
          }
        </Box>

        <Typography variant='h5'>Organisations</Typography>

        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Active Proposals</TableCell>
              <TableCell>Members (Balance)</TableCell>
              <TableCell>Supersig Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supersigs.map(
              ({ account, proposals, members, balance }, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {account}
                  </TableCell>
                  <TableCell>{proposals.proposals_info.length}</TableCell>
                  <TableCell>
                    {formatBalance(
                      members.reduce(
                        (sum: Balance, { balance }) => sum.add(balance),
                        BN_ZERO
                      ),
                      decimals
                    )}
                  </TableCell>
                  <TableCell>{formatBalance(balance, decimals)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isConnecting || loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
};