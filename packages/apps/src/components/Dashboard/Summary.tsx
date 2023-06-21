// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Card, Grid, Typography } from '@mui/material';
import React, { type FC } from 'react';

interface SummaryProps {
  totalSupersigs: number;
  liveProposalsCount: number;
  totalFunds: string
}

const sxs = {
  criteria: {
    fontWeight: 'bold',
    marginBottom: 1.5
  },
  quantity: {
    fontSize: '1.2rem', fontWeight: 'regular'
  }
};

export const Summary: FC<SummaryProps> = ({ liveProposalsCount = 0,
  totalFunds = '0',
  totalSupersigs = 0 }) => {
  return (
    <Grid
      container
      spacing={2}
    >
      {
        [
          { criteria: 'Total Supersigs', quantity: totalSupersigs },
          { criteria: 'Active Proposals', quantity: liveProposalsCount },
          { criteria: 'Total Funds', quantity: totalFunds }
        ].map(({ criteria, quantity }, index) => (
          <Grid
            item
            key={index}
            xs={4}
          >
            <Card
              sx={{ borderRadius: 2, paddingX: 3, paddingY: 1.5 }}
              variant='outlined'
            >
              <Typography
                component='div'
                variant='h6'
              >
                <Box sx={{ ...sxs.criteria }}>
                  {criteria}
                </Box>
              </Typography>
              <Typography component='div'>
                <Box sx={{ ...sxs.quantity }}>
                  {quantity}
                </Box>
              </Typography>
            </Card>
          </Grid>
        ))
      }
    </Grid>
  );
};
