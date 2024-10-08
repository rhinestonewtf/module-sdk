import { Address, Hex } from 'viem'
import { Module } from '../module/types'

export type AccountType = 'erc7579-implementation' | 'kernel' | 'safe' | 'nexus'

export type Account = {
  address: Address
  initCode?: Hex
  type: AccountType
  deployedOnChains: Number[]
}

export type Execution = {
  to: Address
  // note: target will be deprecated in the next major version; please use to instead
  target: Address
  value: BigInt
  // note: callData will be deprecated in the next major version; please use data instead
  callData: Hex
  data: Hex
}

export type InitialModules = {
  validators: Module[]
  executors: Module[]
  hooks: Module[]
  fallbacks: Module[]
}

export type ERC1271SignatureParams = {
  account: Address
  validator: Address
  signature: Hex
}

export type ERC1271HashParams = {
  account: Address
  chainId: number
  validator: Address
  hash: Hex
}
