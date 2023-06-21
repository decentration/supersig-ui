// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FC } from 'react';
import type { Account, Balance, MemberInfo, MemberRole, ProposalDetails, ProposalInfo } from '../../types/index.js';

import { Accordion, AccordionDetails, AccordionSummary, Box, Link } from '@mui/material';
import React from 'react';

import { useApi } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-params';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { formatBalance } from '../../utils/index.js';
import { ExpandMoreIcon } from '../Icon/index.js';

interface ProposalDetailInterface {
  supersigAccount: Account;
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
  const { tokenDecimals: decimals } = useApi();

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

export const ProposalDetail: FC<ProposalDetailInterface> = ({ members, proposals,
  supersigAccount }) => {
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

  const getVoteLink = (id: number) => {
    // FIXME: get the link with call encoding
    const nonce = u8aToHex(decodeAddress(supersigAccount)).toString();
    const link = `/extrinsic/0x2a026d6f646c69642f7375736967${nonce.slice(26, 28)}00000000000000000000000000000000000000${id}`;

    return link;
  };

  return (
    <Accordion sx={sxs.accordion}>
      <AccordionSummary
        aria-controls='panel1a-content'
        expandIcon={ExpandMoreIcon}
        id='panel1a-header'
      >
        {proposals.proposals_info.length}
      </AccordionSummary>
      <AccordionDetails>
        {proposals.proposals_info.map(
          ({ encoded_call, id, provider, voters }: ProposalDetails, index) => {
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
                  expandIcon={ExpandMoreIcon}
                  id='panel1a-header'
                >
                  {`${section}.${method}`}
                </AccordionSummary>
                <AccordionDetails>
                  <Accordion sx={sxs.accordion}>
                    <AccordionSummary
                      aria-controls='panel1a-content'
                      expandIcon={ExpandMoreIcon}
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
                  <Link
                    href={getVoteLink(id)}
                    sx={{ marginY: 2 }}
                  >
                    Vote
                  </Link>
                  <Accordion sx={sxs.accordion}>
                    <AccordionSummary
                      aria-controls='panel1a-content'
                      expandIcon={ExpandMoreIcon}
                      id='panel1a-header'
                    >
                      Proposal Info
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card
                        content={provider}
                        heading='proposer'
                      />
                      <br />
                      <CallExpander value={extrinsicCall} />
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
