import type { OverrideBundleDefinition } from '@polkadot/types/types';

const definitions: OverrideBundleDefinition = {
  rpc: {
    superSig: {
      getProposalState: {
        description: 'Get the proposal state',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId',
          },
          {
            name: 'call_id',
            type: 'CallId',
          },
        ],
        type: 'FetchProposalState',
      },
      getUserSupersigs: {
        description: 'Get supersigs associated to the user.',
        params: [
          {
            name: 'user_account',
            type: 'AccountId',
          },
        ],
        type: 'Vec<SupersigId>',
      },
      listMembers: {
        description: 'List members of the supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId',
          },
        ],
        type: 'Vec<(AccountId, Role)>',
      },
      listProposals: {
        description: 'List proposals associated to a supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId',
          },
        ],
        type: 'FetchListProposals',
      },
    },
  },
  types: [
    {
      minmax: [0, null],
      types: {
        CallId: 'u32',
        FetchListProposals: {
          proposals_info: 'ProposalStates',
          no_of_members: 'u32',
        },
        FetchProposalState: {
          proposal_info: 'ProposalState<AccountId>',
          no_of_members: 'u32',
        },
        ProposalState: {
          encoded_call: 'Vec<u8>',
          id: 'CallId',
          provider: 'AccountId',
          voters: 'Vec<AccountId>',
        },
        ProposalStates: 'Vec<ProposalState<AccountId>>',
        Role: {
          _enum: {
            Master: 'Vec<u8>',
            NotMember: 'Vec<u8>',
            Standard: 'Vec<u8>',
          },
        },
        SupersigId: 'u128',
      },
    },
  ],
};

export default definitions;
