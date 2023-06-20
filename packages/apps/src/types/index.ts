// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';
import { BN } from '@polkadot/util';

export interface Chain {
  // rpc(rpc: any): unknown;
  name: string;
  ss58Format: number;
  rpcEndpoints: string[];
  definitions: OverrideBundleDefinition;
  decimals: number;
}

export type Balance = BN;
export type Account = string;

export type ProposalDetails = {
  encoded_call: string;
  id: number;
  provider: Account;
  voters: Array<Account>;
}

export type ProposalInfo = {
  proposals_info: Array<ProposalDetails>;
  no_of_members: number;
};

export type MemberRole = 'Standard' | 'Master' | 'NotMember';

export type MemberInfo = {
  account: Account;
  balance: Balance;
  role: MemberRole;
};

export type SupersigInfo = {
  account: Account;
  proposals: ProposalInfo;
  members: Array<MemberInfo>;
  balance: Balance;
  freeBalance: Balance;
  reservedBalance: Balance;
};
