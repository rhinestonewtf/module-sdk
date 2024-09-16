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
  target: Address
  value: BigInt
  callData: Hex
}

export type InitialModules = {
  validators: Module[]
  executors: Module[]
  hooks: Module[]
  fallbacks: Module[]
}

export type ERC1271SignatureParams = {
  validator: Address
  signature: Hex
}

export type ERC1271HashParams = {
  account: Address
  chainId: number
  validator: Address
  hash: Hex
}
