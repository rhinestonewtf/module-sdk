import { Address, Hex } from 'viem'
import { Module } from '../module/types'

export type AccountType = 'erc7579-implementation'

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
