import { Hex, Address } from 'viem'

export enum PolicyType {
  Action = 'Action',
  ERC1271 = 'ERC1271',
  UserOp = 'UserOp',
}

export type Policy = {
  policy: Address
  address: Address
  initData: Hex
}
