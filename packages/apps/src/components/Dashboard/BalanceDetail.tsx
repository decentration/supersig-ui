// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FC } from 'react';
import type { Balance, MemberInfo } from '../../types/index.js';

import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import React from 'react';

import { BN_ZERO } from '@polkadot/util';

import { useApi } from '../../contexts/index.js';
import { formatAccount, formatBalance } from '../../utils/index.js';
interface BalanceDetailInterface {
  members: Array<MemberInfo>;
}

export const BalanceDetail: FC<BalanceDetailInterface> = ({ members = [] }) => {
  const { decimals } = useApi();

  return (
    <Accordion sx={{ boxShadow: 'none' }}>
      <AccordionSummary
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        {formatBalance(
          members.reduce(
            (sum: Balance, { balance }) => sum.add(balance),
            BN_ZERO
          ),
          decimals + 6
        )}{' '}
        MUNIT ({members.length})
      </AccordionSummary>
      <AccordionDetails>
        {members.map((member, index) => (
          <Box key={index}>
            {formatAccount(member.account) + ' '}
            {formatBalance(member.balance, decimals + 6)} MUNIT
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
