import { Box, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { chains } from "../../config/chains";
import { useAccounts } from "../../contexts/Accounts";
import { useApi } from "../../contexts/Api";
import { useChain } from "../../contexts/Chain";

interface RowProps {
  name: string | undefined,
  address: string,
  balance: string
}

function insertDecimal(numString: string, decimals: number) {
  // Pad with leading zeros if necessary
  while (numString.length <= decimals) {
    numString = '0' + numString;
  }

  // Calculate where to place the decimal
  const decimalPlace = numString.length - decimals;

  // Insert the decimal point
  const beforeDecimal = numString.slice(0, decimalPlace) || '0'; // Add a zero if there's nothing before the decimal
  const afterDecimal = numString.slice(decimalPlace);

  // Return the number string with inserted decimal
  return beforeDecimal + '.' + afterDecimal;
}

export const Accounts = () => {
  const { api } = useApi();
  const { accounts } = useAccounts();
  const { activeChain } = useChain();
  const [displayData, setDisplayData] = useState<Array<RowProps>>([]);
  const [emptyShow, showEmpty] = useState(true);

  const fetchBalances = async () => {

    const chainDecimals = chains.find((chain) => chain.name === activeChain?.name)?.decimals || 12;

    if (!api) return;

    try {
      const result:Array<RowProps> = [];

      await accounts.map(async (account) => {
        const accountInfo: any = await api.query.system.account(account.address);
        const balance = accountInfo.data.free;
        let balanceStr = balance.toString(10); // updated line
        
        balanceStr = insertDecimal(balanceStr, chainDecimals); // updated line

        result.push({
          name: account.meta.name,
          address: account.address,
          balance: balanceStr
        })
      });

      setDisplayData(result);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [api, activeChain]);

  return (
    <Box sx = {{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5">
        Accounts
      </Typography>

      <FormControlLabel
        control={
          <Checkbox checked={emptyShow} onChange={() => {
            showEmpty(emptyShow => !emptyShow);
          }}/>
        }
        label="Show empty balances"
      />

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            displayData
            .filter((row) => {
              if (!emptyShow && row.balance === '0.000000000000') return false;
              return true;
            })
            .map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="h6"> {row.name} </Typography>
                  <Typography variant="h6"> {row.address} </Typography>                 
                </TableCell>
                <TableCell>{row.balance}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Box>
  )
}
