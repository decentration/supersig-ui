// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Account, Balance } from '../types/index.js';

import { BN } from '@polkadot/util';

export const getFreeBalance = async (
  api: any,
  address: string
): Promise<Balance> => {
  const balance = await api.derive.balances.account(address);

  return balance.freeBalance as Balance;
};

export const getReservedBalance = async (
  api: any,
  address: string
): Promise<Balance> => {
  const balance = await api.derive.balances.account(address);

  return balance.reservedBalance as Balance;
};

/**
 * Converts an on chain balance value in BN planck to a decimal value in token unit (1 token token = 10^units planck)
 * @param val A BN that includes the balance in planck as it is stored on chain. It can be a very large number.
 * @param units the chain decimal points, that is used to calculate the balance denominator for the chain (e.g. 10 for polkadot, 12 for Kusama)
 * @returns A number that contains the equivalent value of the balance val in chain token unit. (e.g. DOT for polkadot, KSM for Kusama)
 */

export const planckBnToUnit = (val: BN, units: number): number => {
  // BN only supports integers.
  // We need to calculate the whole section and the decimal section separately and calculate the final representation by concatenating the two sections as string.
  const Bn10 = new BN(10);
  const BnUnits = new BN(units);
  const div = val.div(Bn10.pow(BnUnits));
  const mod = val.mod(Bn10.pow(BnUnits));

  // The whole portion in string
  const whole = div.toString();

  // The decimal fraction portion in string.
  // it is padded by '0's to achieve `units` number of decimal points.
  const decimal = mod.toString().padStart(units, '0');

  // the final number in string
  return Number(`${whole}.${decimal.substring(0, 5) || '0'}`);
};

export const humanNumber = (val: number): string => {
  const str = val.toString().split('.');

  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return str.join('.');
};

export const humanNumberBn = (valBn: BN, units: number): string => {
  const val = planckBnToUnit(valBn, units);

  return humanNumber(val);
};

export const formatBalance = (balance: BN, units: number): string => {
  const value = humanNumberBn(balance, units);
  const dot = value.indexOf('.');

  if (dot === -1) {
    return value + '.0000';
  }

  return (value + '00000').substring(0, dot + 5);
};

export const formatAccount = (account: Account): string => {
  return `${account.substring(0, 10)}...`;
};
