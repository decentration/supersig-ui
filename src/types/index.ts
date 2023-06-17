import { OverrideBundleDefinition } from '@polkadot/types/types';
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

export type ProposalInfo = {
    proposals_info: Array<{
        encoded_call: string;
        id: number;
        provider: Account;
        voters: Array<Account>;
    }>;
    no_of_members: number;
};

export type SupersigInfo = {
    account: Account;
    proposals: ProposalInfo;
    members: Array<{
        account: Account;
        balance: Balance;
    }>
    balance: Balance;
};
