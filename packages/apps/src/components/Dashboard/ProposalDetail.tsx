// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FC } from 'react';
import type { Account, Balance, MemberInfo, MemberRole, ProposalDetails, ProposalInfo } from '../../types/index.js';

import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import React from 'react';

import { useApi } from '../../contexts/Api/index.js';
import { formatBalance } from '../../utils/index.js';

import { } from '@polkadot/react-components';

interface ProposalDetailInterface {
  proposals: ProposalInfo;
  members: Array<MemberInfo>;
}

interface VoterInterface {
  voter: Account;
  balance: Balance;
  role: MemberRole;
}

interface CardInterface {
  heading: string;
  content: string;
}

const sxs = {
  accordion: {
    border: '1px dotted grey',
    boxShadow: 'none',
    marginBottom: 1
  }
};

const Card: FC<CardInterface> = ({ content, heading }) => {
  return (
    <Box sx={{ border: '1px solid gray', paddingX: 2, paddingY: 1 }}>
      {heading}
      <p style={{ textTransform: heading === 'Role' ? 'capitalize' : 'none' }}>
        {content}
      </p>
    </Box>
  );
};

const Voter: FC<VoterInterface> = ({ balance, role, voter }) => {
  const { decimals } = useApi();

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 2 }}
    >
      {[
        { content: voter, heading: 'Voter' },
        { content: formatBalance(balance, decimals), heading: 'Balance' },
        { content: role, heading: 'Role' }
      ].map((item, index) => (
        <Card
          {...item}
          key={index}
        />
      ))}
    </Box>
  );
};

export const ProposalDetail: FC<ProposalDetailInterface> = ({ members,
  proposals }) => {
  const { api } = useApi();

  const getVoteInfo = (voter: Account) => {
    const member: MemberInfo = members.find(
      (member) => member.account === voter
    )!;

    return {
      balance: member.balance,
      role: member.role,
      voter
    };
  };

  return (
    <Accordion sx={sxs.accordion}>
      <AccordionSummary
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        {proposals.proposals_info.length}
      </AccordionSummary>
      <AccordionDetails>
        {proposals.proposals_info.map(
          ({ encoded_call, provider, voters }: ProposalDetails, index) => {
            const extrinsicCall = api.createType(
              'Call',
              encoded_call.toString()
            );

            const { method, section } = api.registry.findMetaCall(
              extrinsicCall.callIndex
            );

            return (
              <Accordion
                key={index}
                sx={sxs.accordion}
              >
                <AccordionSummary
                  aria-controls='panel1a-content'
                  id='panel1a-header'
                >
                  {`${section}.${method}`}
                </AccordionSummary>
                <AccordionDetails>
                  <Accordion sx={sxs.accordion}>
                    <AccordionSummary
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      {`Voters(${voters.length}/${proposals.no_of_members})`}
                    </AccordionSummary>
                    <AccordionDetails>
                      {voters.map((voterId: Account, i: number) => (
                        <Voter
                          key={i}
                          {...getVoteInfo(voterId)}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                  <Button
                    sx={{ marginY: 2 }}
                    variant='outlined'
                  >
                    Vote
                  </Button>
                  <Accordion sx={sxs.accordion}>
                    <AccordionSummary
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                    >
                      Proposal Info
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card
                        content={provider}
                        heading='proposer'
                      />
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>
            );
          }
        )}
      </AccordionDetails>
    </Accordion>
  );
};
