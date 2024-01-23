import { Address, Hex } from 'viem'

export type AccountType = 'erc7579-implementation'

export type Account = {
  address: Address
  initCode: Hex
}

export type Action = {
  target: Address
  value: BigInt
  callData: Hex
}
